import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const LoadingIndicator: React.FunctionComponent = () => {
  return (
    <FontAwesomeIcon
      icon={faCircleNotch}
      spin
      title="Loading"
      className="text-gray-600 text-inherit"
    />
  );
};
