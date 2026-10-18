import { useQuery } from '@tanstack/react-query';
import osmtogeojson from 'osmtogeojson';
import type { Station } from '../types/station';
import { APP_DATA_BASE_PATH } from '../constants/site';
import { ONE_DAY } from '../constants/time';

// OpenStreetMap layers served by the backend's /api/osm route, which queries Overpass within
// walking distance of the station (WALKING_RADIUS) and caches the results for 72 hours.
type OsmLayer = 'parking' | 'parking-all' | 'bike-lanes' | 'bike-share';

// The backend already falls back across Overpass servers and serves its cached copy when
// they're all down, so a failure here is worth just one retry.
const osmQueryOptions = {
  staleTime: ONE_DAY,
  gcTime: ONE_DAY,
  retry: 1,
  retryDelay: 5000,
};

const getOsmDataForStation = async (station: Station, layer: OsmLayer) => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/api/osm/${layer}/${station.station}`);
  if (!response.ok) {
    throw new Error(`Failed to load OSM ${layer} data for ${station.station}: ${response.status}`);
  }
  return osmtogeojson(await response.json());
};

export const useGetDataForStation = (station: Station, includeGarages: boolean = false) => {
  const layer = includeGarages ? 'parking-all' : 'parking';
  return useQuery({
    queryKey: [`getStationParkingData`, station.station, layer],
    queryFn: () => getOsmDataForStation(station, layer),
    ...osmQueryOptions,
  });
};

export const useGetCyclePathDataForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getStationBikeData`, station.station],
    queryFn: () => getOsmDataForStation(station, 'bike-lanes'),
    ...osmQueryOptions,
  });
};

export const useGetBikeShareDataForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getStationBikeShareData`, station.station],
    queryFn: () => getOsmDataForStation(station, 'bike-share'),
    ...osmQueryOptions,
  });
};
