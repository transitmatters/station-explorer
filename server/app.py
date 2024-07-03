import asyncio
import json
import os
from datadog_lambda.wrapper import datadog_lambda_wrapper
from chalice import Chalice, CORSConfig, ConvertToMiddleware, Response

from chalicelib.mbta_api import getV3

app = Chalice(app_name="server")

localhost = "localhost:3000"
TM_CORS_HOST = os.environ.get("TM_CORS_HOST", localhost)

if TM_CORS_HOST != localhost:
    app.register_middleware(ConvertToMiddleware(datadog_lambda_wrapper))
    cors_config = CORSConfig(allow_origin=f"https://{TM_CORS_HOST}", max_age=3600)
else:
    cors_config = CORSConfig(allow_origin="*", max_age=3600)


@app.route("/elevators/{station_id}", cors=cors_config)
def elevators(station_id):
    stop_data = asyncio.run(getV3("facilities", {"filter[stop]": station_id, "filter[type]": "ELEVATOR"}))
    return Response(json.dumps(stop_data), headers={"Content-Type": "application/json"})


# The view function above will return {"hello": "world"}
# whenever you make an HTTP GET request to '/'.
#
# Here are a few more examples:
#
# @app.route('/hello/{name}')
# def hello_name(name):
#    # '/hello/james' -> {"hello": "james"}
#    return {'hello': name}
#
# @app.route('/users', methods=['POST'])
# def create_user():
#     # This is the JSON body the user sent in their POST request.
#     user_as_json = app.current_request.json_body
#     # We'll echo the json body back to the user in a 'user' key.
#     return {'user': user_as_json}
#
# See the README documentation for more examples.
#
