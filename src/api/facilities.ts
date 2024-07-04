import { useQuery } from '@tanstack/react-query';
import type { Station } from '../types/station';
import { APP_DATA_BASE_PATH } from '../constants/site';
import { TWELVE_HOURS } from '../constants/time';
import type { Facility } from '../types/facilities';

export const getFacilities = async (station: Station): Promise<Facility[]> => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/api/facilities/${station.station}`);
  const json = await response.json();

  return json;
};

export const useGetFacilitiesForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getFacilities`, station],
    queryFn: () => getFacilities(station),
    staleTime: TWELVE_HOURS,
  });
};
