import React from 'react';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStation } from '../../../constants/stations';
import { Footer } from '../../Footer';
import { HorizontalDivider } from '../../HorizontalDivider';
import { SiteHeader } from '../../SiteHeader';
import { StationDetails } from '../../StationDetails';
import { useStore } from '../../../store';
import { DetailsHeader } from '../../DetailsHeader';

interface StationProps {
  stationId: string;
}

export const Station: React.FunctionComponent<StationProps> = ({ stationId }) => {
  const station = getStation(stationId);
  const { compareStation, setCompareStation } = useStore();

  // Clear compare if it matches the primary station
  React.useEffect(() => {
    if (station && compareStation && station.station === compareStation.station) {
      setCompareStation(undefined);
    }
  }, [station, compareStation, setCompareStation]);

  if (!station) {
    return <div>Station not found</div>;
  }

  const isComparing = !!compareStation;

  return (
    <div className="flex w-screen flex-col content-center items-center bg-slate-50 text-center dark:bg-slate-700">
      <SiteHeader />
      <DetailsHeader station={station} />
      <div className="flex w-full flex-col">
        <StationDetails station={station} compareStation={compareStation} />
        {!isComparing && <HorizontalDivider />}
      </div>
      <div className="w-full px-4 pb-8 pt-4 sm:px-6 lg:px-10">
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-start text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-slate-800 dark:text-gray-300">
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="mt-0.5 shrink-0 text-cyan-700 dark:text-cyan-400"
          />
          <p>
            See missing or inaccurate data? Much of this comes from community sources like{' '}
            <a
              href="https://www.openstreetmap.org/about"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-cyan-700 underline decoration-dotted hover:decoration-solid dark:text-cyan-400"
            >
              OpenStreetMap
            </a>
            . You can{' '}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-cyan-700 underline decoration-dotted hover:decoration-solid dark:text-cyan-400"
            >
              contribute fixes yourself
            </a>{' '}
            — updates typically show up here within 24 hours.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};
