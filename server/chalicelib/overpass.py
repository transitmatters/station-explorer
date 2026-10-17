"""
overpass.py fetches OpenStreetMap data around stations from the Overpass API

Public Overpass servers are often down or rate limited, so results are cached in S3 indefinitely.
Copies older than 72 hours are refreshed when Overpass answers quickly enough and otherwise served
as-is: weeks-old parking and bike data is far more useful than none.
"""

import hashlib
import json
import os
import ssl
import time
from pathlib import Path

import aiohttp
import boto3
import certifi

# Must match WALKING_RADIUS in src/constants/mobility.ts
WALKING_RADIUS = 1000

# Public Overpass instances, tried in order when one is down or rate limiting us.
# Only add instances with worldwide coverage: regional ones (e.g. overpass.osm.ch,
# overpass.openstreetmap.ru) return a successful empty result for Boston, which
# would never fall through and would be cached as if there were nothing there.
OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
]
USER_AGENT = "station-explorer (https://github.com/transitmatters/station-explorer)"
# maps.mail.ru chains to HARICA's 2021 root, which some system CA bundles don't include yet
SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())

# All attempts share one deadline. With nothing cached we wait as long as API Gateway's 29s
# limit allows, since a loaded mirror can take ~15s on a dense station. When refreshing an
# expired copy we give up sooner and serve that copy instead.
REQUEST_DEADLINE = 25
REFRESH_DEADLINE = 15

# The OSM data around a station rarely changes, so results stay fresh for 72 hours
CACHE_TTL = 72 * 60 * 60
# When a refresh fails and we serve an expired copy, check again after an hour
STALE_TTL = 60 * 60

# Unset in local development, where results aren't cached
CACHE_BUCKET = os.environ.get("OSM_CACHE_BUCKET")
_s3 = boto3.client("s3") if CACHE_BUCKET else None

# Symlink to src/constants/stations.json so the frontend and backend share one copy
with open(Path(__file__).parent / "stations.json") as f:
    # Coordinates are stored as [lon, lat]
    STATION_COORDINATES = {station["station"]: station["coordinates"] for station in json.load(f)}


def _parking_query(lat, lon, include_garages):
    garage_filters = (
        ""
        if include_garages
        else '["parking"!~"garage"]["parking"!~"multi-storey"]["building"!~"yes"]["parking"!~"underground"]'
    )
    return f"""[timeout:30][out:json];
wr(around:{WALKING_RADIUS},{lat},{lon})["amenity"="parking"]["parking"!~"street_side"]{garage_filters};
(._;>;);
out body;"""


def _bike_lanes_query(lat, lon):
    around = f"around:{WALKING_RADIUS},{lat},{lon}"
    return f"""[timeout:30][out:json];
(
  wr({around})["highway"="cycleway"];
  wr({around})["cycleway"]["cycleway"!="no"];
  wr({around})["cycleway:left"]["cycleway:left"!="no"];
  wr({around})["cycleway:right"]["cycleway:right"!="no"];
  wr({around})["cycleway:both"]["cycleway:both"!="no"];
);
(._;>;);
out body;"""


def _bike_share_query(lat, lon):
    return f"""[timeout:30][out:json];
nw(around:{WALKING_RADIUS},{lat},{lon})["amenity"="bicycle_rental"];
(._;>;);
out body;"""


QUERIES = {
    "parking": lambda lat, lon: _parking_query(lat, lon, include_garages=False),
    "parking-all": lambda lat, lon: _parking_query(lat, lon, include_garages=True),
    "bike-lanes": _bike_lanes_query,
    "bike-share": _bike_share_query,
}


class OverpassBadRequestError(Exception):
    pass


async def _fetch_overpass(query, time_budget=REQUEST_DEADLINE):
    deadline = time.monotonic() + time_budget
    last_error = None
    connector = aiohttp.TCPConnector(ssl=SSL_CONTEXT)
    async with aiohttp.ClientSession(connector=connector, headers={"User-Agent": USER_AGENT}) as session:
        for endpoint in OVERPASS_ENDPOINTS:
            remaining = deadline - time.monotonic()
            if remaining < 1:
                break
            try:
                timeout = aiohttp.ClientTimeout(total=remaining)
                async with session.post(endpoint, data={"data": query}, timeout=timeout) as response:
                    if response.status == 400:
                        raise OverpassBadRequestError(await response.text())
                    response.raise_for_status()
                    data = await response.json(content_type=None)
                # Timeouts and out-of-memory errors come back as a 200 with partial data
                if "runtime error" in data.get("remark", ""):
                    raise Exception(data["remark"])
                return data
            except OverpassBadRequestError:
                # A malformed query fails the same way everywhere, so don't try other endpoints
                raise
            except Exception as e:
                print(f"Overpass request to {endpoint} failed: {e!r}")
                last_error = e
    raise last_error or TimeoutError("Ran out of time before trying every Overpass endpoint")


# S3 problems shouldn't take OSM data down with them, so cache errors are logged and skipped
def _read_cache(key):
    try:
        cached = _s3.get_object(Bucket=CACHE_BUCKET, Key=key)
        return json.loads(cached["Body"].read()), cached["LastModified"].timestamp()
    except _s3.exceptions.NoSuchKey:
        return None
    except Exception as e:
        print(f"Failed to read cached OSM data {key}: {e!r}")
        return None


def _write_cache(key, data):
    try:
        _s3.put_object(
            Bucket=CACHE_BUCKET,
            Key=key,
            Body=json.dumps(data, separators=(",", ":")),
            ContentType="application/json",
        )
    except Exception as e:
        print(f"Failed to cache OSM data {key}: {e!r}")


# returns (data, expires_at), where expires_at is the epoch time after which shared caches should refetch
async def get_osm_data(layer, station_id):
    lon, lat = STATION_COORDINATES[station_id]
    query = QUERIES[layer](lat, lon)
    if not _s3:
        return await _fetch_overpass(query), time.time() + CACHE_TTL

    # Keying on the query text means changing a query, radius or station coordinates skips old results
    key = f"osm/{layer}/{station_id}-{hashlib.sha256(query.encode()).hexdigest()[:12]}.json"
    cached = _read_cache(key)
    if cached:
        data, cached_at = cached
        if time.time() - cached_at < CACHE_TTL:
            return data, cached_at + CACHE_TTL

    try:
        data = await _fetch_overpass(query, REFRESH_DEADLINE if cached else REQUEST_DEADLINE)
    except Exception as e:
        if not cached:
            raise
        age_days = (time.time() - cached[1]) / (24 * 60 * 60)
        print(f"Serving {age_days:.1f} day old OSM data for {key} after Overpass failed: {e!r}")
        return cached[0], time.time() + STALE_TTL

    # Only a successful fetch replaces the cached copy
    _write_cache(key, data)
    return data, time.time() + CACHE_TTL
