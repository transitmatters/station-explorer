import React from 'react';
// @ts-ignore
import { Marker } from 'react-leaflet-marker';
import classNames from 'classnames';
import type { LatLngTuple } from 'leaflet';
import { useNavigate } from '@tanstack/react-router';
import mbtaIcon from '../../../public/MBTA.svg';
import type { Station } from '../../types/station';

interface MBTAStationMarkerProps {
  station: Station;
  setStation: (station: Station) => void;
  position: LatLngTuple;
  borderColors: string[];
  allowNavigation?: boolean;
}

export const MBTAStationMarker: React.FC<MBTAStationMarkerProps> = ({
  station,
  setStation,
  position,
  borderColors,
  allowNavigation = true,
}) => {
  const navigate = useNavigate();

  return (
    <Marker key={`marker-${station.station}`} position={position} interactive riseOnHover>
      <div
        className={classNames(
          'group absolute z-[1000] flex items-center justify-center',
          allowNavigation ? 'cursor-pointer' : 'cursor-default'
        )}
        onClick={() => {
          if (allowNavigation) {
            setStation(station);
            navigate({
              to: '/$station',
              params: { station: station.station },
              replace: true,
              resetScroll: false,
            });
          }
        }}
      >
        <img
          src={mbtaIcon}
          alt={station.stop_name}
          className={classNames(
            'absolute z-[1000] flex h-6 w-6 items-center justify-center overflow-visible rounded-full border-2',
            ...borderColors
          )}
        />
      </div>
    </Marker>
  );
};
