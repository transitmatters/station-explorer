import React from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { hero } from './content';
import { NeighborhoodHeader } from './NeighborhoodHeader';
import { useStationPicker } from './useStationPicker';

export const ABOUT_ID = 'about';

export const Hero: React.FunctionComponent = () => {
  const { openPicker, picker } = useStationPicker();

  const scrollToAbout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(ABOUT_ID);
    if (!target) return;
    event.preventDefault();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', `#${ABOUT_ID}`);
  };

  return (
    <>
      <header className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-cyan-900 px-4 pt-24 pb-14">
        <NeighborhoodHeader />

        <a
          className="absolute top-7 left-1/2 block -translate-x-1/2 leading-none"
          href="https://transitmatters.org"
          aria-label="TransitMatters"
        >
          <img src="/TMLogo.png" alt="" width={3189} height={299} className="h-auto w-56" />
        </a>

        <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
          <h1 className="text-[clamp(2.75rem,8vw,6rem)] leading-none font-extrabold tracking-tight uppercase italic">
            {hero.title}
          </h1>
          <p className="text-[clamp(1.25rem,3vw,1.75rem)] font-semibold">{hero.tagline}</p>
          <p className="max-w-2xl text-lg leading-relaxed text-white/75">{hero.subtitle}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <button
              type="button"
              onClick={openPicker}
              className="rounded-md border-2 border-white bg-cyan-900/80 px-8 py-3.5 font-bold tracking-wider uppercase italic transition-colors hover:bg-white hover:text-cyan-900 focus-visible:bg-white focus-visible:text-cyan-900"
            >
              {hero.primaryCta}
            </button>
            <a
              href={`#${ABOUT_ID}`}
              onClick={scrollToAbout}
              className="inline-flex items-center gap-2 px-1 py-3 font-medium text-white/75 hover:text-white"
            >
              {hero.secondaryCta}
              <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
            </a>
          </div>
        </div>

        <span
          className="absolute inset-x-0 bottom-5 flex justify-center text-white/50"
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={faChevronDown} className="motion-safe:animate-bob" />
        </span>
      </header>
      {/* Outside the header, whose isolated stacking context would trap the modal under later sections. */}
      {picker}
    </>
  );
};
