import React from 'react';
import { useBreakpoint } from '../utils/hooks/useBreakpoint';

interface HorizontalDividerProps {
  title?: string;
}

export const HorizontalDivider: React.FunctionComponent<HorizontalDividerProps> = ({ title }) => {
  const isMobile = !useBreakpoint('sm');

  return (
    <div>
      <hr className="mx-12 my-4 h-px border-0 bg-gray-200 dark:bg-gray-500 md:mx-24 lg:mx-36" />
      {isMobile && !!title && (
        <span className="absolute left-0 right-0 m-auto w-fit -translate-y-7 rounded-xl border border-gray-300 bg-white p-1 text-xs italic">
          {title}
        </span>
      )}
    </div>
  );
};
