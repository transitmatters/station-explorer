import type { GTFS_COLOR_LINE_IDS } from '../constants/line';

export type Line =
  | 'line-red'
  | 'line-orange'
  | 'line-green'
  | 'line-blue'
  | 'line-silver'
  | 'line-bus'
  | 'line-mattapan'
  | CommuterRailLines;
export type LineShort =
  | 'Red'
  | 'Orange'
  | 'Green'
  | 'Blue'
  | 'Silver'
  | 'Mattapan'
  | 'Bus'
  | CommuterRailShort;
export type BusRoute =
  | '1'
  | '15'
  | '22'
  | '23'
  | '28'
  | '32'
  | '39'
  | '57'
  | '66'
  | '71'
  | '73'
  | '77'
  | '111'
  | '114/116/117';
export type CommuterRailLines =
  | 'cr-fairmount'
  | 'cr-worcester'
  | 'cr-franklin'
  | 'cr-greenbush'
  | 'cr-kingston'
  | 'cr-middleborough'
  | 'cr-needham'
  | 'cr-providence'
  | 'cr-foxboro'
  | 'cr-fitchburg'
  | 'cr-newburyport'
  | 'cr-haverhill'
  | 'cr-lowell';
export type CommuterRailShort =
  | 'Fairmount'
  | 'Worcester'
  | 'Franklin'
  | 'Greenbush'
  | 'Kingston'
  | 'Middleborough'
  | 'Needham'
  | 'Providence'
  | 'Foxboro'
  | 'Fitchburg'
  | 'Newburyport'
  | 'Haverhill'
  | 'Lowell';

export type MBTARoute =
  | 'Red'
  | 'Orange'
  | 'Green-B'
  | 'Green-C'
  | 'Green-D'
  | 'Green-E'
  | 'Blue'
  | 'Mattapan'
  | '751'
  | '749'
  | '743'
  | 'CR-Fairmount'
  | 'CR-Worcester'
  | 'CR-Franklin'
  | 'CR-Greenbush'
  | 'CR-Kingston'
  | 'CR-Middleborough'
  | 'CR-Needham'
  | 'CR-Providence'
  | 'CR-Foxboro'
  | 'CR-Fitchburg'
  | 'CR-Newburyport'
  | 'CR-Haverhill'
  | 'CR-Lowell';

export type LineMetadata = {
  name: string;
  color: string;
  short: LineShort;
  key: Line;
};
export type LineObject = { [key in Line]: LineMetadata };

export type LineRouteId =
  | Exclude<LineShort, 'Bus' | 'Green'>
  | 'bus'
  | 'Green-B'
  | 'Green-C'
  | 'Green-D'
  | 'Green-E';

export type GtfsColorLineId = (typeof GTFS_COLOR_LINE_IDS)[number];
