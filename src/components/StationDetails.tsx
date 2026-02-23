import classNames from 'classnames';
import React from 'react';
import { length } from '@turf/length';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import pluralize from 'pluralize';
import { useGetWalkscoreForStation } from '../api/walkscore';
import type { Station } from '../types/station';
import { useParkingStats } from '../utils/parking';
import { useGetFacilitiesForStation } from '../api/facilities';
import { COMMUTER_RAIL_LINES } from '../constants/line';
import { useGetAlertsForStation } from '../api/alerts';
import type { Elevator, Escalator } from '../types/facilities';
import { WALKING_RADIUS } from '../constants/mobility';
import { useGetBikeShareDataForStation, useGetCyclePathDataForStation } from '../api/overpass';
import { useGetRoutesForStation } from '../api/routes';
import { StationDetailSection } from './StationDetailSection';
import { DataSection } from './DataSection';
import { LoadingIndicator } from './LoadingIndicator';
import { AccessiblePill } from './pills/AccessiblePill';
import { ElevatorsPill } from './pills/ElevatorsPill';
import { EscalatorsPill } from './pills/EscalatorsPill';
import { RoutePill } from './pills/RoutePill';

interface StationDetailsProps {
  station: Station;
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

export const StationDetails: React.FunctionComponent<StationDetailsProps> = ({ station }) => {
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

  const elevators = facilities.data?.filter?.(
    (facility) => facility.type === 'ELEVATOR'
  ) as Elevator[];
  const elevatorAlerts = alerts.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );

  const escalators = facilities.data?.filter?.(
    (facility) => facility.type === 'ESCALATOR'
  ) as Escalator[];
  const escalatorsAlerts = alerts.data?.filter?.((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_ESCALATOR'))
  );
  const levelBoarding = facilities.data?.filter?.(
    (facility) => facility.type === 'FULLY_ELEVATED_PLATFORM'
  );
  const miniHighPlatforms = facilities.data?.filter?.(
    (facility) => facility.type === 'ELEVATED_SUBPLATFORM'
  );

  const { percentParking, parkingSpots, parkingAcres } = useParkingStats(station, WALKING_RADIUS);

  const bikeGeojson: FeatureCollection<Geometry, GeoJsonProperties> = bikeData
    ? {
        ...bikeData,
        features: bikeData?.features.filter((f) => f.geometry.type !== 'Point'),
      }
    : { features: [], type: 'FeatureCollection' };
  const bikeLength = length(bikeGeojson, { units: 'miles' });

  // TODO: All these sections should be filled out
  return (
    <>
      <StationDetailSection sectionName="Mobility">
        <DataSection
          title={'Walk Score®'}
          description={walkscore.data?.description ?? 'Walk Score from WalkScore.com'}
          dataValue={
            <a
              className={classNames(
                'font-mono text-2xl leading-6',
                scoreColor(walkscore.data?.walkscore ?? 0)
              )}
              target={'_blank'}
              rel="noreferrer"
              href={walkscore.data?.ws_link}
            >
              {walkscore.data?.walkscore ?? <LoadingIndicator />}
            </a>
          }
          link={walkscore.data?.help_link}
          dataSource={{
            name: 'WalkScore®',
            url: 'https://www.walkscore.com',
          }}
        />
      </StationDetailSection>
      <StationDetailSection sectionName="Accessibility">
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 lg:gap-3">
          <AccessiblePill accessible={station.accessible} />
          <ElevatorsPill elevators={elevators} elevatorAlerts={elevatorAlerts} />
          <EscalatorsPill escalators={escalators} elevatorAlerts={escalatorsAlerts} />
        </div>
        {station.lines.some((line) => COMMUTER_RAIL_LINES.includes(line)) && (
          <div>
            This station has {levelBoarding?.length ?? <LoadingIndicator />} level boarding
            platform(s) and {miniHighPlatforms?.length ?? <LoadingIndicator />} mini-high
            platform(s)
          </div>
        )}
      </StationDetailSection>
      <StationDetailSection sectionName="Transit">
        <div className="flex flex-row flex-wrap items-center justify-center gap-1 lg:gap-2">
          {routes.data?.map((route) => (
            <RoutePill key={route.id} route={route} />
          ))}
        </div>
      </StationDetailSection>
      <StationDetailSection sectionName="Bike">
        <DataSection
          title={'Bike Score®'}
          description={walkscore.data?.bike?.description ?? 'Bike Score from WalkScore.com'}
          dataValue={
            <a
              className={classNames(
                'font-mono text-2xl leading-6',
                scoreColor(walkscore.data?.bike?.score ?? 0)
              )}
              target={'_blank'}
              rel="noreferrer"
              href={walkscore.data?.ws_link}
            >
              {walkscore.data?.bike?.score ?? <LoadingIndicator />}
            </a>
          }
          link={walkscore.data?.help_link}
          dataSource={{
            name: 'WalkScore®',
            url: 'https://www.walkscore.com',
          }}
        />
        <DataSection
          title={'Miles of Bike Lanes'}
          description={'Miles of bike lanes that are within walking distance of the station'}
          dataValue={
            bikeData && !isBikeDataLoading ? (
              <div className="text-inherit">
                {bikeLength.toFixed(1)}&nbsp;
                <span className={'text-sm'}>{pluralize('mile', bikeLength)}</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
          dataSource={{
            name: 'OpenStreetMap',
            url: 'https://www.openstreetmap.org/about',
          }}
        />
        <DataSection
          title={'Bike Share Stations'}
          description={
            'Number of bike share stations that are within walking distance of the station'
          }
          dataValue={
            bikeShareData && !isBikeShareDataLoading ? (
              <div className="text-inherit">
                {bikeShareData.features.length.toFixed(0)}&nbsp;
                <span className={'text-sm'}>
                  {pluralize('station', bikeShareData.features.length)}
                </span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
          dataSource={{
            name: 'OpenStreetMap',
            url: 'https://www.openstreetmap.org/about',
          }}
        />
      </StationDetailSection>
      <StationDetailSection sectionName="Land Use">
        <DataSection
          title={'Parking Area'}
          description="Percentage of the area within walking distance of the station taken up by parking"
          dataValue={
            percentParking > 0 ? (
              <div className="text-inherit">
                {percentParking.toFixed(1)}
                <span className={'align-top text-sm'}>%</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
          dataSource={{
            name: 'OpenStreetMap',
            url: 'https://www.openstreetmap.org/about',
          }}
        />
        <DataSection
          title={'Parking Spaces'}
          description="Estimate of the number of parking spaces within walking distance of the station"
          dataValue={
            parkingSpots > 0 ? (
              <div className="text-inherit">
                {parkingSpots.toLocaleString(undefined, { maximumFractionDigits: 0 })}&nbsp;
                <span className={'text-sm'}>{pluralize('spot', parkingSpots)}</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
          dataSource={{
            name: 'OpenStreetMap',
            url: 'https://www.openstreetmap.org/about',
          }}
        />
        <DataSection
          title={'Surface Parking Land Area'}
          description=" Estimate of the acreage of surface parking within walking distance of the station"
          dataValue={
            parkingAcres > 0 ? (
              <div className="text-inherit">
                {parkingAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })}&nbsp;
                <span className={'text-sm'}>{pluralize('acre', parkingAcres)}</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
          dataSource={{
            name: 'OpenStreetMap',
            url: 'https://www.openstreetmap.org/about',
          }}
        />
      </StationDetailSection>
    </>
  );
};
