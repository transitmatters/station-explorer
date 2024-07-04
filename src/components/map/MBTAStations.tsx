import React from 'react';
// @ts-ignore
import { MarkerLayer } from 'react-leaflet-marker';
import type { LatLngTuple } from 'leaflet';
import type { Station } from '../../types/station';
import {
  lineColorBBorder,
  lineColorBorder,
  lineColorLBorder,
  lineColorRBorder,
  lineColorTBorder,
  lineColorXBorder,
  lineColorYBorder,
} from '../../styles/general';
import { COMMUTER_RAIL_LINES, RAPID_LINES } from '../../constants/line';
import { stations } from '../../constants/stations';
import { MBTAStationMarker } from './MBTAStationMarker';

export const StationBorderColors = (station: Station): string[] => {
  const colorLines = [
    ...station.lines.filter((line) => RAPID_LINES.includes(line)),
    ...(station.lines.some((l) => COMMUTER_RAIL_LINES.includes(l)) ? [COMMUTER_RAIL_LINES[0]] : []),
  ];

  if (colorLines.length === 1) {
    return [lineColorBorder[colorLines[0]]];
  } else if (colorLines.length === 2) {
    return [lineColorXBorder[colorLines[0]], lineColorYBorder[colorLines[1]]];
  } else if (colorLines.length === 3) {
    return [
      lineColorXBorder[colorLines[0]],
      lineColorTBorder[colorLines[1]],
      lineColorBBorder[colorLines[2]],
    ];
  } else if (colorLines.length >= 4) {
    return [
      lineColorLBorder[colorLines[0]],
      lineColorRBorder[colorLines[1]],
      lineColorTBorder[colorLines[2]],
      lineColorBBorder[colorLines[3]],
    ];
  } else {
    return [];
  }
};

interface MBTAStationsProps {
  setStation: (station: Station) => void;
  allowNavigation?: boolean;
}

export const MBTAStations: React.FC<MBTAStationsProps> = ({
  setStation,
  allowNavigation = true,
}) => {
  return (
    <MarkerLayer className={'relative z-[1000]'} zIndexOffset={1000}>
      {stations.map((station) => {
        const borderColors = StationBorderColors(station);
        const stationCoords = station.coordinates?.sort(function (a, b) {
          return (b as number) - (a as number);
        }) as LatLngTuple | undefined;

        if (stationCoords && borderColors) {
          return (
            <MBTAStationMarker
              key={station.station}
              station={station}
              setStation={setStation}
              position={stationCoords}
              borderColors={borderColors}
              allowNavigation={allowNavigation}
            />
          );
        }
      })}
    </MarkerLayer>
  );
};
