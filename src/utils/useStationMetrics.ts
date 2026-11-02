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
import type { Elevator, Escalator, Facility, FacilityType } from '../types/facilities';
import { getBathroomForStation } from '../constants/bathrooms';
import { useParkingStats } from './parking';

export const useStationMetrics = (station: Station) => {
  const walkscore = useGetWalkscoreForStation(station);
  const facilities = useGetFacilitiesForStation(station);
  const alerts = useGetAlertsForStation(station);
  const routes = useGetRoutesForStation(station);

  const {
    data: bikeData,
    isLoading: isBikeDataLoading,
    isError: isBikeDataError,
  } = useGetCyclePathDataForStation(station);
  const {
    data: bikeShareData,
    isLoading: isBikeShareDataLoading,
    isError: isBikeShareDataError,
  } = useGetBikeShareDataForStation(station);

  const parking = useParkingStats(station, WALKING_RADIUS);

  const elevators = facilities.data?.filter?.((facility) => facility.type === 'ELEVATOR') as
    Elevator[] | undefined;
  const elevatorAlerts = alerts.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );
  const escalators = facilities.data?.filter?.((facility) => facility.type === 'ESCALATOR') as
    Escalator[] | undefined;
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

  const facilitiesByType = (...types: FacilityType[]): Facility[] | undefined => {
    if (!facilities.data) return undefined;
    return facilities.data.filter((f) => types.includes(f.type));
  };

  const amenities = {
    bikeStorage: facilitiesByType('BIKE_STORAGE'),
    parkingArea: facilitiesByType('PARKING_AREA'),
    fareVending: facilitiesByType('FARE_VENDING_MACHINE', 'FARE_VENDING_RETAILER'),
    fareAssistance: facilitiesByType(
      'FARE_MEDIA_ASSISTANT',
      'FARE_MEDIA_ASSISTANCE_FACILITY',
      'TICKET_WINDOW'
    ),
    evChargers: facilitiesByType('ELECTRIC_CAR_CHARGERS'),
    pickDrop: facilitiesByType('PICK_DROP'),
    boardingAids: facilitiesByType('BRIDGE_PLATE', 'PORTABLE_BOARDING_LIFT', 'RAMP'),
    bathroom: getBathroomForStation(station.station),
  };

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
    isBikeDataError,
    bikeShareData,
    isBikeShareDataLoading,
    isBikeShareDataError,
    isCommuterRail,
    facilitiesLoading: facilities.isLoading,
    amenities,
    ...parking,
  };
};

export type StationMetrics = ReturnType<typeof useStationMetrics>;
