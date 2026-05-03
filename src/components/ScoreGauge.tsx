import classNames from 'classnames';
import React from 'react';

interface ScoreGaugeProps {
  /** 0-100 score */
  score?: number;
  label?: string;
  size?: number;
}

const scoreColor = (score: number): string => {
  if (score >= 90) return '#16a34a'; // green-600
  if (score >= 80) return '#14b8a6'; // teal-500
  if (score >= 70) return '#eab308'; // yellow-500
  if (score >= 60) return '#f97316'; // orange-500
  if (score === 0) return '#9ca3af'; // gray-400
  return '#ef4444'; // red-500
};

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label, size = 96 }) => {
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const value = score ?? 0;
  const dash = (value / 100) * circumference;
  const color = scoreColor(value);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={6}
          stroke={color}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={classNames('font-mono text-2xl font-semibold')}
          style={{ color }}
        >
          {score ?? '—'}
        </span>
        {label && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
