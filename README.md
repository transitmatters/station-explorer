# TransitMatters Station Explorer

This is the repository for the TransitMatters Station Explorer. Client code is written in Typescript with React and vite, and the minimal backend is written in Python with Chalice.

## Requirements to develop locally

- node 24.x and npm 11+ required
  - With `nvm` installed, use `nvm install && nvm use`
  - verify with `node -v`
- Python 3.13 with recent poetry (1.7.0 or later)
  - Verify with `python --version && poetry --version`
  - `poetry self update` to update poetry
  - If using `pyenv`, `pyenv install 3.13.0`

- If using `mise` or you can install all of the above with `mise install`.

## Development Instructions

1. In the root directory, run `npm install` to install all frontend and backend dependencies
2. Run `npm start` to start both the Vite development server and the Python backend at the same time.
   1. `npm run dev` to just run the Vite development server
   2. `npm run start-python` to just run the Chalice backend server
3. Navigate to [http://localhost:3000](http://localhost:3000) (or the url provided after running `npm start`)

Walk Scores come from the separate [walkscore-proxy](https://github.com/transitmatters/walkscore-proxy) service, which the frontend expects at `http://localhost:5001` in development.

## Project Structure

```
src/
  api/          # React Query hooks for the backend, Walk Score proxy, and Overpass (OpenStreetMap)
  components/   # React components (map/ has the Leaflet map and layers)
  constants/    # Hand-maintained station and bathroom data (stations.json, bathrooms.json)
  routes/       # TanStack Router routes; routeTree.gen.ts is generated from these
server/
  app.py        # Chalice routes that proxy the MBTA V3 API (facilities, routes, alerts, shapes)
  chalicelib/   # MBTA V3 API client
```

## Local Deployment Instructions

You shouldn't need to do this, merging to `main` will deploy to production. However if you need to, follow these to deploy form a local machine.

1. Configure AWS CLI 1.x or 2.x with your AWS access key ID and secret under the profile name `transitmatters`.
2. Configure shell environment variables for AWS ACM domain certificates.
   - `TM_LABS_WILDCARD_CERT_ARN`
   - (You may also need to set `AWS_DEFAULT_REGION` in your shell to `us-east-1`. Maybe not! We're not sure.)
   - `DD_API_KEY` (Datadog API key, needed to deploy to TransitMatters stack in prod)
3. Execute `./deploy.sh`.

### Linting

To lint frontend and backend code, run `npm run lint` in the root directory

To lint just frontend code, run `npm run lint-frontend`

To lint just backend code, run `npm run lint-backend`

#### VSCode

If you're using VSCode, `.vscode` contains a based default workspace setup. It also includes recommended extentions that will improve the dev experience. This config is meant to be as small as possible to enable an "out of the box" easy experience for handling eslint.

## Support TransitMatters

If you've found this app helpful or interesting, please consider [donating](https://transitmatters.org/donate) to TransitMatters to help support our mission to provide data-driven advocacy for a more reliable, sustainable, and equitable transit system in Metropolitan Boston.
