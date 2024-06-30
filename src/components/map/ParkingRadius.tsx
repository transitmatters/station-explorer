import { GeoJSON, Circle } from 'react-leaflet';
import React from 'react';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { faGear } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
import { Marker } from 'react-leaflet-marker';
import type { LatLngTuple } from 'leaflet';
import type { Station } from '../../types/station';
import { lineColor, lineColorText } from '../../styles/general';
import { useGetCyclePathDataForStation, useGetDataForStation } from '../../api/overpass';

interface ParkingRadiusProps {
  station: Station;
  radius: number;
  options: {
    showParking: boolean;
    includeGarages: boolean;
    showBikePaths: boolean;
  };
}

export const ParkingRadius: React.FC<ParkingRadiusProps> = ({
  station,
  radius,
  options: { showParking, includeGarages, showBikePaths },
}) => {
  const { data } = useGetDataForStation(station, radius, includeGarages);
  const { data: bikeData } = useGetCyclePathDataForStation(station, 1000);

  // For some reason `center` is reading coordinates backwards and putting us in antartica
  const mapCenter = station.coordinates?.sort(function (a, b) {
    return (b as number) - (a as number);
  }) as LatLngTuple | undefined;

  if (mapCenter && data && bikeData) {
    // Filter out points
    const parkingGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
      ...data,
      features: data?.features.filter((f) => f.geometry.type !== 'Point'),
    };

    const bikeGeojson: FeatureCollection<Geometry, GeoJsonProperties> = {
      ...bikeData,
      features: bikeData?.features.filter((f) => f.geometry.type !== 'Point'),
    };

    return (
      <>
        {showParking && (
          <GeoJSON
            key={`${station.station}-${radius}-${includeGarages ? 'all' : 'surface'}-parking`}
            attribution={'&copy; <a href="https://transitmatters.org">TransitMatters</a>'}
            data={parkingGeojson}
            interactive={false}
          />
        )}
        {showBikePaths && (
          <GeoJSON
            key={`${station.station}-${radius}-bike`}
            attribution={'&copy; <a href="https://transitmatters.org">TransitMatters</a>'}
            data={bikeGeojson}
            style={{ color: 'green' }}
            interactive={false}
          />
        )}
        <Circle
          center={{ lat: mapCenter[0], lng: mapCenter[1] }}
          pathOptions={{
            color: lineColor[station.lines[0]],
            fillColor: lineColor[station.lines[0]],
            opacity: 0.5,
            fillOpacity: 0.15,
          }}
          radius={radius}
          interactive={false}
        />
      </>
    );
  } else if (mapCenter) {
    return (
      <Marker position={mapCenter}>
        <div
          className={classNames('group absolute flex cursor-pointer items-center justify-center')}
        >
          <FontAwesomeIcon
            className={classNames(
              'absolute flex h-40 w-40 items-center justify-center overflow-visible opacity-70',
              lineColorText[station.lines[0]]
            )}
            icon={faGear}
            spin
          />
        </div>
      </Marker>
    );
  } else {
    return null;
  }
};
