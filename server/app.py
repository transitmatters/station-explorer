import asyncio
import json
import os
import time
from datadog_lambda.wrapper import datadog_lambda_wrapper
from chalice import Chalice, CORSConfig, ConvertToMiddleware, NotFoundError, Response

from chalicelib import overpass
from chalicelib.mbta_api import getV3

app = Chalice(app_name="station-explorer")

localhost = "localhost:3000"
TM_CORS_HOST = os.environ.get("TM_CORS_HOST", localhost)

if TM_CORS_HOST != localhost:
    app.register_middleware(ConvertToMiddleware(datadog_lambda_wrapper))
    cors_config = CORSConfig(allow_origin=f"https://{TM_CORS_HOST}", max_age=3600)
else:
    cors_config = CORSConfig(allow_origin="*", max_age=3600)


@app.route("/api/facilities/{station_id}", cors=cors_config)
def facilities(station_id):
    stop_data = asyncio.run(
        getV3(
            "facilities",
            {"filter[stop]": station_id},
        )
    )
    return Response(json.dumps(stop_data), headers={"Content-Type": "application/json"})


@app.route("/api/routes/{station_id}", cors=cors_config)
def routes(station_id):
    stop_data = asyncio.run(
        getV3(
            "routes",
            {"filter[stop]": station_id},
        )
    )
    return Response(json.dumps(stop_data), headers={"Content-Type": "application/json"})


@app.route("/api/alerts/{station_id}", cors=cors_config)
def alerts(station_id):
    stop_data = asyncio.run(
        getV3(
            "alerts",
            {
                "filter[stop]": station_id,
                "filter[activity]": "BOARD,EXIT,RIDE,USING_ESCALATOR,BRINGING_BIKE,USING_WHEELCHAIR,STORE_BIKE,PARK_CAR",
            },
        )
    )
    return Response(json.dumps(stop_data), headers={"Content-Type": "application/json"})


@app.route("/api/shape/{route}", cors=cors_config)
def route_pattern(route):
    stop_data = asyncio.run(
        getV3(
            "shapes",
            {
                "filter[route]": route,
            },
        )
    )
    return Response(json.dumps(stop_data), headers={"Content-Type": "application/json"})


# OpenStreetMap data within walking distance of a station. layer is one of overpass.QUERIES.
# Cache-Control lets the CloudFront distribution in front of this API share one response
# between visitors until the S3-cached result expires, so most page loads never reach Lambda.
@app.route("/api/osm/{layer}/{station_id}", cors=cors_config)
def osm(layer, station_id):
    if layer not in overpass.QUERIES or station_id not in overpass.STATION_COORDINATES:
        raise NotFoundError(f"No OSM layer {layer} for station {station_id}")
    try:
        data, expires_at = asyncio.run(overpass.get_osm_data(layer, station_id))
    except Exception as e:
        print(f"Failed to get OSM {layer} data for {station_id}: {e!r}")
        return Response(
            json.dumps({"error": "OpenStreetMap data is unavailable"}),
            status_code=502,
            headers={"Content-Type": "application/json", "Cache-Control": "no-store"},
        )
    max_age = max(int(expires_at - time.time()), 0)
    return Response(
        json.dumps(data, separators=(",", ":")),
        headers={"Content-Type": "application/json", "Cache-Control": f"public, max-age={max_age}"},
    )
