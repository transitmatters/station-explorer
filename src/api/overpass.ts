import { useQuery } from '@tanstack/react-query';
import osmtogeojson from 'osmtogeojson';
import { overpass } from 'overpass-ts';
import type { Station } from '../types/station';
import { ONE_DAY } from '../constants/time';

// Overpass enforces IP-based rate limits. These options give failing queries a
// few backoff attempts and keep results around long enough that re-navigation
// doesn't re-fetch.
const overpassQueryOptions = {
  staleTime: ONE_DAY,
  gcTime: ONE_DAY,
  retry: 3,
  retryDelay: (attempt: number) => Math.min(2000 * 2 ** attempt, 30_000),
};

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
    (
      wr(around:${radius},${coordinates[0]},${coordinates[1]})["highway"="cycleway"];
      wr(around:${radius},${coordinates[0]},${coordinates[1]})["cycleway"]["cycleway"!="no"];
      wr(around:${radius},${coordinates[0]},${coordinates[1]})["cycleway:left"]["cycleway:left"!="no"];
      wr(around:${radius},${coordinates[0]},${coordinates[1]})["cycleway:right"]["cycleway:right"!="no"];
      wr(around:${radius},${coordinates[0]},${coordinates[1]})["cycleway:both"]["cycleway:both"!="no"];
    );
    (._;>;);
    out body;`;
    const response = await overpass(query);
    const json = await response.json();
    const geojson = osmtogeojson(json);

    return geojson;
  }
};

export const getBikeShareDataForStation = async (station: Station, radius: number) => {
  if (station.coordinates) {
    const coordinates = station.coordinates.sort((a: number, b: number) => {
      return b - a;
    });
    const query = `[timeout:30][out:json];
    nw(around:${radius},${coordinates[0]},${coordinates[1]})["amenity"="bicycle_rental"];
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
    ...overpassQueryOptions,
  });
};

export const useGetCyclePathDataForStation = (station: Station, radius: number) => {
  return useQuery({
    queryKey: [`getStationBikeData`, station, radius],
    queryFn: () => getBikePathDataForStation(station, radius),
    ...overpassQueryOptions,
  });
};

export const useGetBikeShareDataForStation = (station: Station, radius: number) => {
  return useQuery({
    queryKey: [`getStationBikeShareData`, station, radius],
    queryFn: () => getBikeShareDataForStation(station, radius),
    ...overpassQueryOptions,
  });
};
