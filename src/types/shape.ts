import type { MBTARoute } from './line';

export interface Shape {
  id: string;
  polyline: string;
  type: string;
  route?: MBTARoute;
}
