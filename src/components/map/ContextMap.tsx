import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { Station } from '../../types/station';
import { useStore } from '../../store';
import { MBTAStations } from './MBTAStations';
import { WalkingRadius } from './WalkingRadius';
import { BikeLanesLayer } from './layers/BikeLanesLayer';
import { BikeShareLayer } from './layers/BikeShareLayer';
import { MBTALinesLayer } from './layers/MBTALinesLayer';
import { ParkingLayer } from './layers/ParkingLayer';

const DefaultIcon = L.icon({
  // @ts-expect-error vite asset typing
  iconUrl: icon.src,
  // @ts-expect-error vite asset typing
  shadowUrl: iconShadow.src,
});
L.Marker.prototype.options.icon = DefaultIcon;

const noop = () => {};

const RecenterOn: React.FC<{ center: L.LatLngTuple }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center[0], center[1]]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
};

interface ContextMapProps {
  station: Station;
  layers: 'bike' | 'parking';
  height?: string;
}

export const ContextMap: React.FC<ContextMapProps> = ({
  station,
  layers,
  height = 'h-full min-h-[18rem]',
}) => {
  const { darkMode } = useStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const center = station.coordinates?.sort(function (a, b) {
    return (b as number) - (a as number);
  }) as L.LatLngTuple | undefined;

  return (
    <div
      className={`${height} w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700`}
    >
      {mounted && center && (
        <MapContainer
          center={center}
          zoom={14}
          minZoom={12}
          maxZoom={18}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url={
              darkMode
                ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            }
          />
          <MBTALinesLayer setShowLayer={noop} />
          <MBTAStations setStation={noop} allowNavigation={false} />
          {layers === 'bike' && (
            <>
              <BikeLanesLayer station={station} setShowLayer={noop} />
              <BikeShareLayer station={station} setShowLayer={noop} />
            </>
          )}
          {layers === 'parking' && <ParkingLayer station={station} setShowLayer={noop} />}
          <WalkingRadius station={station} />
          <RecenterOn center={center} />
        </MapContainer>
      )}
    </div>
  );
};
