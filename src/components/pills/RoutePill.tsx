import classNames from 'classnames';
import React from 'react';
import type { Route } from '../../types/routes';
import { ROUTE_COLOR_TO_CLASS_MAP } from '../../constants/colors';

interface RoutePillProps {
  route: Route;
}

export const RoutePill: React.FunctionComponent<RoutePillProps> = ({ route }) => {
  return (
    <span
      title={route.long_name}
      className={classNames(
        ROUTE_COLOR_TO_CLASS_MAP[route.color],
        'center-content rounded-full p-1 px-2.5 text-sm font-semibold text-white'
      )}
    >
      {route.short_name || route.long_name}
    </span>
  );
};
