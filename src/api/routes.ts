import { useQuery } from '@tanstack/react-query';
import type { Station } from '../types/station';
import { APP_DATA_BASE_PATH } from '../constants/site';
import { ONE_DAY } from '../constants/time';
import type { Route } from '../types/routes';

export const getRoutes = async (station: Station): Promise<Route[]> => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/api/routes/${station.station}`);
  const json = await response.json();

  return json;
};

export const useGetRoutesForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getRoutes`, station],
    queryFn: () => getRoutes(station),
    staleTime: ONE_DAY,
  });
};
