import { faBan, faWheelchair } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import React from 'react';

interface AccessiblePillProps {
  accessible?: boolean;
}

export const AccessiblePill: React.FunctionComponent<AccessiblePillProps> = ({
  accessible = true,
}) => {
  return (
    <span className="fa-layers fa-fw h-6 w-7">
      <FontAwesomeIcon
        icon={faWheelchair}
        className={classNames(
          'h-4 w-4 rounded-full p-1.5 text-white',
          !accessible ? 'bg-gray-500' : 'bg-blue-500'
        )}
      />
      {!accessible && <FontAwesomeIcon icon={faBan} className="h-7 w-7 text-gray-400 opacity-80" />}
    </span>
  );
};
