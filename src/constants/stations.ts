import { Station } from '../types/station';
import stations_json from './stations.json';

export const stations = stations_json as Station[];

export const getStation = (stationId: string) => {
  return stations.find((station) => station.station === stationId);
};

export const chooseRandomStations = (num = 1) => {
  console.warn(
    'Stations with long names: ',
    stations
      .map((stop) => {
        if (stop.stop_name.length > 15 && stop.short === undefined) {
          return stop.stop_name;
        }
      })
      .filter((predicate) => predicate !== undefined),
    'We need to shorten these names for mobile/small screens!'
  );
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
