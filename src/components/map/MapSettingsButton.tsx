import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { MapSettingsModal } from './MapSettingsModal';

interface MapSettingsButtonProps {
  showParking: boolean;
  setShowParking: (showParking: boolean) => void;
  includeGarages: boolean;
  setIncludeGarages: (includeGarages: boolean) => void;
  showBikePaths: boolean;
  setShowBikePaths: (showBikePaths: boolean) => void;
}

export const MapSettingsButton: React.FunctionComponent<MapSettingsButtonProps> = ({
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
        className="absolute left-0 z-[500] mx-36 flex w-fit -translate-y-10 cursor-pointer rounded-md bg-white bg-opacity-95 px-3.5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
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
