# TransitMatters Station Explorer

This is the repository for the TransitMatters Station Explorer. Client code is written in Typescript with React and vite, and the minimal backend is written in Python with Chalice.

## Requirements to develop locally

- node 24.x and npm 11+ required
  - verify with `node -v`
- Python 3.13 and [uv](https://docs.astral.sh/uv/)
  - Verify with `python --version && uv --version`
- With [mise](https://mise.jdx.dev) installed, `mise trust && mise install` sets up all of the above (versions are pinned in `.nvmrc` / `.python-version`)

## Development Instructions

1. In the root directory, run `npm install` to install all frontend and backend dependencies (it runs `uv sync` for the backend and installs a pre-commit hook that runs Ruff)
2. Run `npm start` to start both the Vite development server and the Python backend at the same time.
   1. `npm run dev` to just run the Vite development server
   2. `npm run start-python` to just run the Chalice backend server
3. Navigate to [http://localhost:3000](http://localhost:3000) (or the url provided after running `npm start`)

Walk Scores come from the separate [walkscore-proxy](https://github.com/transitmatters/walkscore-proxy) service, which the frontend expects at `http://localhost:5001` in development.

## Project Structure

```
src/
  api/          # React Query hooks for the backend (including cached OpenStreetMap data) and Walk Score proxy
  components/   # React components (map/ has the Leaflet map and layers)
  constants/    # Hand-maintained station and bathroom data (stations.json, bathrooms.json)
  routes/       # TanStack Router routes; routeTree.gen.ts is generated from these
server/
  app.py        # Chalice routes that proxy the MBTA V3 API (facilities, routes, alerts, shapes) and OpenStreetMap data
  chalicelib/   # MBTA V3 API client and cached Overpass (OpenStreetMap) queries
```

## Linting

To lint frontend and backend code, run `npm run lint` in the root directory

To lint just frontend code, run `npm run lint-frontend`

To lint just backend code, run `npm run lint-backend`. The backend is linted and formatted with [Ruff](https://docs.astral.sh/ruff/); `uv run ruff format .` fixes formatting.

### VSCode

If you're using VSCode, `.vscode` contains a basic default workspace setup. It also includes recommended extensions that will improve the dev experience. This config is meant to be as small as possible to enable an "out of the box" easy experience for handling ESLint, Prettier, and Ruff.

## Data Sources

- Station facilities, routes, alerts, and shapes come from the [MBTA V3 API](https://www.mbta.com/developers/v3-api).
- Parking, bike lanes, and bike share data come from [OpenStreetMap](https://www.openstreetmap.org/copyright) via the Overpass API (© OpenStreetMap contributors, ODbL).
- Map tiles are from [Stadia Maps](https://www.stadiamaps.com/) and [OpenMapTiles](https://openmaptiles.org/).
- Walk Scores come from [Walk Score](https://www.walkscore.com) through [walkscore-proxy](https://github.com/transitmatters/walkscore-proxy).
- Bathroom information was initially seeded from Miles in Transit's [Unofficial MBTA Bathroom Map](https://milesintransit.com/2019/09/01/the-unofficial-mbta-bathroom-map/).

## Contributing

TransitMatters is volunteer-run. If you'd like to contribute, please fill out our [volunteer form](https://transitmatters.org/volunteer) and open a PR. If you're using an AI coding agent, see [AGENTS.md](AGENTS.md).

## Deployment (Maintainers)

Merging to `main` deploys to production, so you shouldn't need to do this. These steps are for TransitMatters maintainers with AWS access who need to deploy from a local machine.

1. Configure AWS CLI 1.x or 2.x with your AWS access key ID and secret under the profile name `transitmatters`.
2. Set `AWS_DEFAULT_REGION=us-east-1` and the following environment variables:
   - `TM_LABS_WILDCARD_CERT_ARN` (ACM certificate for `*.labs.transitmatters.org`)
   - `DD_API_KEY` (Datadog API key)
   - `MBTA_V3_API_KEY` (MBTA V3 API key)
3. Execute `./deploy.sh`.

## Support TransitMatters

If you've found this app helpful or interesting, please consider [donating](https://transitmatters.org/donate) to TransitMatters to help support our mission to provide data-driven advocacy for a more reliable, sustainable, and equitable transit system in Metropolitan Boston.
