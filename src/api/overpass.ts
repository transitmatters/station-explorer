import { useQuery } from '@tanstack/react-query';
import osmtogeojson from 'osmtogeojson';
import { overpass } from 'overpass-ts';
import type { Station } from '../types/station';

export const getParkingDataForStation = async (
  station: Station,
  radius: number,
  includeGarages: boolean = false
) => {
  if (station.coordinates) {
    const coordinates = station.coordinates.sort((a: number, b: number) => {
      return b - a;
    });
    const query = `[timeout:30][out:json];
    wr(around:${radius},${coordinates[0]},${
      coordinates[1]
    })["amenity"="parking"]["parking"!~"street_side"]${
      includeGarages
        ? ''
        : '["parking"!~"garage"]["parking"!~"multi-storey"]["building"!~"yes"]["parking"!~"underground"]'
    };
  (._;>;);
  out body;`;
    const response = await overpass(query);
    const json = await response.json();
    const geojson = osmtogeojson(json);

    return geojson;
  }
};

export const getBikePathDataForStation = async (station: Station, radius: number) => {
  if (station.coordinates) {
    const coordinates = station.coordinates.sort((a: number, b: number) => {
      return b - a;
    });
    const query = `[timeout:30][out:json];
    wr(around:${radius},${coordinates[0]},${coordinates[1]})["highway"="cycleway"];
  (._;>;);
  out body;`;
    const response = await overpass(query);
    const json = await response.json();
    const geojson = osmtogeojson(json);

    return geojson;
  }
};

export const useGetDataForStation = (
  station: Station,
  radius: number,
  includeGarages: boolean = false
) => {
  return useQuery({
    queryKey: [`getStationParkingData`, station, radius, includeGarages],
    queryFn: () => getParkingDataForStation(station, radius, includeGarages),
    staleTime: 86400,
  });
};

export const useGetCyclePathDataForStation = (station: Station, radius: number) => {
  return useQuery({
    queryKey: [`getStationBikeData`, station, radius],
    queryFn: () => getBikePathDataForStation(station, radius),
    staleTime: 86400,
  });
};
