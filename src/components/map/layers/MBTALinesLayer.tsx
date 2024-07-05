import { LayerGroup, Polyline } from 'react-leaflet';
import React from 'react';
import { decode } from '@mapbox/polyline';
import { useGetRouteShapeForAllRoutes } from '../../../api/shape';
import { ROUTE_BG_COLOR_MAP } from '../../../constants/colors';

interface MBTALinesLayerProps {
  setShowLayer: (showLayer: boolean) => void;
  allowNavigation?: boolean;
}

export const MBTALinesLayer: React.FunctionComponent<MBTALinesLayerProps> = ({
  setShowLayer,
  allowNavigation,
}) => {
  const routePatterns = useGetRouteShapeForAllRoutes();

  const routePolylines = routePatterns
    .map((routePattern) =>
      routePattern.data?.map((pattern) => {
        if (!isNaN(parseInt(pattern.id)) && pattern.route) {
          return (
            <Polyline
              key={pattern.id}
              pathOptions={{
                interactive: false,
                color: ROUTE_BG_COLOR_MAP[pattern.route],
                opacity: allowNavigation ? 0.5 : 0.25,
                className: 'relative z-10',
              }}
              positions={decode(pattern.polyline)}
            />
          );
        }
      })
    )
    .filter((pattern) => pattern !== undefined);

  return (
    <LayerGroup
      eventHandlers={{
        add: () => {
          setShowLayer(true);
        },
        remove: () => {
          setShowLayer(false);
        },
      }}
    >
      {routePolylines}
    </LayerGroup>
  );
};
