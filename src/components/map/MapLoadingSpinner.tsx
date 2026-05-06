import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Marker } from 'react-leaflet-marker';
import type { LatLngTuple } from 'leaflet';
import { lineColorText } from '../../styles/general';
import type { Station } from '../../types/station';

interface MapLoadingSpinnerProps {
  station: Station;
}

export const MapLoadingSpinner: React.FunctionComponent<MapLoadingSpinnerProps> = ({ station }) => {
  // For some reason `center` is reading coordinates backwards and putting us in antartica
  const mapCenter = station.coordinates?.sort(function (a, b) {
    return (b as number) - (a as number);
  }) as LatLngTuple | undefined;

  if (mapCenter) {
    return (
      <Marker position={mapCenter}>
        <div
          className={classNames('group absolute flex cursor-pointer items-center justify-center')}
        >
          <FontAwesomeIcon
            className={classNames(
              'absolute flex h-40 w-40 items-center justify-center overflow-visible opacity-50',
              lineColorText[station.lines[0]]
            )}
            icon={faGear}
            spin
          />
        </div>
      </Marker>
    );
  }
  return null;
};
