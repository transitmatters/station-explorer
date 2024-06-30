import React from 'react';

interface OverviewCircleProps {
  children: React.ReactNode;
}

const OverviewCircle: React.FunctionComponent<OverviewCircleProps> = ({ children }) => {
  return (
    <div className={'m-6 h-24 w-24 content-center justify-center rounded-full'}>
      <div
        className={
          'absolute h-24 w-24 -translate-x-2 -translate-y-2 rounded-full bg-green-500 opacity-50'
        }
      />
      <div
        className={
          'absolute h-24 w-24 translate-x-2 translate-y-2 rounded-full bg-purple-500 opacity-50'
        }
      />
      <div
        className={
          'relative flex h-24 w-24 content-center items-center justify-center rounded-full bg-white'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default OverviewCircle;
