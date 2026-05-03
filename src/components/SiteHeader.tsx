import React from 'react';
import { Link } from '@tanstack/react-router';

export const SiteHeader: React.FunctionComponent = () => {
  return (
    <header className="sticky top-0 z-[1000] w-full bg-cyan-900 text-white shadow-md dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-lg font-bold sm:text-xl">Station Explorer</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/70 sm:text-xs">
            by{' '}
            <span className="font-bold tracking-wider">
              TRANSIT<span className="text-mbta-red">MATTERS</span>
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
};
