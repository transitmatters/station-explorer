import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';
import { faStairs } from '@fortawesome/free-solid-svg-icons';
import type { Escalator } from '../../types/facilities';
import type { Alert } from '../../types/alerts';
import { LoadingIndicator } from '../LoadingIndicator';
import { useBreakpoint } from '../../utils/hooks/useBreakpoint';

interface EscalatorsPillProps {
  escalators?: Escalator[];
  elevatorAlerts?: Alert[];
}

export const EscalatorsPill: React.FunctionComponent<EscalatorsPillProps> = ({
  escalators,
  elevatorAlerts,
}) => {
  const isMobile = !useBreakpoint('sm');

  const totalEscalators = escalators?.length || 0;
  const closedEscalators = elevatorAlerts?.length || 0;
  const openEscalators = totalEscalators - closedEscalators;

  return (
    <span
      title={
        closedEscalators > 0
          ? `${openEscalators}/${totalEscalators} escalators are open`
          : 'All escalators are open'
      }
      className={classNames(
        'center-content rounded-full p-1 pr-2.5 text-sm font-semibold text-white',
        closedEscalators > 0 ? 'bg-red-400' : totalEscalators === 0 ? 'bg-gray-400' : 'bg-green-400'
      )}
    >
      <FontAwesomeIcon icon={faStairs} className={classNames('h-4 w-4 px-1.5 text-white')} />
      {escalators && elevatorAlerts ? (
        <>
          {openEscalators} / {totalEscalators}
          {!isMobile && <span> Escalators</span>}
        </>
      ) : (
        <LoadingIndicator />
      )}
    </span>
  );
};
