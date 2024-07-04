import classNames from 'classnames';
import React from 'react';
import { useGetWalkscoreForStation } from '../api/walkscore';
import type { Station } from '../types/station';
import { useParkingStats } from '../utils/parking';
import { useGetFacilitiesForStation } from '../api/facilities';
import { COMMUTER_RAIL_LINES } from '../constants/line';
import { useGetAlertsForStation } from '../api/alerts';
import type { Elevator } from '../types/facilities';
import { StationDetailSection } from './StationDetailSection';
import { DataSection } from './DataSection';
import { LoadingIndicator } from './LoadingIndicator';
import { AccessiblePill } from './pills/AccessiblePill';
import { ElevatorsPill } from './pills/ElevatorsPill';
import { EscalatorsPill } from './pills/EscalatorsPill';

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
  } else if (score !== 0) {
    return 'text-red-500';
  } else {
    return 'text-gray-800';
  }
};

export const StationDetails: React.FunctionComponent<StationDetailsProps> = ({ station }) => {
  const walkscore = useGetWalkscoreForStation(station);
  const facilities = useGetFacilitiesForStation(station);
  const alerts = useGetAlertsForStation(station);

  const elevators: Elevator[] = facilities.data?.filter(
    (facility) => facility.type === 'ELEVATOR'
  ) as Elevator[];
  const elevatorAlerts = alerts.data?.filter((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_WHEELCHAIR'))
  );

  const escalators = facilities.data?.filter((facility) => facility.type === 'ESCALATOR');
  const escalatorsAlerts = alerts.data?.filter((alert) =>
    alert.informed_entity.some((entity) => entity.activities.includes('USING_ESCALATOR'))
  );
  const levelBoarding = facilities.data?.filter(
    (facility) => facility.type === 'FULLY_ELEVATED_PLATFORM'
  );
  const miniHighPlatforms = facilities.data?.filter(
    (facility) => facility.type === 'ELEVATED_SUBPLATFORM'
  );

  const radius = 1000;
  const { percentParking, parkingSpots, parkingSqFt } = useParkingStats(station, radius);

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
                'font-mono text-2xl leading-6 text-inherit',
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
        />
      </StationDetailSection>

      <StationDetailSection sectionName="Accessibility">
        {/* TODO */}
        <div className="flex flex-row items-center justify-center gap-2 lg:gap-3">
          <AccessiblePill accessible={station.accessible} />
          <ElevatorsPill elevators={elevators} elevatorAlerts={elevatorAlerts} />
          <EscalatorsPill escalators={escalators} elevatorAlerts={escalatorsAlerts} />
        </div>
        {station.lines.some((line) => COMMUTER_RAIL_LINES.includes(line)) && (
          <p>
            This station has {levelBoarding?.length ?? <LoadingIndicator />} level boarding
            platform(s) and {miniHighPlatforms?.length ?? <LoadingIndicator />} mini-high
            platform(s)
          </p>
        )}
      </StationDetailSection>
      <StationDetailSection sectionName="Transit">{/* TODO */}Test</StationDetailSection>
      <StationDetailSection sectionName="Bike">
        <DataSection
          title={'Bike Score®'}
          description={walkscore.data?.bike.description ?? 'Bike Score from WalkScore.com'}
          dataValue={
            <a
              className={classNames(
                'font-mono text-2xl leading-6 text-inherit',
                scoreColor(walkscore.data?.bike.score ?? 0)
              )}
              target={'_blank'}
              rel="noreferrer"
              href={walkscore.data?.ws_link}
            >
              {walkscore.data?.bike.score ?? <LoadingIndicator />}
            </a>
          }
          link={walkscore.data?.help_link}
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
        />
        <DataSection
          title={'Parking Spaces'}
          description="Estimate of the number of parking spaces within walking distance of the station"
          dataValue={
            parkingSpots > 0 ? (
              <div className="text-inherit">
                {parkingSpots.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className={'text-sm'}>spots</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
        />
        <DataSection
          title={'Surface Parking Land Area'}
          description=" Estimate of the square footage of surface parking within walking distance of the station"
          dataValue={
            parkingSqFt > 0 ? (
              <div className="text-inherit">
                {parkingSqFt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <span className={'align-top text-xs'}>²ft</span>
              </div>
            ) : (
              <div className="text-2xl text-inherit">
                <LoadingIndicator />
              </div>
            )
          }
        />
      </StationDetailSection>
    </>
  );
};
