import classNames from 'classnames';
import React from 'react';
import { useGetWalkscoreForStation } from '../api/walkscore';
import type { Station } from '../types/station';
import { useParkingStats } from '../utils/parking';
import { StationDetailSection } from './StationDetailSection';
import { AccessibleIcon } from './icons/AccessibleIcon';
import { DataSection } from './DataSection';

interface StationDetailsProps {
  station: Station;
}

export const StationDetails: React.FunctionComponent<StationDetailsProps> = ({ station }) => {
  const walkscore = useGetWalkscoreForStation(station);

  const radius = 1000;
  const { percentParking, parkingSpots, parkingSqFt } = useParkingStats(station, radius);

  // TODO: All these sections should be filled out

  return (
    <>
      <StationDetailSection sectionName="Mobility">
        {walkscore.data && (
          <DataSection
            title={'Walk Score®'}
            description={walkscore.data.description}
            dataValue={
              <a
                className={classNames(
                  'font-mono text-2xl leading-6',
                  walkscore.data.walkscore >= 90
                    ? 'text-green-600'
                    : walkscore.data.walkscore >= 80
                      ? 'text-teal-500'
                      : walkscore.data.walkscore >= 70
                        ? 'text-yellow-500'
                        : walkscore.data.walkscore >= 60
                          ? 'text-orange-500'
                          : 'text-red-500'
                )}
                target={'_blank'}
                rel="noreferrer"
                href={walkscore.data.ws_link}
              >
                {walkscore.data.walkscore}
              </a>
            }
            link={walkscore.data.help_link}
          />
        )}
      </StationDetailSection>
      <StationDetailSection sectionName="Land Use">
        <DataSection
          title={'Parking Area'}
          description="Percentage of the area within walking distance of the station taken up by parking"
          dataValue={
            <>
              {percentParking.toFixed(1)}
              <span className={'align-top text-sm text-gray-900 dark:text-gray-100'}>%</span>
            </>
          }
        />
        <DataSection
          title={'Parking Spaces'}
          description="Estimate of the number of parking spaces within walking distance of the station"
          dataValue={
            <>
              {parkingSpots}
              <span className={'text-sm text-gray-900 dark:text-gray-100'}>spots</span>
            </>
          }
        />
        <DataSection
          title={'Surface Parking Land Area'}
          description=" Estimate of the square footage of surface parking within walking distance of the station"
          dataValue={
            <>
              {parkingSqFt.toFixed(0)}
              <span className={'align-top text-xs'}>²ft</span>
            </>
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
        {walkscore.data?.bike && (
          <DataSection
            title={'Bike Score®'}
            description={walkscore.data.bike.description}
            dataValue={
              <a
                className={classNames(
                  'font-mono text-2xl leading-6',
                  walkscore.data.bike.score >= 90
                    ? 'text-green-600'
                    : walkscore.data.bike.score >= 80
                      ? 'text-teal-500'
                      : walkscore.data.bike.score >= 70
                        ? 'text-yellow-500'
                        : walkscore.data.bike.score >= 60
                          ? 'text-orange-500'
                          : 'text-red-500'
                )}
                target={'_blank'}
                rel="noreferrer"
                href={walkscore.data.ws_link}
              >
                {walkscore.data.bike.score}
              </a>
            }
            link={walkscore.data.help_link}
          />
        )}
      </StationDetailSection>
    </>
  );
};
