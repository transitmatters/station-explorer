export const PRODUCTION = 'stations.transitmatters.org';
export const BETA = 'stations.labs.transitmatters.org';
export const LOCAL = '127.0.0.1';
export const LOCALHOST = 'localhost';
const FRONTEND_TO_BACKEND_MAP = {
  [PRODUCTION]: 'https://stations-api.labs.transitmatters.org',
  [BETA]: 'https://stations-api.labs.transitmatters.org',
  [LOCAL]: '',
  [LOCALHOST]: '',
};

let domain = '';
if (typeof window !== 'undefined') {
  domain = window.location.hostname;
}
// @ts-expect-error TS struggles to make the map
export const APP_DATA_BASE_PATH = FRONTEND_TO_BACKEND_MAP[domain] || '';
