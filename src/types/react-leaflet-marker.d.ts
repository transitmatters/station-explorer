declare module 'react-leaflet-marker' {
  import type { LatLngExpression } from 'leaflet';
  import type { ReactNode } from 'react';

  export interface MarkerProps {
    position: LatLngExpression;
    children?: ReactNode;
    interactive?: boolean;
    riseOnHover?: boolean;
    placement?: 'top' | 'bottom' | 'center';
    size?: [number, number];
    riseOffset?: number;
    autoPanOnFocus?: boolean;
    iconAnchor?: [number, number];
    [key: string]: unknown;
  }

  export interface MarkerLayerProps {
    children?: ReactNode;
    className?: string;
    pane?: string;
    zIndexOffset?: number;
  }

  export const Marker: React.FC<MarkerProps>;
  export const MarkerLayer: React.FC<MarkerLayerProps>;
}
