import asyncio
import json
import os
from datadog_lambda.wrapper import datadog_lambda_wrapper
from chalice import Chalice, CORSConfig, ConvertToMiddleware, Response

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
