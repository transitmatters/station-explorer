import { useQueries, useQuery } from '@tanstack/react-query';
import { APP_DATA_BASE_PATH } from '../constants/site';
import { ONE_YEAR } from '../constants/time';
import type { Shape } from '../types/shape';
import { MBTA_ROUTES } from '../constants/line';
import type { MBTARoute } from '../types/line';

export const getRouteShape = async (route: MBTARoute): Promise<Shape[]> => {
  const response = await fetch(`${APP_DATA_BASE_PATH}/api/shape/${route}`);
  const json = await response.json();

  const data = json.map((shape: Shape) => {
    return { route: route, ...shape };
  });

  return data;
};

export const useGetRouteShapeForRoute = (route: MBTARoute) => {
  return useQuery({
    queryKey: [`getRouteShape`, route],
    queryFn: () => getRouteShape(route),
    staleTime: ONE_YEAR,
  });
};

export const useGetRouteShapeForAllRoutes = () => {
  return useQueries({
    queries: MBTA_ROUTES.map((route) => ({
      queryKey: [`getRouteShape`, route],
      queryFn: () => getRouteShape(route),
      staleTime: ONE_YEAR,
    })),
  });
};
