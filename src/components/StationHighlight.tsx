import classnames from 'classnames';
import { Link } from '@tanstack/react-router';
import React from 'react';
import type { Station } from '../types/station';
import { LINE_BG_COLOR_MAP } from '../constants/colors';
import { useBreakpoint } from '../utils/hooks/useBreakpoint';
import { AccessiblePill } from './pills/AccessiblePill';

interface StationHighlightProps {
  station: Station;
  onClick?: () => void;
}

export const StationHighlight: React.FunctionComponent<StationHighlightProps> = ({
  station,
  onClick,
}) => {
  const isMobile = !useBreakpoint('sm');

  const stopName = isMobile && station.short ? station.short : station.stop_name;

  return (
    <Link
      className="group relative h-24 min-w-72 cursor-pointer content-center justify-center rounded-md bg-white hover:scale-105 hover:shadow-sm md:min-w-56"
      to={`/${station.station}`}
      onClick={onClick}
    >
      <div
        className={classnames(
          'h-14 content-center justify-center rounded-t-md font-semibold uppercase text-white',
          stopName.length > 18 ? 'text-xl' : stopName.length > 14 ? 'text-2xl' : 'text-3xl',
          LINE_BG_COLOR_MAP[station.lines[0]]
        )}
      >
        {stopName}
      </div>
      <div className="h-10 content-center justify-center">
        <AccessiblePill accessible={station.accessible} />
      </div>
    </Link>
  );
};
