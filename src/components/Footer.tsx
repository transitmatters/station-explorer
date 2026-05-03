import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export const Footer: React.FunctionComponent = () => {
  return (
    <footer className="mt-8 flex w-full items-center justify-between border-t border-gray-200 bg-slate-50 px-4 py-3 text-xs text-gray-500 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300 sm:px-6 lg:px-10">
      <div>
        <a
          href="https://transitmatters.org"
          target="_blank"
          rel="noreferrer"
          className="hover:text-cyan-700 dark:hover:text-cyan-400"
        >
          TransitMatters
        </a>
        {' · Station Explorer'}
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">Theme</span>
        <ThemeSwitcher />
      </div>
    </footer>
  );
};
