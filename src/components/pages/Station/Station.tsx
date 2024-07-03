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
import { MapSettingsButton } from '../../map/MapSettingsButton';

interface StationProps {
  stationId: string;
}

export const Station: React.FunctionComponent<StationProps> = ({ stationId }) => {
  const [station, setStation] = useState<StationType | undefined>(getStation(stationId));
  const [mapNavigation, setMapNavigation] = useState<boolean>(false);

  const [showParking, setShowParking] = useState<boolean>(true);
  const [includeGarages, setIncludeGarages] = useState<boolean>(true);
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
        {!mapNavigation && <CompareSelector />}
      </div>
      <div className="pb-8">
        <div
          className={classNames(
            'z-0 flex w-screen flex-col transition-all duration-500 ease-in-out',
            mapNavigation
              ? 'absolute bottom-4 left-0 right-0 top-28 m-auto px-4'
              : 'h-[32rem] px-12 lg:px-32'
          )}
        >
          <LeafletMap
            station={station}
            setStation={setStation}
            allowNavigation={mapNavigation}
            options={{
              showParking: showParking,
              includeGarages: includeGarages,
              showBikePaths: showBikePaths,
            }}
          />
        </div>
        <MapSettingsButton
          mapNavigation={mapNavigation}
          showParking={showParking}
          setShowParking={setShowParking}
          includeGarages={includeGarages}
          setIncludeGarages={setIncludeGarages}
          showBikePaths={showBikePaths}
          setShowBikePaths={setShowBikePaths}
        />
        <button
          className={classNames(
            'absolute left-0 right-0 z-[500] m-auto w-fit cursor-pointer rounded-lg border border-gray-300 bg-white p-2 px-3 text-cyan-700 shadow-lg dark:text-cyan-800',
            mapNavigation
              ? 'bottom-0 -translate-y-10 md:-translate-y-6'
              : '-translate-y-16 md:-translate-y-12'
          )}
          onClick={() => {
            setMapNavigation(!mapNavigation);
          }}
        >
          <FontAwesomeIcon icon={mapNavigation ? faCompress : faExpand} className="mr-2" />
          {mapNavigation ? 'Station Details' : 'Explore Full Map'}
        </button>
      </div>
    </div>
  );
};
