import React from 'react';
import { TRANSITMATTERS_LINKS } from '../constants/links';
import ThemeSwitcher from './ThemeSwitcher';

const linkClass = 'hover:text-cyan-700 dark:hover:text-cyan-400';

export const Footer: React.FunctionComponent = () => {
  return (
    <footer className="mt-8 flex w-full flex-col items-center justify-between gap-2 border-t border-gray-200 bg-slate-50 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:px-6 lg:px-10 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-300">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <a href="https://transitmatters.org" target="_blank" rel="noreferrer" className={linkClass}>
          TransitMatters
        </a>
        <span aria-hidden="true">·</span>
        <span>Station Explorer</span>
        {TRANSITMATTERS_LINKS.map((link) => (
          <React.Fragment key={link.href}>
            <span aria-hidden="true">·</span>
            <a
              href={link.href}
              {...(link.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
              className={linkClass}
            >
              {link.label}
            </a>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline">Theme</span>
        <ThemeSwitcher />
      </div>
    </footer>
  );
};
