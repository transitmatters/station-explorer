import { useQuery } from '@tanstack/react-query';
import type { Station } from '../types/station';
import { APP_DATA_BASE_PATH } from '../constants/site';
import { ONE_HOUR } from '../constants/time';
import type { Alert } from '../types/alerts';

export const getAlerts = async (station: Station): Promise<Alert[]> => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/api/alerts/${station.station}`);
  const json = await response.json();

  return json;
};

export const useGetAlertsForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getAlerts`, station],
    queryFn: () => getAlerts(station),
    staleTime: ONE_HOUR,
  });
};
