import { useQuery } from '@tanstack/react-query';
import type { WalkScore } from '../types/walkscore';
import type { Station } from '../types/station';
import { ONE_DAY } from '../constants/time';

const WALKSCORE_PROXY =
  process.env.NODE_ENV === 'production'
    ? 'https://walkscore.labs.transitmatters.org'
    : 'http://127.0.0.1:5001';

export const getWalkscore = async (station: Station): Promise<WalkScore> => {
  const response = await fetch(`${WALKSCORE_PROXY}/api/walkscore/${station.station}`);
  const json = await response.json();

  return json;
};

export const useGetWalkscoreForStation = (station: Station) => {
  return useQuery({
    queryKey: [`getWalkscore`, station],
    queryFn: () => getWalkscore(station),
    staleTime: ONE_DAY,
  });
};
