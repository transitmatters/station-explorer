import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import React from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
// @ts-ignore
import { MarkerLayer } from 'react-leaflet-marker';
import type { Station } from '../../types/station';
import { ParkingRadius } from './ParkingRadius';
import { MBTAStations } from './MBTAStations';

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
  radius?: number;
  options: {
    showParking: boolean;
    includeGarages: boolean;
    showBikePaths: boolean;
  };
  allowNavigation?: boolean;
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
  radius = 1000,
  options: { showBikePaths, showParking, includeGarages },
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
          <ParkingRadius
            station={station}
            radius={radius}
            options={{ showParking, includeGarages, showBikePaths }}
          />
          <UpdateMapCenter mapCenter={mapCenter} />
        </MarkerLayer>
      </MapContainer>
    );
  }
};

export default LeafletMap;
