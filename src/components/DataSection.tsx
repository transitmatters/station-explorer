import type { ReactNode } from 'react';
import classNames from 'classnames';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useBreakpoint } from '../utils/hooks/useBreakpoint';
import type { DataSource } from '../types/data';
import { TooltipButton } from './TooltipButton';

interface DataSectionProps {
  title: string;
  description: string;
  dataValue: ReactNode;
  link?: string;
  dataSource: DataSource;
}

export const DataSection: React.FunctionComponent<DataSectionProps> = ({
  title,
  description,
  dataValue,
  link,
  dataSource,
}) => {
  const isMobile = !useBreakpoint('sm');

  return (
    <>
      <a
        href={link}
        target={'_blank'}
        rel="noreferrer"
        className={classNames(link ? 'cursor-pointer' : 'cursor-default')}
      >
        <div className="flex flex-row justify-between rounded-md">
          <div className="flex min-w-0 gap-x-4">
            <div className="ml-2 min-w-0 flex-auto">
              <p className="flex gap-1.5 text-start text-sm leading-6 font-semibold text-gray-600 dark:text-gray-200">
                {title}
                <TooltipButton
                  tooltipContent={
                    <div className="inline-block rounded-lg bg-slate-600/85 p-2 text-xs whitespace-nowrap text-white">
                      This data comes from{' '}
                      <a
                        className="cursor-pointer underline decoration-dotted hover:font-semibold hover:decoration-solid"
                        href={dataSource.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {dataSource.name}
                      </a>
                    </div>
                  }
                  item={<FontAwesomeIcon icon={faInfoCircle} className="text-xs text-slate-400" />}
                  ariaLabel={`Data source for ${title}`}
                />
              </p>
              {!isMobile && (
                <p className="mt-1 flex text-start text-xs leading-5 text-gray-500 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="mr-2 sm:flex sm:flex-col sm:items-end">
              <p
                className={classNames(
                  'font-mono text-xl leading-6 text-gray-800 dark:text-gray-200'
                )}
              >
                {dataValue}
              </p>
            </div>
          </div>
        </div>
        {isMobile && (
          <p className="mx-2 mt-1 flex text-start text-xs leading-5 text-gray-800 dark:text-gray-300">
            {description}
          </p>
        )}
      </a>
    </>
  );
};
