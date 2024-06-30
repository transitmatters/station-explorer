import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CompareSelectorProps {}

export const CompareSelector: React.FunctionComponent<CompareSelectorProps> = () => {
  return (
    <div className="absolute right-2 top-40 flex flex-col content-center items-end text-center lg:right-8">
      <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
      <CompareButton />
      <hr className="mr-3 h-[40vh] w-px border-0 bg-gray-200 dark:bg-gray-500" />
    </div>
  );
};

const CompareButton: React.FunctionComponent = () => {
  return (
    <button
      title={'Compare Stations'}
      className={`group z-10 flex h-1/2 items-center justify-center rounded-full bg-opacity-10 p-1 text-gray-500 hover:bg-cyan-700 hover:text-white focus:outline-none dark:text-gray-400 dark:hover:bg-cyan-800 dark:hover:text-white sm:rounded-lg`}
    >
      <span className="flex items-center">
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="my-0.5 text-gray-500 group-hover:text-white dark:text-gray-400"
        />
        <span className="ml-1 hidden p-0 text-xs group-hover:block">Compare</span>
      </span>
    </button>
  );
};
