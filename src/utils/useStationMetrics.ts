import length from '@turf/length';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useGetWalkscoreForStation } from '../api/walkscore';
import { useGetFacilitiesForStation } from '../api/facilities';
import { useGetAlertsForStation } from '../api/alerts';
import { useGetRoutesForStation } from '../api/routes';
import { useGetBikeShareDataForStation, useGetCyclePathDataForStation } from '../api/overpass';
import { WALKING_RADIUS } from '../constants/mobility';
import { COMMUTER_RAIL_LINES } from '../constants/line';
import type { Station } from '../types/station';
import type { Elevator, Escalator } from '../types/facilities';
import { useParkingStats } from './parking';

export const useStationMetrics = (station: Station) => {
  const walkscore = useGetWalkscoreForStation(station);
  const facilities = useGetFacilitiesForStation(station);
  const alerts = useGetAlertsForStation(station);
  const routes = useGetRoutesForStation(station);

  const { data: bikeData, isLoading: isBikeDataLoading } = useGetCyclePathDataForStation(
    station,
    WALKING_RADIUS
  );
  const { data: bikeShareData, isLoading: isBikeShareDataLoading } = useGetBikeShareDataForStation(
    station,
    WALKING_RADIUS
  );

  const parking = useParkingStats(station, WALKING_RADIUS);

  const elevators = facilities.data?.filter?.(
    (facility) => facility.type === 'ELEVATOR'
  ) as Elevator[] | undefined;
  const elevatorAlerts = alerts.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );
  const escalators = facilities.data?.filter?.(
    (facility) => facility.type === 'ESCALATOR'
  ) as Escalator[] | undefined;
  const escalatorAlerts = alerts.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_ESCALATOR'))
  );
  const levelBoarding = facilities.data?.filter?.(
    (facility) => facility.type === 'FULLY_ELEVATED_PLATFORM'
  );
  const miniHighPlatforms = facilities.data?.filter?.(
    (facility) => facility.type === 'ELEVATED_SUBPLATFORM'
  );

  const bikeGeojson: FeatureCollection<Geometry, GeoJsonProperties> = bikeData
    ? {
        ...bikeData,
        features: bikeData.features.filter((f) => f.geometry.type !== 'Point'),
      }
    : { features: [], type: 'FeatureCollection' };
  const bikeLength = length(bikeGeojson, { units: 'miles' });

  const isCommuterRail = station.lines.some((line) => COMMUTER_RAIL_LINES.includes(line));

  return {
    walkscore: walkscore.data,
    routes: routes.data,
    elevators,
    elevatorAlerts,
    escalators,
    escalatorAlerts,
    levelBoarding,
    miniHighPlatforms,
    bikeLength,
    bikeData,
    isBikeDataLoading,
    bikeShareData,
    isBikeShareDataLoading,
    isCommuterRail,
    ...parking,
  };
};

export type StationMetrics = ReturnType<typeof useStationMetrics>;
