import type { Line, LineObject } from '../types/line';
import { COLORS } from './colors';

export const GTFS_COLOR_LINE_IDS = ['line-Red', 'line-Orange', 'line-Blue', 'line-Green'] as const;

export const HEAVY_RAIL_LINES: Line[] = ['line-red', 'line-orange', 'line-blue'];
export const RAPID_LINES: Line[] = [
  'line-red',
  'line-orange',
  'line-blue',
  'line-green',
  'line-silver',
  'line-mattapan',
];

export const COMMUTER_RAIL_LINES: Line[] = [
  'cr-fairmount',
  'cr-foxboro',
  'cr-franklin',
  'cr-greenbush',
  'cr-kingston',
  'cr-middleborough',
  'cr-needham',
  'cr-providence',
  'cr-worcester',
  'cr-fitchburg',
  'cr-newburyport',
  'cr-haverhill',
  'cr-lowell',
];

export const RAIL_LINES = ['red', 'orange', 'green', 'blue'];
export const BUS_ROUTES = [
  '1',
  '15',
  '22',
  '23',
  '28',
  '32',
  '39',
  '57',
  '66',
  '71',
  '73',
  '77',
  '111',
  '114/116/117',
];

export const ALL_LINE_PATHS = RAIL_LINES.map((line) => {
  return {
    params: {
      line: line,
    },
  };
});

export const BUS_PATH = {
  params: {
    line: 'bus',
  },
};

export const LINE_OBJECTS: LineObject = {
  'line-red': {
    name: 'Red Line',
    short: 'Red',
    key: 'line-red',
    color: COLORS.mbta.red,
  },
  'line-orange': {
    name: 'Orange Line',
    short: 'Orange',
    key: 'line-orange',
    color: COLORS.mbta.orange,
  },
  'line-green': {
    name: 'Green Line',
    short: 'Green',
    key: 'line-green',
    color: COLORS.mbta.green,
  },
  'line-blue': {
    name: 'Blue Line',
    short: 'Blue',
    key: 'line-blue',
    color: COLORS.mbta.blue,
  },
  'line-silver': {
    name: 'Silver Line',
    short: 'Silver',
    key: 'line-silver',
    color: COLORS.mbta.silver,
  },
  'line-mattapan': {
    name: 'Mattapan Line',
    short: 'Mattapan',
    key: 'line-mattapan',
    color: COLORS.mbta.red,
  },

  'line-bus': {
    name: 'Buses',
    short: 'Bus',
    key: 'line-bus',
    color: COLORS.mbta.bus,
  },
  'cr-fairmount': {
    name: 'Fairmount Line',
    short: 'Fairmount',
    key: 'cr-fairmount',
    color: COLORS.mbta.cr,
  },
  'cr-worcester': {
    name: 'Framingham/Worcester Line',
    short: 'Worcester',
    key: 'cr-worcester',
    color: COLORS.mbta.cr,
  },
  'cr-foxboro': {
    name: 'Foxboro Event Service',
    short: 'Foxboro',
    key: 'cr-foxboro',
    color: COLORS.mbta.cr,
  },
  'cr-franklin': {
    name: 'Franklin/Foxboro Line',
    short: 'Franklin',
    key: 'cr-franklin',
    color: COLORS.mbta.cr,
  },
  'cr-greenbush': {
    name: 'Greenbush Line',
    short: 'Greenbush',
    key: 'cr-greenbush',
    color: COLORS.mbta.cr,
  },
  'cr-kingston': {
    name: 'Kingston Line',
    short: 'Kingston',
    key: 'cr-kingston',
    color: COLORS.mbta.cr,
  },
  'cr-middleborough': {
    name: 'Middleborough/Lakeville Line',
    short: 'Middleborough',
    key: 'cr-middleborough',
    color: COLORS.mbta.cr,
  },
  'cr-needham': {
    name: 'Needham Line',
    short: 'Needham',
    key: 'cr-needham',
    color: COLORS.mbta.cr,
  },
  'cr-providence': {
    name: 'Providence/Stoughton Line',
    short: 'Providence',
    key: 'cr-providence',
    color: COLORS.mbta.cr,
  },
  'cr-fitchburg': {
    name: 'Fitchburg Line',
    short: 'Fitchburg',
    key: 'cr-fitchburg',
    color: COLORS.mbta.cr,
  },
  'cr-newburyport': {
    name: 'Newburyport/Rockport Line',
    short: 'Newburyport',
    key: 'cr-newburyport',
    color: COLORS.mbta.cr,
  },
  'cr-haverhill': {
    name: 'Haverhill Line',
    short: 'Haverhill',
    key: 'cr-haverhill',
    color: COLORS.mbta.cr,
  },
  'cr-lowell': {
    name: 'Lowell Line',
    short: 'Lowell',
    key: 'cr-lowell',
    color: COLORS.mbta.cr,
  },
};
