import React, { useState } from 'react';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { getStation } from '../../../constants/stations';
import LeafletMap from '../../map/LeafletMap';
import type { Station as StationType } from '../../../types/station';
import ThemeSwitcher from '../../ThemeSwitcher';
import { HorizontalDivider } from '../../HorizontalDivider';
import { CompareSelector } from '../../CompareSelector';
import { StationDetails } from '../../StationDetails';
import { useStore } from '../../../store';

interface StationProps {
  stationId: string;
}

export const Station: React.FunctionComponent<StationProps> = ({ stationId }) => {
  const [station, setStation] = useState<StationType | undefined>(getStation(stationId));
  const { fullMapNavigation, setFullMapNavigation } = useStore();

  const [showRouteLines, setShowRouteLines] = useState<boolean>(false);
  const [showParking, setShowParking] = useState<boolean>(true);
  const [showBikePaths, setShowBikePaths] = useState<boolean>(true);

  if (!station) {
    // TODO: show actual error page
    return <div>Station not found</div>;
  }

  return (
    <div className="flex w-screen flex-col content-center items-center bg-slate-50 text-center dark:bg-slate-700">
      <div className="flex w-screen bg-cyan-700 p-8 text-2xl uppercase text-white dark:bg-cyan-800">
        {station.stop_name} | TODO: Create Header
      </div>
      <div className="absolute right-0 top-0 m-4 rounded-md bg-slate-50 p-2 dark:bg-slate-900">
        <ThemeSwitcher />
      </div>
      <div className="flex w-full flex-col">
        <StationDetails station={station} />
        <HorizontalDivider />
        {!fullMapNavigation && <CompareSelector />}
      </div>
      <div className="pb-8">
        <div
          className={classNames(
            'z-0 flex w-screen flex-col transition-all duration-500 ease-in-out',
            fullMapNavigation
              ? 'absolute bottom-4 left-0 right-0 top-28 m-auto px-4'
              : 'h-[32rem] px-12 lg:px-32'
          )}
        >
          <LeafletMap
            key={'leaflet-map'}
            station={station}
            setStation={setStation}
            options={{
              showRouteLines,
              setShowRouteLines,
              showParking,
              setShowParking,
              showBikePaths,
              setShowBikePaths,
            }}
            allowNavigation={fullMapNavigation}
          />
        </div>
        <button
          className={classNames(
            'absolute left-0 right-0 z-[500] m-auto w-fit cursor-pointer rounded-lg border border-gray-300 bg-white p-2 px-3 text-cyan-700 shadow-lg transition-all duration-500 ease-in-out dark:text-cyan-800',
            fullMapNavigation
              ? 'bottom-0 -translate-y-12 md:-translate-y-8'
              : '-translate-y-20 md:-translate-y-16'
          )}
          onClick={() => {
            setFullMapNavigation(!fullMapNavigation);
          }}
        >
          <FontAwesomeIcon icon={fullMapNavigation ? faCompress : faExpand} className="mr-2" />
          {fullMapNavigation ? 'Station Details' : 'Explore Full Map'}
        </button>
      </div>
    </div>
  );
};
