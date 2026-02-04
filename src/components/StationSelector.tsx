import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faMagnifyingGlass,
  faSort,
  faSquareCaretDown,
  faSquareCaretUp,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from '@tanstack/react-router';
import type { Station } from '../types/station';
import type { Line } from '../types/line';
import { stations } from '../constants/stations';
import { StationHighlight } from './StationHighlight';
import { useStore } from '../store';

type SortOption = 'name' | 'line' | 'accessible';

const sortOptions: Record<SortOption, (a: Station, b: Station) => number> = {
  name: (a: Station, b: Station) => {
    return a.stop_name.localeCompare(b.stop_name);
  },
  line: (a: Station, b: Station) => {
    return a.lines[0].localeCompare(b.lines[0]);
  },
  accessible: (a: Station, b: Station) => {
    if (a.accessible === b.accessible) return 0;
    return a.accessible ? -1 : 1;
  },
};

interface FilterState {
  lines: Set<Line>;
  accessible: boolean | null; // null = show all, true = accessible only, false = non-accessible only
  hasPedalPark: boolean | null;
  hasEnclosedBikeParking: boolean | null;
  hasPaidParking: boolean | null;
  hasFreeParking: boolean | null;
}

interface StationSelectorProps {
  station: Station;
  setStation: (station: Station) => void;
}

export const StationSelector: React.FunctionComponent<StationSelectorProps> = ({
  station,
  setStation,
}) => {
  const navigate = useNavigate();
  const { comparisonStation, setComparisonStation } = useStore();
  const isCompareMode = comparisonStation !== null;

  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [sortedBy, setSortedBy] = React.useState<SortOption>('name');
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>({
    lines: new Set(),
    accessible: null,
    hasPedalPark: null,
    hasEnclosedBikeParking: null,
    hasPaidParking: null,
    hasFreeParking: null,
  });

  const handleStationSelect = (selectedStation: Station) => {
    if (isCompareMode) {
      setComparisonStation(null);
      navigate({
        to: '/compare/$station1/$station2',
        params: {
          station1: comparisonStation.station,
          station2: selectedStation.station,
        },
      });
    } else {
      setStation(selectedStation);
    }
    setIsOpen(false);
  };

  const applyFilters = (station: Station): boolean => {
    // Search filter
    if (search && !station.stop_name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Line filter
    if (filters.lines.size > 0) {
      const hasMatchingLine = station.lines.some((line) => filters.lines.has(line));
      if (!hasMatchingLine) return false;
    }

    // Accessibility filter
    if (filters.accessible !== null && station.accessible !== filters.accessible) {
      return false;
    }

    // Pedal park filter
    if (filters.hasPedalPark !== null && station.pedal_park !== filters.hasPedalPark) {
      return false;
    }

    // Enclosed bike parking filter
    if (
      filters.hasEnclosedBikeParking !== null &&
      station.enclosed_bike_parking !== filters.hasEnclosedBikeParking
    ) {
      return false;
    }

    // Paid parking filter
    if (filters.hasPaidParking !== null && station.paid_parking !== filters.hasPaidParking) {
      return false;
    }

    // Free parking filter
    if (filters.hasFreeParking !== null && station.free_parking !== filters.hasFreeParking) {
      return false;
    }

    return true;
  };

  const sortedStations = stations.filter(applyFilters).sort(sortOptions[sortedBy]);

  const toggleLineFilter = (line: Line) => {
    setFilters((prev) => {
      const newLines = new Set(prev.lines);
      if (newLines.has(line)) {
        newLines.delete(line);
      } else {
        newLines.add(line);
      }
      return { ...prev, lines: newLines };
    });
  };

  const toggleBooleanFilter = (key: keyof Omit<FilterState, 'lines'>, value: boolean | null) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }));
  };

  const clearFilters = () => {
    setFilters({
      lines: new Set(),
      accessible: null,
      hasPedalPark: null,
      hasEnclosedBikeParking: null,
      hasPaidParking: null,
      hasFreeParking: null,
    });
  };

  const activeFilterCount =
    filters.lines.size +
    (filters.accessible !== null ? 1 : 0) +
    (filters.hasPedalPark !== null ? 1 : 0) +
    (filters.hasEnclosedBikeParking !== null ? 1 : 0) +
    (filters.hasPaidParking !== null ? 1 : 0) +
    (filters.hasFreeParking !== null ? 1 : 0);

  return (
    <div>
      {isCompareMode && (
        <div className="w-full bg-yellow-500 p-2 text-center text-sm font-semibold text-white">
          Select a station to compare with {comparisonStation?.stop_name}
        </div>
      )}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="relative w-full cursor-pointer bg-cyan-700 p-2 text-center font-semibold text-white dark:bg-cyan-800 lg:p-3"
      >
        {isOpen ? 'Close Selector' : isCompareMode ? 'Select Station to Compare' : 'Select Station'}{' '}
        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown} />
      </button>
      {isOpen && (
        <div className="absolute z-[100000] bg-cyan-700 dark:bg-cyan-800">
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
                  className="block w-full rounded-md border-0 bg-white bg-opacity-95 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="relative">
              <button
                className="m-1 rounded-lg bg-slate-100 bg-opacity-30 p-1.5 text-white hover:bg-opacity-40"
                onClick={() => {
                  setShowSortDropdown(!showSortDropdown);
                  setShowFilterDropdown(false);
                }}
              >
                <FontAwesomeIcon icon={faSort} className="mr-1" />
                Sort by {sortedBy}
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {(['name', 'line', 'accessible'] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          sortedBy === option ? 'bg-gray-100 font-semibold' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setSortedBy(option);
                          setShowSortDropdown(false);
                        }}
                      >
                        {option === 'name' && 'Name (A-Z)'}
                        {option === 'line' && 'Line'}
                        {option === 'accessible' && 'Accessibility'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="m-1 rounded-lg bg-slate-100 bg-opacity-30 p-1.5 text-white hover:bg-opacity-40"
                onClick={() => {
                  setShowFilterDropdown(!showFilterDropdown);
                  setShowSortDropdown(false);
                }}
              >
                <FontAwesomeIcon icon={faFilter} className="mr-1" />
                Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              {showFilterDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                      {activeFilterCount > 0 && (
                        <button
                          className="text-xs text-cyan-600 hover:text-cyan-800"
                          onClick={clearFilters}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-700">Lines</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'line-red', label: 'Red' },
                          { id: 'line-orange', label: 'Orange' },
                          { id: 'line-green', label: 'Green' },
                          { id: 'line-blue', label: 'Blue' },
                          { id: 'line-silver', label: 'Silver' },
                          { id: 'line-mattapan', label: 'Mattapan' },
                        ].map((line) => (
                          <label key={line.id} className="flex cursor-pointer items-center text-sm">
                            <input
                              type="checkbox"
                              className="mr-2 rounded"
                              checked={filters.lines.has(line.id as Line)}
                              onChange={() => toggleLineFilter(line.id as Line)}
                            />
                            {line.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-700">
                        Accessibility
                      </h4>
                      <div className="flex gap-2">
                        <button
                          className={`rounded px-3 py-1 text-sm ${
                            filters.accessible === true
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          onClick={() => toggleBooleanFilter('accessible', true)}
                        >
                          Accessible
                        </button>
                        <button
                          className={`rounded px-3 py-1 text-sm ${
                            filters.accessible === false
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                          onClick={() => toggleBooleanFilter('accessible', false)}
                        >
                          Not accessible
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-700">
                        Bike Parking
                      </h4>
                      <label className="mb-2 flex cursor-pointer items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 rounded"
                          checked={filters.hasPedalPark === true}
                          onChange={() => toggleBooleanFilter('hasPedalPark', true)}
                        />
                        Pedal & Park
                      </label>
                      <label className="flex cursor-pointer items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 rounded"
                          checked={filters.hasEnclosedBikeParking === true}
                          onChange={() => toggleBooleanFilter('hasEnclosedBikeParking', true)}
                        />
                        Enclosed Bike Parking
                      </label>
                    </div>

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase text-gray-700">
                        Car Parking
                      </h4>
                      <label className="mb-2 flex cursor-pointer items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 rounded"
                          checked={filters.hasPaidParking === true}
                          onChange={() => toggleBooleanFilter('hasPaidParking', true)}
                        />
                        Paid Parking
                      </label>
                      <label className="flex cursor-pointer items-center text-sm">
                        <input
                          type="checkbox"
                          className="mr-2 rounded"
                          checked={filters.hasFreeParking === true}
                          onChange={() => toggleBooleanFilter('hasFreeParking', true)}
                        />
                        Free Parking
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid w-full grid-flow-row grid-cols-1 gap-8 p-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedStations.map((s) => (
              <StationHighlight
                key={s.station}
                station={s}
                onClick={() => handleStationSelect(s)}
                isCompareMode={isCompareMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
