import { faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import type { Station } from '../types/station';
import { useStore } from '../store';

interface CompareSelectorProps {
  currentStation: Station;
}

export const CompareSelector: React.FunctionComponent<CompareSelectorProps> = ({
  currentStation,
}) => {
  const { comparisonStation, setComparisonStation } = useStore();
  const isCompareMode = comparisonStation !== null;

  const handleCompareClick = () => {
    if (isCompareMode) {
      setComparisonStation(null);
    } else {
      setComparisonStation(currentStation);
    }
  };

  return (
    <div className="absolute right-2 top-48 flex flex-col content-center items-end text-center lg:right-8">
      <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
      <CompareButton isCompareMode={isCompareMode} onClick={handleCompareClick} />
      <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
    </div>
  );
};

interface CompareButtonProps {
  isCompareMode: boolean;
  onClick: () => void;
}

const CompareButton: React.FunctionComponent<CompareButtonProps> = ({ isCompareMode, onClick }) => {
  return (
    <button
      title={isCompareMode ? 'Cancel comparison' : 'Compare Stations'}
      onClick={onClick}
      className={`group z-[450] flex items-center justify-center rounded-lg p-2 transition-colors ${
        isCompareMode
          ? 'bg-cyan-700 text-white dark:bg-cyan-800'
          : 'bg-opacity-10 text-gray-500 hover:bg-cyan-700 hover:text-white dark:text-gray-400 dark:hover:bg-cyan-800 dark:hover:text-white'
      }`}
    >
      <span className="flex items-center">
        <FontAwesomeIcon
          icon={isCompareMode ? faTimes : faPlusCircle}
          className={
            isCompareMode ? 'text-white' : 'text-gray-500 group-hover:text-white dark:text-gray-400'
          }
        />
        <span className="ml-2 text-xs">{isCompareMode ? 'Cancel' : 'Compare'}</span>
      </span>
    </button>
  );
};
