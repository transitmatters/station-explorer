import { faMagnifyingGlass, faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { stations } from '../constants/stations';
import { LINE_BG_COLOR_MAP } from '../constants/colors';
import { useStore } from '../store';
import type { Station } from '../types/station';

interface CompareSelectorProps {
  station: Station;
}

export const CompareSelector: React.FunctionComponent<CompareSelectorProps> = ({ station }) => {
  const { compareStation, setCompareStation } = useStore();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div className="absolute right-2 top-48 z-[450] flex flex-col content-center items-end text-center lg:right-8">
        <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
        {compareStation ? (
          <button
            title="Stop comparing"
            onClick={() => setCompareStation(undefined)}
            className="group flex items-center justify-center rounded-full bg-emerald-500 p-1.5 text-white shadow-sm hover:bg-emerald-600 focus:outline-none sm:rounded-lg sm:px-2"
          >
            <FontAwesomeIcon icon={faXmark} className="my-0.5" />
            <span className="ml-1 hidden text-xs sm:inline">Stop Comparing</span>
          </button>
        ) : (
          <button
            title="Compare Stations"
            onClick={() => setIsOpen(true)}
            className="group z-[450] flex items-center justify-center rounded-full bg-cyan-700 p-1.5 text-white shadow-sm hover:bg-cyan-800 focus:outline-none dark:bg-cyan-800 dark:hover:bg-cyan-900 sm:rounded-lg sm:px-2"
          >
            <FontAwesomeIcon icon={faPlusCircle} className="my-0.5" />
            <span className="ml-1 hidden text-xs sm:inline">Compare</span>
          </button>
        )}
        <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
      </div>
      {isOpen && (
        <ComparePicker
          excludeStationId={station.station}
          onPick={(s) => {
            setCompareStation(s);
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

interface ComparePickerProps {
  excludeStationId: string;
  onPick: (station: Station) => void;
  onClose: () => void;
}

const ComparePicker: React.FunctionComponent<ComparePickerProps> = ({
  excludeStationId,
  onPick,
  onClose,
}) => {
  const [search, setSearch] = React.useState('');

  const filtered = stations
    .filter((s) => s.station !== excludeStationId)
    .filter((s) => s.stop_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.stop_name.localeCompare(b.stop_name));

  return (
    <div
      className="fixed inset-0 z-[100000] flex items-start justify-center bg-black/60 p-4 pt-16"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Compare with another station
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="border-b border-gray-200 p-3 dark:border-gray-700">
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              type="search"
              placeholder="Search stations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-cyan-600 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100"
            />
          </div>
        </div>
        <div className="grid grid-flow-row auto-rows-min grid-cols-1 gap-2 overflow-y-auto p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((s) => (
            <button
              key={s.station}
              onClick={() => onPick(s)}
              className="group flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 text-start transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-slate-700"
            >
              <div
                className={classNames(
                  'h-10 w-1.5 rounded-sm',
                  LINE_BG_COLOR_MAP[s.lines[0]] ?? 'bg-slate-500'
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {s.stop_name}
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-300">
                  {s.municipality}
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-gray-500">
              No stations match “{search}”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
