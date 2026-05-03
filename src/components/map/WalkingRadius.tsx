import { Circle } from 'react-leaflet';
import React from 'react';
import type { LatLngTuple } from 'leaflet';
import type { Station } from '../../types/station';
import { WALKING_RADIUS } from '../../constants/mobility';

interface WalkingRadiusProps {
  station: Station;
}

export const WalkingRadius: React.FunctionComponent<WalkingRadiusProps> = ({ station }) => {
  // For some reason `center` is reading coordinates backwards and putting us in antartica
  const mapCenter = station.coordinates?.sort(function (a, b) {
    return (b as number) - (a as number);
  }) as LatLngTuple | undefined;

  if (mapCenter) {
    return (
      <Circle
        center={{ lat: mapCenter[0], lng: mapCenter[1] }}
        pathOptions={{
          color: 'black',
          fillColor: 'gray',
          opacity: 0.5,
          fillOpacity: 0.15,
        }}
        radius={WALKING_RADIUS}
        interactive={false}
      />
    );
  }
};
