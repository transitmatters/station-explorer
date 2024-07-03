"""
mbta_api.py provides functions dealing with interactions with the MBTA V3 API

"""

from urllib.parse import urlencode
import datetime
import pytz
import json_api_doc
import os
import aiohttp


BASE_URL_V3 = "https://api-v3.mbta.com/{command}?{parameters}"


# wrapper around MBTA V3 API
# used to simplify API calls
# returns JSON of requested data
async def getV3(command, params={}, session=None):
    """Make a GET request against the MBTA v3 API"""
    url = BASE_URL_V3.format(command=command, parameters=urlencode(params))
    api_key = os.environ.get("MBTA_V3_API_KEY", "")
    headers = {"x-api-key": api_key} if api_key else {}

    async def inner(some_session):
        async with some_session.get(url, headers=headers) as response:
            response_json = await response.json()
            eastern = pytz.timezone("US/Eastern")
            now_eastern = datetime.datetime.now(eastern)
            if response.status >= 400:
                raise Exception(f"[{now_eastern}] API returned {response.status} for {url} -- it says {response_json}")
            try:
                return json_api_doc.parse(response_json)
            except Exception as e:
                raise e

    if session is None:
        async with aiohttp.ClientSession() as local_session:
            return await inner(local_session)
    else:
        return await inner(session)
