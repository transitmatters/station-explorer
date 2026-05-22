import React from 'react';

export const TMLogo: React.FunctionComponent = () => {
  return (
    <a href="https://transitmatters.org">
      <div className="w-56 pl-1 md:w-64 md:pl-2 lg:w-80">
        <img src={'TMLogo.png'} alt="TransitMatters" />
      </div>
    </a>
  );
};
