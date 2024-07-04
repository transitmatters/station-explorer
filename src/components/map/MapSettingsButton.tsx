import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import classNames from 'classnames';
import { MapSettingsModal } from './MapSettingsModal';

interface MapSettingsButtonProps {
  mapNavigation: boolean;
  showParking: boolean;
  setShowParking: (showParking: boolean) => void;
  includeGarages: boolean;
  setIncludeGarages: (includeGarages: boolean) => void;
  showBikePaths: boolean;
  setShowBikePaths: (showBikePaths: boolean) => void;
}

export const MapSettingsButton: React.FunctionComponent<MapSettingsButtonProps> = ({
  mapNavigation,
  showParking,
  setShowParking,
  includeGarages,
  setIncludeGarages,
  showBikePaths,
  setShowBikePaths,
}) => {
  const [isMapSettingsOpen, setIsMapSettingsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        title={'Map Settings'}
        className={classNames(
          'absolute left-0 z-[500] flex w-fit cursor-pointer rounded-lg border border-gray-300 bg-white bg-opacity-95 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-md transition-all duration-500 ease-in-out hover:bg-gray-50',
          mapNavigation
            ? 'bottom-0 mx-8 -translate-y-10 md:-translate-y-6'
            : 'mx-16 -translate-y-12 lg:mx-36'
        )}
        onClick={() => setIsMapSettingsOpen(true)}
      >
        <FontAwesomeIcon icon={faCog} size={'1x'} />
      </button>
      <MapSettingsModal
        isOpen={isMapSettingsOpen}
        setIsOpen={setIsMapSettingsOpen}
        showParking={showParking}
        setShowParking={setShowParking}
        includeGarages={includeGarages}
        setIncludeGarages={setIncludeGarages}
        showBikePaths={showBikePaths}
        setShowBikePaths={setShowBikePaths}
      />
    </div>
  );
};
