import classNames from 'classnames';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { Station } from '../types/station';
import { LINE_BG_COLOR_MAP } from '../constants/colors';

interface StationBannerProps {
  station: Station;
  size?: 'normal' | 'large';
  onSwap?: () => void;
  onCompare?: () => void;
  onClose?: () => void;
}

export const StationBanner: React.FC<StationBannerProps> = ({
  station,
  size = 'normal',
  onSwap,
  onCompare,
  onClose,
}) => {
  const lineColorClass = LINE_BG_COLOR_MAP[station.lines[0]] ?? 'bg-slate-500';
  const isLarge = size === 'large';
  const hasActions = onSwap || onCompare || onClose;

  return (
    <div className="min-w-0 overflow-hidden rounded-md bg-white shadow-sm dark:bg-slate-100">
      {/* Line-colored top half: station name */}
      <div
        className={classNames(
          'relative flex items-center justify-center font-bold uppercase text-white',
          lineColorClass,
          isLarge
            ? 'h-20 px-6 text-2xl sm:text-3xl lg:h-24 lg:text-4xl'
            : 'h-14 px-3 text-xl sm:text-2xl'
        )}
      >
        <span className="truncate text-center">{station.stop_name}</span>
        {hasActions && (
          <div className="absolute right-2 top-2 hidden items-center gap-1 sm:flex">
            {onSwap && (
              <button
                onClick={onSwap}
                aria-label="Change station"
                title="Change station"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/45"
              >
                <FontAwesomeIcon icon={faRightLeft} className="text-xs" />
              </button>
            )}
            {onCompare && (
              <button
                onClick={onCompare}
                aria-label="Compare with another station"
                title="Compare with another station"
                className="flex h-7 items-center gap-1.5 rounded-full bg-white/25 px-2 text-xs font-semibold text-white hover:bg-white/45"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                Compare
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Stop comparing"
                title="Stop comparing"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/45"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
              </button>
            )}
          </div>
        )}
      </div>
      {/* White bottom half: municipality */}
      <div
        className={classNames(
          'flex items-center justify-center font-semibold uppercase text-slate-600',
          isLarge ? 'h-12 text-base sm:text-lg' : 'h-9 text-sm'
        )}
      >
        {station.municipality}
      </div>
      {/* Mobile actions row: shown below the card on small screens */}
      {hasActions && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2 sm:hidden">
          {onSwap && (
            <button
              onClick={onSwap}
              aria-label="Change station"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faRightLeft} />
              Change
            </button>
          )}
          {onCompare && (
            <button
              onClick={onCompare}
              aria-label="Compare with another station"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-cyan-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-800"
            >
              <FontAwesomeIcon icon={faPlus} />
              Compare
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Stop comparing"
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50"
            >
              <FontAwesomeIcon icon={faXmark} />
              Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
};
