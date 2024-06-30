import type { LatLngTuple } from 'leaflet';
import type { Line } from './line';

export interface Station {
  stop_name: string;
  station: string;
  accessible?: boolean;
  coordinates?: LatLngTuple;
  pedal_park?: boolean;
  enclosed_bike_parking?: boolean;
  paid_parking?: boolean;
  free_parking?: boolean;
  parking_lot?: boolean;
  municipality: string;
  short?: string;
  order: number;
  lines: Line[];
}
