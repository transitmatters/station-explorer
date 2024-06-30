import type { Line } from '../types/line';

export const COLORS = {
  mbta: {
    red: '#D13434',
    orange: '#ed8b00',
    blue: '#003da5',
    silver: '#7C878E',
    green: '#00834d',
    bus: '#FFC72C',
    cr: '#80276c',
  },
  charts: {
    fillBackgroundColor: '#bfc8d680',
    fillBackgroundColorHourly: '#88aee680',
    pointBackgroundColor: '#1c1c1c',
    pointColor: '#1c1c1c',
  },
  tm: {
    red: '#a31e1e',
    grey: '#2e2d2c',
  },
  design: {
    darkGrey: '#353535',
    sideBar: '#403e3e',
    subtitleGrey: '#808080',
    lightGrey: '#DADADA',
    background: '#F6F6F6',
  },
};

export const LINE_BG_COLOR_MAP: Record<Line, string> = {
  'line-red': 'bg-mbta-red',
  'line-orange': 'bg-mbta-orange',
  'line-green': 'bg-mbta-green',
  'line-blue': 'bg-mbta-blue',
  'line-silver': 'bg-mbta-silver',
  'line-bus': 'bg-mbta-bus',
  'line-mattapan': 'bg-mbta-red',
  'cr-fairmount': 'bg-mbta-commuterRail',
  'cr-worcester': 'bg-mbta-commuterRail',
  'cr-franklin': 'bg-mbta-commuterRail',
  'cr-greenbush': 'bg-mbta-commuterRail',
  'cr-kingston': 'bg-mbta-commuterRail',
  'cr-middleborough': 'bg-mbta-commuterRail',
  'cr-needham': 'bg-mbta-commuterRail',
  'cr-providence': 'bg-mbta-commuterRail',
  'cr-foxboro': 'bg-mbta-commuterRail',
  'cr-fitchburg': 'bg-mbta-commuterRail',
  'cr-newburyport': 'bg-mbta-commuterRail',
  'cr-haverhill': 'bg-mbta-commuterRail',
  'cr-lowell': 'bg-mbta-commuterRail',
};
