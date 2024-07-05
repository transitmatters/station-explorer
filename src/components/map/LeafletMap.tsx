import { LayersControl, MapContainer, TileLayer, useMap } from 'react-leaflet';
import React from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
// @ts-ignore
import { MarkerLayer } from 'react-leaflet-marker';
import type { Station } from '../../types/station';
import { MBTAStations } from './MBTAStations';
import { WalkingRadius } from './WalkingRadius';
import { MBTALinesLayer } from './layers/MBTALinesLayer';
import { BikeLanesLayer } from './layers/BikeLanesLayer';
import { ParkingLayer } from './layers/ParkingLayer';

const DefaultIcon = L.icon({
  // @ts-ignore
  iconUrl: icon.src,
  // @ts-ignore
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
    showParking,
    setShowParking,
  },
  allowNavigation = true,
}) => {
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

export default LeafletMap;
