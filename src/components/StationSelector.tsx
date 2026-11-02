import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faMagnifyingGlass,
  faSort,
  faSquareCaretDown,
  faSquareCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import type { Station } from '../types/station';
import { stations } from '../constants/stations';
import { StationHighlight } from './StationHighlight';

const sortOptions = {
  name: (a: Station, b: Station) => {
    return a.stop_name.localeCompare(b.stop_name);
  },
  line: (a: Station, b: Station) => {
    return a.lines[0].localeCompare(b.lines[0]);
  },
  accessible: (a: Station, b: Station) => {
    return a.accessible ? -1 : 1;
  },
};

interface StationSelectorProps {
  station: Station;
  setStation: (station: Station) => void;
}

export const StationSelector: React.FunctionComponent<StationSelectorProps> = ({
  station,
  setStation,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sortedBy, setSortedBy] = React.useState<'name' | 'line' | 'accessible'>('name');

  const sortedStations = stations
    .filter((s) => s.stop_name.toLowerCase().includes(search.toLowerCase()))
    .sort(sortOptions[sortedBy]);

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative w-full cursor-pointer bg-cyan-700 p-2 text-center font-semibold text-white lg:p-3 dark:bg-cyan-800"
      >
        {isOpen ? 'Close Selector' : 'Select Station'}{' '}
        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown} />
      </button>
      {isOpen && (
        <div className="absolute z-100000 bg-cyan-700 dark:bg-cyan-800">
          <div className="flex w-full items-center justify-center">
            <div className="mr-1 w-3/5">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-1" />
                </div>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-md border-0 bg-white/95 py-1.5 pr-3 pl-10 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <span
              className="m-1 rounded-lg bg-slate-100/30 p-1.5 text-white"
              onClick={() => {
                alert('Sorting not yet implemented');
              }}
            >
              <FontAwesomeIcon icon={faSort} className="mr-1" />
              Sort by {sortedBy}
            </span>
            <span
              className="m-1 rounded-lg bg-slate-100/30 p-1.5 text-white"
              onClick={() => {
                alert('Filters not yet implemented');
              }}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-1" />
              Filter by
            </span>
          </div>
          <div className="grid w-screen grid-flow-row grid-cols-1 gap-8 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedStations.map((station) => (
              <StationHighlight
                key={station.station}
                station={station}
                onClick={() => {
                  setStation(station);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
