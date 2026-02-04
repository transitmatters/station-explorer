import type { Station } from '../types/station';
import stations_json from './stations.json';

export const stations = stations_json as Station[];

export const getStation = (stationId: string) => {
  return stations.find((station) => station.station === stationId);
};

export const chooseRandomStations = (num = 1) => {
  const res = [];
  for (let i = 0; i < num; ) {
    const random = Math.floor(Math.random() * stations.length);
    if (res.indexOf(stations[random]) !== -1) {
      continue;
    }
    res.push(stations[random]);
    i++;
  }
  return res;
};
