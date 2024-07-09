import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import React from 'react';
import { LayerGroup, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { useGetBikeShareDataForStation } from '../../../api/overpass';
import { WALKING_RADIUS } from '../../../constants/mobility';
import type { Station } from '../../../types/station';
import { MapLoadingSpinner } from '../MapLoadingSpinner';

interface BikeShareLayerProps {
  setShowLayer: (showLayer: boolean) => void;
  station: Station;
}

export const BikeShareLayer: React.FunctionComponent<BikeShareLayerProps> = ({
  station,
  setShowLayer,
}) => {
  const { data: bikeData, isLoading } = useGetBikeShareDataForStation(station, WALKING_RADIUS);

  if (!bikeData) {
    if (isLoading) {
      return <MapLoadingSpinner station={station} />;
    }
    return null;
  }

  const bikeGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
    ...bikeData,
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
        key={`${station.station}-bikeshare`}
        attribution={'&copy; <a href="https://transitmatters.org">TransitMatters</a>'}
        data={bikeGeojson}
        style={{ color: '#6dae6d' }}
        interactive={false}
        pointToLayer={(feature, latlng) => {
          return L.marker(latlng, {
            icon: L.icon({
              iconSize: [20, 20],
              iconUrl:
                'https://d21xlh2maitm24.cloudfront.net/bst/favicon-2.ico?mtime=20180503154756',
            }),
          });
        }}
      />
    </LayerGroup>
  );
};
