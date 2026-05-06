// Curated MBTA station bathroom data.
//
// Source (initial seed): Miles in Transit's unofficial MBTA bathroom map.
//   https://milesintransit.com/2019/09/01/the-unofficial-mbta-bathroom-map/
//   https://www.google.com/maps/d/u/0/viewer?mid=1p9qGlMr_bbXufuX5Uw0jXNuLLiuh-Un3
//
// Edit src/constants/bathrooms.json directly to add, fix, or remove entries.
// Keys are the MBTA "place-…" station id (matching stations.json). Set
// `available: false` to explicitly mark a station as having no bathroom.

import bathroomsJson from './bathrooms.json';

export interface BathroomInfo {
  available: boolean;
  /** Short description of where the bathroom is at the station. */
  location?: string;
  /** Whether the bathroom is wheelchair accessible. */
  accessible?: boolean;
  /** Any caveats: hours, locked, ask agent, etc. */
  notes?: string;
}

const BATHROOMS = bathroomsJson as Record<string, BathroomInfo>;

export const getBathroomForStation = (stationId: string): BathroomInfo | undefined =>
  BATHROOMS[stationId];
