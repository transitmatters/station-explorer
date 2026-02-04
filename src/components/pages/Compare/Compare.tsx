import React from 'react';
import { Link } from '@tanstack/react-router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getStation } from '../../../constants/stations';
import type { Station as StationType } from '../../../types/station';
import ThemeSwitcher from '../../ThemeSwitcher';
import { ComparisonDetails } from '../../ComparisonDetails';
import { useStore } from '../../../store';

interface CompareProps {
  station1Id: string;
  station2Id: string;
}

export const Compare: React.FunctionComponent<CompareProps> = ({ station1Id, station2Id }) => {
  const station1 = getStation(station1Id);
  const station2 = getStation(station2Id);
  const { setComparisonStation } = useStore();

  React.useEffect(() => {
    setComparisonStation(null);
  }, [setComparisonStation]);

  if (!station1 || !station2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-700">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          {!station1 && !station2
            ? 'Both stations not found'
            : !station1
              ? `Station "${station1Id}" not found`
              : `Station "${station2Id}" not found`}
        </div>
        <Link
          to="/"
          className="mt-4 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-700">
      <CompareHeader station1={station1} station2={station2} />
      <div className="absolute right-0 top-0 m-4 rounded-md bg-slate-50 p-2 dark:bg-slate-900">
        <ThemeSwitcher />
      </div>
      <div className="flex-1 px-4 py-6 lg:px-8">
        <ComparisonDetails station1={station1} station2={station2} />
      </div>
    </div>
  );
};

interface CompareHeaderProps {
  station1: StationType;
  station2: StationType;
}

const CompareHeader: React.FunctionComponent<CompareHeaderProps> = ({ station1, station2 }) => {
  return (
    <div className="bg-cyan-700 px-4 py-4 text-white dark:bg-cyan-800 lg:px-8">
      <div className="mb-2">
        <Link
          to="/"
          className="text-sm text-cyan-100 hover:text-white"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Home
        </Link>
      </div>
      <h1 className="text-center text-xl font-bold lg:text-2xl">
        Comparing Stations
      </h1>
      <div className="mt-2 flex items-center justify-center gap-4 text-lg">
        <Link
          to="/$station"
          params={{ station: station1.station }}
          className="hover:underline"
        >
          {station1.stop_name}
        </Link>
        <span className="text-cyan-300">vs</span>
        <Link
          to="/$station"
          params={{ station: station2.station }}
          className="hover:underline"
        >
          {station2.stop_name}
        </Link>
      </div>
    </div>
  );
};
