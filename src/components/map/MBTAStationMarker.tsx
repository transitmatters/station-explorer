import React from 'react';
// @ts-ignore
import { Marker } from 'react-leaflet-marker';
import classNames from 'classnames';
import type { LatLngTuple } from 'leaflet';
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
  return (
    <Marker key={`marker-${station.station}`} position={position} interactive riseOnHover>
      <div
        className={classNames(
          'group absolute flex items-center justify-center',
          allowNavigation ? 'cursor-pointer' : 'cursor-default'
        )}
        onClick={() => {
          if (allowNavigation) {
            setStation(station);
          }
        }}
      >
        <img
          src={mbtaIcon}
          alt={station.stop_name}
          className={classNames(
            'absolute flex h-6 w-6 items-center justify-center overflow-visible rounded-full border-2',
            ...borderColors
          )}
        />
      </div>
    </Marker>
  );
};
