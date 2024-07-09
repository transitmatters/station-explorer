import React from 'react';
import type { Station } from '../types/station';
import { StationSelector } from './StationSelector';

interface DetailsHeaderProps {
  station: Station;
  setStation: (station: Station) => void;
}

export const DetailsHeader: React.FunctionComponent<DetailsHeaderProps> = ({
  station,
  setStation,
}) => {
  return (
    <div className="w-screen bg-cyan-700 dark:bg-cyan-800">
      <div className="px-8 pt-8 text-start text-2xl uppercase text-white lg:text-4xl">
        {station.stop_name}
      </div>
      <div className="lg:text-md px-8 text-start text-sm text-slate-200">
        {station.municipality}
      </div>
      <StationSelector station={station} setStation={setStation} />
    </div>
  );
};
