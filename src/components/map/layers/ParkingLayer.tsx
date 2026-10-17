import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { LayerGroup, GeoJSON } from 'react-leaflet';
import React from 'react';
import { useGetDataForStation } from '../../../api/overpass';
import type { Station } from '../../../types/station';
import { MapLoadingSpinner } from '../MapLoadingSpinner';

interface ParkingLayerProps {
  station: Station;
  setShowLayer: (showLayer: boolean) => void;
}

export const ParkingLayer: React.FunctionComponent<ParkingLayerProps> = ({
  station,
  setShowLayer,
}) => {
  const { data: parkingData, isLoading } = useGetDataForStation(station, true);

  if (!parkingData) {
    if (isLoading) {
      return <MapLoadingSpinner station={station} />;
    }
    return null;
  }

  // Filter out points
  const parkingGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    ...parkingData,
    features: parkingData?.features.filter((f) => f.geometry.type !== 'Point'),
  };

  return (
    <LayerGroup
      eventHandlers={{
        add: () => {
          setShowLayer(true);
        },
        remove: () => {
          setShowLayer(false);
        },
      }}
    >
      <GeoJSON
        key={`${station.station}-parking`}
        attribution={'&copy; <a href="https://transitmatters.org">TransitMatters</a>'}
        data={parkingGeojson}
        interactive={false}
      />
    </LayerGroup>
  );
};
