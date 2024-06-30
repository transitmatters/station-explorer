import React, { useState } from 'react';
import { faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { getStation } from '../../../constants/stations';
import LeafletMap from '../../map/LeafletMap';
import type { Station as StationType } from '../../../types/station';
import ThemeSwitcher from '../../ThemeSwitcher';
import { HorizontalDivider } from '../../HorizontalDivider';
import { CompareSelector } from '../../CompareSelector';
import { StationDetails } from '../../StationDetails';
import { MapSettingsButton } from '../../map/MapSettingsButton';

interface StationProps {
  stationId: string;
}

export const Station: React.FunctionComponent<StationProps> = ({ stationId }) => {
  const [station, setStation] = useState<StationType | undefined>(getStation(stationId));
  const [mapNavigation, setMapNavigation] = useState<boolean>(false);

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
        <CompareSelector />
      </div>
      <div>
        <div className={classNames('z-0 flex h-[32rem] w-screen flex-col px-12 lg:px-32')}>
          <LeafletMap
            station={station}
            setStation={setStation}
            allowNavigation={mapNavigation}
            options={{
              showParking: true,
              includeGarages: true,
              showBikePaths: true,
            }}
          />
        </div>
        <MapSettingsButton />
        <button
          className="absolute left-0 right-0 z-[500] m-auto w-fit -translate-y-16 cursor-pointer rounded-lg border border-gray-300 bg-white p-2 text-cyan-700 dark:text-cyan-800 md:-translate-y-12"
          onClick={() => {
            setMapNavigation(true);
          }}
        >
          <FontAwesomeIcon icon={faExpand} className="mr-2" />
          Explore Full Map
        </button>
      </div>
    </div>
  );
};
