import classNames from 'classnames';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import type { DataSource } from '../types/data';
import { TooltipButton } from './TooltipButton';

interface MetricCardProps {
  title: string;
  description?: string;
  /** Big primary value. Optional — accessory alone may carry the value visually. */
  value?: React.ReactNode;
  /** Optional accessory element above the value: gauge, sparkline, badges, etc. */
  accessory?: React.ReactNode;
  /** Show the title's source-of-data tooltip with a link to provider */
  dataSource?: DataSource;
  /** Optional clickthrough URL for the whole card */
  href?: string;
  /** Span hint for grid layouts that want it wider */
  span?: 'normal' | 'wide' | 'full';
  className?: string;
}

const spanClass: Record<NonNullable<MetricCardProps['span']>, string> = {
  normal: '',
  wide: 'sm:col-span-2',
  full: 'col-span-full',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  description,
  value,
  accessory,
  dataSource,
  href,
  span = 'normal',
  className,
}) => {
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, target: '_blank' as const, rel: 'noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={classNames(
        'group flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 text-start shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-slate-800',
        href && 'cursor-pointer',
        spanClass[span],
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          {title}
          {dataSource && (
            <TooltipButton
              tooltipContent={
                <div className="inline-block whitespace-nowrap rounded-lg bg-slate-700 bg-opacity-90 p-2 text-xs text-white">
                  Source:{' '}
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
            />
          )}
        </h3>
      </div>
      {accessory && <div className="flex justify-center">{accessory}</div>}
      {value !== undefined && (
        <div className="font-mono text-3xl font-semibold leading-none text-gray-900 dark:text-gray-50">
          {value}
        </div>
      )}
      {description && (
        <p className="text-xs leading-snug text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </Wrapper>
  );
};
