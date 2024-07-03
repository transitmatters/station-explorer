import { useQuery } from '@tanstack/react-query';
import type { Station } from '../types/station';
import { APP_DATA_BASE_PATH } from '../constants/site';
import type { Elevator } from '../types/facilities';

export const getElevators = async (station: Station): Promise<Elevator[]> => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/elevators/${station.station}`);
  const json = await response.json();

  return json;
};

export const useGetElevatorsForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getElevators`, station],
    queryFn: () => getElevators(station),
    staleTime: 86400,
  });
};
