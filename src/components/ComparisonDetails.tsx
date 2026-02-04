import React from 'react';
import classNames from 'classnames';
import length from '@turf/length';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import pluralize from 'pluralize';
import { useGetWalkscoreForStation } from '../api/walkscore';
import type { Station } from '../types/station';
import { useParkingStats } from '../utils/parking';
import { useGetFacilitiesForStation } from '../api/facilities';
import { useGetAlertsForStation } from '../api/alerts';
import type { Elevator, Escalator } from '../types/facilities';
import { WALKING_RADIUS } from '../constants/mobility';
import { useGetBikeShareDataForStation, useGetCyclePathDataForStation } from '../api/overpass';
import { useGetRoutesForStation } from '../api/routes';
import { LoadingIndicator } from './LoadingIndicator';
import { AccessiblePill } from './pills/AccessiblePill';
import { ElevatorsPill } from './pills/ElevatorsPill';
import { EscalatorsPill } from './pills/EscalatorsPill';
import { RoutePill } from './pills/RoutePill';

interface ComparisonDetailsProps {
  station1: Station;
  station2: Station;
}

const scoreColor = (score: number) => {
  if (score >= 90) {
    return 'text-green-600';
  } else if (score >= 80) {
    return 'text-teal-500';
  } else if (score >= 70) {
    return 'text-yellow-500';
  } else if (score >= 60) {
    return 'text-orange-500';
  } else if (score === 0) {
    return 'text-gray-800';
  } else {
    return 'text-red-500';
  }
};

interface CompareRowProps {
  label: string;
  value1: React.ReactNode;
  value2: React.ReactNode;
}

const CompareRow: React.FunctionComponent<CompareRowProps> = ({ label, value1, value2 }) => {
  return (
    <div className="grid grid-cols-3 gap-4 border-b border-gray-200 py-3 dark:border-gray-600">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
      <div className="text-center">{value1}</div>
      <div className="text-center">{value2}</div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  station1Name: string;
  station2Name: string;
}

const SectionHeader: React.FunctionComponent<SectionHeaderProps> = ({
  title,
  station1Name,
  station2Name,
}) => {
  return (
    <div className="mb-2 mt-6 first:mt-0">
      <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      <div className="grid grid-cols-3 gap-4 border-b-2 border-cyan-600 pb-2 dark:border-cyan-400">
        <div></div>
        <div className="text-center text-sm font-semibold text-cyan-700 dark:text-cyan-400">
          {station1Name}
        </div>
        <div className="text-center text-sm font-semibold text-cyan-700 dark:text-cyan-400">
          {station2Name}
        </div>
      </div>
    </div>
  );
};

export const ComparisonDetails: React.FunctionComponent<ComparisonDetailsProps> = ({
  station1,
  station2,
}) => {
  const walkscore1 = useGetWalkscoreForStation(station1);
  const walkscore2 = useGetWalkscoreForStation(station2);

  const facilities1 = useGetFacilitiesForStation(station1);
  const facilities2 = useGetFacilitiesForStation(station2);

  const alerts1 = useGetAlertsForStation(station1);
  const alerts2 = useGetAlertsForStation(station2);

  const routes1 = useGetRoutesForStation(station1);
  const routes2 = useGetRoutesForStation(station2);

  const { data: bikeData1, isLoading: isBikeDataLoading1 } = useGetCyclePathDataForStation(
    station1,
    WALKING_RADIUS
  );
  const { data: bikeData2, isLoading: isBikeDataLoading2 } = useGetCyclePathDataForStation(
    station2,
    WALKING_RADIUS
  );

  const { data: bikeShareData1, isLoading: isBikeShareDataLoading1 } = useGetBikeShareDataForStation(
    station1,
    WALKING_RADIUS
  );
  const { data: bikeShareData2, isLoading: isBikeShareDataLoading2 } = useGetBikeShareDataForStation(
    station2,
    WALKING_RADIUS
  );

  const elevators1 = facilities1.data?.filter?.(
    (facility) => facility.type === 'ELEVATOR'
  ) as Elevator[];
  const elevators2 = facilities2.data?.filter?.(
    (facility) => facility.type === 'ELEVATOR'
  ) as Elevator[];

  const elevatorAlerts1 = alerts1.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );
  const elevatorAlerts2 = alerts2.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );

  const escalators1 = facilities1.data?.filter?.(
    (facility) => facility.type === 'ESCALATOR'
  ) as Escalator[];
  const escalators2 = facilities2.data?.filter?.(
    (facility) => facility.type === 'ESCALATOR'
  ) as Escalator[];

  const escalatorAlerts1 = alerts1.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_ESCALATOR'))
  );
  const escalatorAlerts2 = alerts2.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_ESCALATOR'))
  );

  const parking1 = useParkingStats(station1, WALKING_RADIUS);
  const parking2 = useParkingStats(station2, WALKING_RADIUS);

  const bikeGeojson1: FeatureCollection<Geometry, GeoJsonProperties> = bikeData1
    ? {
        ...bikeData1,
        features: bikeData1?.features.filter((f) => f.geometry.type !== 'Point'),
      }
    : { features: [], type: 'FeatureCollection' };
  const bikeLength1 = length(bikeGeojson1, { units: 'miles' });

  const bikeGeojson2: FeatureCollection<Geometry, GeoJsonProperties> = bikeData2
    ? {
        ...bikeData2,
        features: bikeData2?.features.filter((f) => f.geometry.type !== 'Point'),
      }
    : { features: [], type: 'FeatureCollection' };
  const bikeLength2 = length(bikeGeojson2, { units: 'miles' });

  const renderScore = (score: number | undefined, link?: string) => {
    if (score === undefined) return <LoadingIndicator />;
    return (
      <a
        className={classNames('font-mono text-xl', scoreColor(score))}
        target="_blank"
        rel="noreferrer"
        href={link}
      >
        {score}
      </a>
    );
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 lg:p-6">
      {/* Mobility Section */}
      <SectionHeader
        title="Mobility"
        station1Name={station1.stop_name}
        station2Name={station2.stop_name}
      />
      <CompareRow
        label="Walk Score"
        value1={renderScore(walkscore1.data?.walkscore, walkscore1.data?.ws_link)}
        value2={renderScore(walkscore2.data?.walkscore, walkscore2.data?.ws_link)}
      />
      <CompareRow
        label="Bike Score"
        value1={renderScore(walkscore1.data?.bike?.score, walkscore1.data?.ws_link)}
        value2={renderScore(walkscore2.data?.bike?.score, walkscore2.data?.ws_link)}
      />

      {/* Accessibility Section */}
      <SectionHeader
        title="Accessibility"
        station1Name={station1.stop_name}
        station2Name={station2.stop_name}
      />
      <CompareRow
        label="Wheelchair Accessible"
        value1={<AccessiblePill accessible={station1.accessible} />}
        value2={<AccessiblePill accessible={station2.accessible} />}
      />
      <CompareRow
        label="Elevators"
        value1={<ElevatorsPill elevators={elevators1} elevatorAlerts={elevatorAlerts1} />}
        value2={<ElevatorsPill elevators={elevators2} elevatorAlerts={elevatorAlerts2} />}
      />
      <CompareRow
        label="Escalators"
        value1={<EscalatorsPill escalators={escalators1} elevatorAlerts={escalatorAlerts1} />}
        value2={<EscalatorsPill escalators={escalators2} elevatorAlerts={escalatorAlerts2} />}
      />

      {/* Transit Section */}
      <SectionHeader
        title="Transit"
        station1Name={station1.stop_name}
        station2Name={station2.stop_name}
      />
      <CompareRow
        label="Routes"
        value1={
          <div className="flex flex-wrap justify-center gap-1">
            {routes1.data?.map((route) => <RoutePill key={route.id} route={route} />) ?? (
              <LoadingIndicator />
            )}
          </div>
        }
        value2={
          <div className="flex flex-wrap justify-center gap-1">
            {routes2.data?.map((route) => <RoutePill key={route.id} route={route} />) ?? (
              <LoadingIndicator />
            )}
          </div>
        }
      />

      {/* Bike Section */}
      <SectionHeader
        title="Bike"
        station1Name={station1.stop_name}
        station2Name={station2.stop_name}
      />
      <CompareRow
        label="Miles of Bike Lanes"
        value1={
          bikeData1 && !isBikeDataLoading1 ? (
            <span className="font-mono">
              {bikeLength1.toFixed(1)} {pluralize('mile', bikeLength1)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
        value2={
          bikeData2 && !isBikeDataLoading2 ? (
            <span className="font-mono">
              {bikeLength2.toFixed(1)} {pluralize('mile', bikeLength2)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
      />
      <CompareRow
        label="Bike Share Stations"
        value1={
          bikeShareData1 && !isBikeShareDataLoading1 ? (
            <span className="font-mono">
              {bikeShareData1.features.length}{' '}
              {pluralize('station', bikeShareData1.features.length)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
        value2={
          bikeShareData2 && !isBikeShareDataLoading2 ? (
            <span className="font-mono">
              {bikeShareData2.features.length}{' '}
              {pluralize('station', bikeShareData2.features.length)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
      />

      {/* Land Use Section */}
      <SectionHeader
        title="Land Use"
        station1Name={station1.stop_name}
        station2Name={station2.stop_name}
      />
      <CompareRow
        label="Parking Area"
        value1={
          parking1.percentParking > 0 ? (
            <span className="font-mono">{parking1.percentParking.toFixed(1)}%</span>
          ) : (
            <LoadingIndicator />
          )
        }
        value2={
          parking2.percentParking > 0 ? (
            <span className="font-mono">{parking2.percentParking.toFixed(1)}%</span>
          ) : (
            <LoadingIndicator />
          )
        }
      />
      <CompareRow
        label="Parking Spaces"
        value1={
          parking1.parkingSpots > 0 ? (
            <span className="font-mono">
              {parking1.parkingSpots.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              {pluralize('spot', parking1.parkingSpots)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
        value2={
          parking2.parkingSpots > 0 ? (
            <span className="font-mono">
              {parking2.parkingSpots.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              {pluralize('spot', parking2.parkingSpots)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
      />
      <CompareRow
        label="Surface Parking Land Area"
        value1={
          parking1.parkingAcres > 0 ? (
            <span className="font-mono">
              {parking1.parkingAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              {pluralize('acre', parking1.parkingAcres)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
        value2={
          parking2.parkingAcres > 0 ? (
            <span className="font-mono">
              {parking2.parkingAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
              {pluralize('acre', parking2.parkingAcres)}
            </span>
          ) : (
            <LoadingIndicator />
          )
        }
      />
    </div>
  );
};
