import React from 'react';
import { useBreakpoint } from '../utils/hooks/useBreakpoint';
import { HorizontalDivider } from './HorizontalDivider';

interface StationDetailSectionProps {
  sectionName: string;
  children: React.ReactNode;
}

export const StationDetailSection: React.FunctionComponent<StationDetailSectionProps> = ({
  sectionName,
  children,
}) => {
  const isMobile = !useBreakpoint('sm');
  return (
    <div>
      <HorizontalDivider title={sectionName} />
      <div className="flex flex-row">
        {!isMobile && (
          <div className="mr-8 min-w-32 text-end text-gray-600 italic lg:mr-24 lg:min-w-56 dark:text-gray-300">
            {sectionName}
          </div>
        )}
        <div className="mx-8 w-full text-slate-950 lg:mr-36 dark:text-slate-50">{children}</div>
      </div>
    </div>
  );
};
