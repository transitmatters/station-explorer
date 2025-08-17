import area from '@turf/area';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { useGetDataForStation } from '../api/overpass';
import type { Station } from '../types/station';

export const useParkingStats = (station: Station, radius: number) => {
  const { data: surfaceData } = useGetDataForStation(station, radius, false);
  const { data: allData } = useGetDataForStation(station, radius, true);

  if (!surfaceData || !allData) {
    return { percentParking: 0, parkingSpots: 0, parkingSqFt: 0 };
  }

  const allParkingData: FeatureCollection<Geometry, GeoJsonProperties> = {
    ...allData,
    features: allData?.features.filter((f) => f.geometry.type !== 'Point'),
  };
  const allParkingFeats = allParkingData.features;

  // calculate total area taken up by parking, in square meters
  let all_parking_area = 0;
  for (const feat of allParkingFeats) {
    all_parking_area += area(feat.geometry);
  }

  let surface_parking_area = 0;
  for (const feat of surfaceData.features) {
    surface_parking_area += area(feat.geometry);
  }

  // calculate percentage of circle taken by parking
  const percentParking = (100 * all_parking_area) / (Math.PI * Math.pow(radius, 2));

  // calculate number of parking spots (26.7 sqaure meters per spot) or official capacity if available
  // reference: https://usa.streetsblog.org/2016/07/05/parking-takes-up-more-space-than-you-think
  const parkingSpots = Math.round(
    allParkingData.features
      .filter((f) => f.properties?.amenity === 'parking')
      .map((f) => {
        if (f.properties?.capacity && !isNaN(parseInt(f.properties?.capacity))) {
          return parseInt(f.properties?.capacity);
        }
        return area(f.geometry) / 26.7;
      })
      .reduce((partialSum, a) => partialSum + a, 0)
  );

  const parkingAcres = surface_parking_area / 4047;

  return { percentParking, parkingSpots, parkingAcres };
};
