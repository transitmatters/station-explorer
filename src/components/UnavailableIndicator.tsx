import React from 'react';

export const UnavailableIndicator: React.FunctionComponent = () => {
  return (
    <span
      title="Couldn't load data from OpenStreetMap"
      className="text-base font-normal text-gray-500 dark:text-gray-400"
    >
      Unavailable
    </span>
  );
};
