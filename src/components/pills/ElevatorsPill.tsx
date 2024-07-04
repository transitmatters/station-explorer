import { faElevator } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import type { Elevator } from '../../types/facilities';
import type { Alert } from '../../types/alerts';
import { LoadingIndicator } from '../LoadingIndicator';
import { useBreakpoint } from '../../utils/hooks/useBreakpoint';

interface ElevatorsPillProps {
  elevators?: Elevator[];
  elevatorAlerts?: Alert[];
}

export const ElevatorsPill: React.FunctionComponent<ElevatorsPillProps> = ({
  elevators,
  elevatorAlerts,
}) => {
  const isMobile = !useBreakpoint('sm');

  const totalElevators = elevators?.length || 0;
  const closedElevators = elevatorAlerts?.length || 0;
  const openElevators = totalElevators - closedElevators;

  return (
    <span
      title={
        closedElevators > 0
          ? `${openElevators}/${totalElevators} elevators are open`
          : 'All elevators are open'
      }
      className={classNames(
        'center-content rounded-full p-1 pr-2.5 text-sm font-semibold text-white',
        closedElevators > 0 ? 'bg-red-400' : totalElevators === 0 ? 'bg-gray-400' : 'bg-green-400'
      )}
    >
      <FontAwesomeIcon icon={faElevator} className={classNames('h-4 w-4 px-1.5 text-white')} />
      {elevators && elevatorAlerts ? (
        <>
          {openElevators} / {totalElevators}
          {!isMobile && <span> Elevators</span>}
        </>
      ) : (
        <LoadingIndicator />
      )}
    </span>
  );
};
