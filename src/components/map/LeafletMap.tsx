import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';
import React from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { MarkerLayer } from 'react-leaflet-marker';
import type { Station } from '../../types/station';
import { useStore } from '../../store';
import { MBTAStations } from './MBTAStations';
import { WalkingRadius } from './WalkingRadius';
import { MBTALinesLayer } from './layers/MBTALinesLayer';
import { BikeLanesLayer } from './layers/BikeLanesLayer';
import { ParkingLayer } from './layers/ParkingLayer';
import { BikeShareLayer } from './layers/BikeShareLayer';

const DefaultIcon = L.icon({
  // @ts-expect-error Types seem to be missing/wrong
  iconUrl: icon.src,
  // @ts-expect-error Types seem to be missing/wrong
  shadowUrl: iconShadow.src,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  station: Station;
  setStation: (station: Station) => void;
  allowNavigation?: boolean;
  options: {
    showRouteLines: boolean;
    setShowRouteLines: (show: boolean) => void;
    showParking: boolean;
    setShowParking: (show: boolean) => void;
    showBikePaths: boolean;
    setShowBikePaths: (show: boolean) => void;
    showBikeShares: boolean;
    setShowBikeShares: (show: boolean) => void;
  };
}

const UpdateMapCenter = ({ mapCenter }: { mapCenter: L.LatLngTuple }) => {
  const map = useMap();
  map.setView(mapCenter, map.getZoom(), {
    animate: true,
  });
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({
  station,
  setStation,
  options: {
    showRouteLines,
    setShowRouteLines,
    showBikePaths,
    setShowBikePaths,
    showBikeShares,
    setShowBikeShares,
    showParking,
    setShowParking,
  },
  allowNavigation = true,
}) => {
  const { darkMode } = useStore();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // For some reason `center` is reading coordinates backwards and putting us in antartica
  const mapCenter = station.coordinates?.sort(function (a, b) {
    return (b as number) - (a as number);
  }) as L.LatLngTuple | undefined;

  if (isMounted && mapCenter) {
    return (
      <MapContainer
        key={allowNavigation ? 'full-map' : 'small-map'}
        center={mapCenter}
        zoom={15}
        minZoom={10}
        maxZoom={18}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            darkMode
              ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
              : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
          }
        />
        <MBTAStations setStation={setStation} allowNavigation={allowNavigation} />
        <MarkerLayer>
          <LayersControl position="topright">
            <LayersControl.Overlay name="MBTA Lines" checked={showRouteLines}>
              <MBTALinesLayer setShowLayer={setShowRouteLines} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Bike Lanes" checked={showBikePaths}>
              <BikeLanesLayer station={station} setShowLayer={setShowBikePaths} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Blue Bikes" checked={showBikeShares}>
              <BikeShareLayer station={station} setShowLayer={setShowBikeShares} />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Parking Lots" checked={showParking}>
              <ParkingLayer station={station} setShowLayer={setShowParking} />
            </LayersControl.Overlay>
          </LayersControl>
          <WalkingRadius station={station} />
        </MarkerLayer>
        <UpdateMapCenter mapCenter={mapCenter} />
      </MapContainer>
    );
  }
};

export { LeafletMap };
