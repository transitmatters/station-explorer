import {
  faBicycle,
  faBuilding,
  faMapMarked,
  faWheelchair,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-scroll';
import { OverviewCircle } from '../../OverviewCircle';
import { ThemeSwitcher } from '../../ThemeSwitcher';
import { StationHighlight } from '../../StationHighlight';
import { chooseRandomStations } from '../../../constants/stations';
import { TMLogo } from '../../TMLogo';

export const Home: React.FunctionComponent = () => {
  return (
    <div className="flex w-full flex-col content-center items-center justify-center bg-cyan-700 text-center dark:bg-cyan-800">
      <div className="absolute right-0 top-0 m-4 rounded-md bg-slate-50 p-2 dark:bg-slate-900">
        <ThemeSwitcher />
      </div>
      <div className="min-h-screen content-center">
        <div className="flex flex-row items-center justify-center">
          <TMLogo />
        </div>
        <div className="m-8 text-sm text-white">
          <FontAwesomeIcon
            icon={faMapMarked}
            className="h-40 w-40"
            title="TODO: Replace with animated map/icon"
          />
        </div>
        <div>
          <h1 className="text-6xl font-bold uppercase italic text-white">Station Explorer</h1>
          <button
            type="button"
            className="mt-4 cursor-pointer rounded border-2 p-1 uppercase italic text-white hover:border-slate-100 hover:bg-white hover:text-cyan-700"
          >
            <Link to="info" smooth={true} duration={1000} offset={1000}>
              Explore
            </Link>
          </button>
        </div>
      </div>
      <div id="info">
        <h1 className="my-8 text-3xl font-semibold uppercase italic text-white md:text-5xl">
          What makes a good station?
        </h1>
        <div className="mx-8 flex flex-col gap-8 md:flex-row lg:mx-24">
          <div className="flex flex-col content-center items-center">
            <OverviewCircle>
              <FontAwesomeIcon
                icon={faWheelchair}
                className="h-12 w-12 text-cyan-700 dark:text-cyan-800"
              />
            </OverviewCircle>
            <h2 className="text-xl font-semibold text-white">Access</h2>
            <p className="max-w-96 text-white">
              Explore the access to the station. From bike racks to functioning elevators. How
              accessible is the station, and what can be done to make it better
            </p>
          </div>
          <div className="flex flex-col content-center items-center">
            <OverviewCircle>
              <FontAwesomeIcon
                icon={faBicycle}
                className="h-12 w-12 text-cyan-700 dark:text-cyan-800"
              />
            </OverviewCircle>
            <h2 className="text-xl font-semibold text-white">Connectivity</h2>
            <p className="max-w-96 text-white">
              How well does this station help you get to where you need to go?
            </p>
          </div>
          <div className="flex flex-col content-center items-center">
            <OverviewCircle>
              <FontAwesomeIcon
                icon={faBuilding}
                className="h-12 w-12 text-cyan-700 dark:text-cyan-800"
              />
            </OverviewCircle>
            <h2 className="text-xl font-semibold text-white">Land Use</h2>
            <p className="max-w-96 text-white">
              How does the station fit into the surrounding neighborhood? What could be done to
              improve the area around the station?
            </p>
          </div>
        </div>
      </div>
      <h2 className="my-4 mt-16 text-3xl font-semibold uppercase italic text-white md:text-5xl">
        Explore a station!
      </h2>
      <h5 className="text-white">Pick from one of these 6 random stations to start</h5>
      <div className="grid w-full grid-flow-row grid-cols-1 gap-8 p-8 sm:grid-cols-2 md:grid-cols-3 lg:px-32">
        {chooseRandomStations(6).map((station) => (
          <StationHighlight key={station.station} station={station} />
        ))}
      </div>
    </div>
  );
};
