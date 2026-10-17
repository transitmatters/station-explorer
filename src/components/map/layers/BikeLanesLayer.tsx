import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { LayerGroup, GeoJSON } from 'react-leaflet';
import React from 'react';
import { useGetCyclePathDataForStation } from '../../../api/overpass';
import type { Station } from '../../../types/station';
import { MapLoadingSpinner } from '../MapLoadingSpinner';

interface BikeLanesLayerProps {
  setShowLayer: (showLayer: boolean) => void;
  station: Station;
}

export const BikeLanesLayer: React.FunctionComponent<BikeLanesLayerProps> = ({
  station,
  setShowLayer,
}) => {
  const { data: bikeData, isLoading } = useGetCyclePathDataForStation(station);

  if (!bikeData) {
    if (isLoading) {
      return <MapLoadingSpinner station={station} />;
    }
    return null;
  }

  const bikeGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    ...bikeData,
    features: bikeData?.features.filter((f) => f.geometry.type !== 'Point'),
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
        key={`${station.station}-bike`}
        attribution={'&copy; <a href="https://transitmatters.org">TransitMatters</a>'}
        data={bikeGeojson}
        style={{ color: '#6dae6d' }}
        interactive={false}
      />
    </LayerGroup>
  );
};
