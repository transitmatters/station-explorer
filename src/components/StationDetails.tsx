import classNames from 'classnames';
import React from 'react';
import { useGetWalkscoreForStation } from '../api/walkscore';
import type { Station } from '../types/station';
import { useParkingStats } from '../utils/parking';
import { StationDetailSection } from './StationDetailSection';
import { AccessibleIcon } from './icons/AccessibleIcon';
import { DataSection } from './DataSection';
import { LoadingIndicator } from './LoadingIndicator';

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
        />
      </StationDetailSection>
      <StationDetailSection sectionName="Land Use">
        <DataSection
          title={'Parking Area'}
          description="Percentage of the area within walking distance of the station taken up by parking"
          dataValue={
            percentParking > 0 ? (
              <>
                {percentParking.toFixed(1)}
                <span className={'align-top text-sm dark:text-gray-100'}>%</span>
              </>
            ) : (
              <div className="text-2xl">
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
              <>
                {parkingSpots}
                <span className={'text-sm dark:text-gray-100'}>spots</span>
              </>
            ) : (
              <div className="text-2xl">
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
              <>
                {parkingSqFt.toFixed(0)}
                <span className={'align-top text-xs'}>²ft</span>
              </>
            ) : (
              <div className="text-2xl">
                <LoadingIndicator />
              </div>
            )
          }
        />
      </StationDetailSection>
      <StationDetailSection sectionName="Accessibility">
        {/* TODO */}
        <AccessibleIcon notAccessible={!station.accessible} />
        <p>Test Data: 2 Elevators out of service</p>
      </StationDetailSection>
      <StationDetailSection sectionName="Transit">{/* TODO */}Test</StationDetailSection>
      <StationDetailSection sectionName="Bike">
        <DataSection
          title={'Bike Score®'}
          description={walkscore.data?.bike.description ?? 'Bike Score from WalkScore.com'}
          dataValue={
            <a
              className={classNames(
                'font-mono text-2xl leading-6',
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
    </>
  );
};
