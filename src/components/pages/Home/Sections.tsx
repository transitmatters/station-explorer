import React from 'react';
import {
  faBicycle,
  faBuilding,
  faHeart,
  faPersonWalking,
  faRestroom,
  faRightLeft,
  faSquareParking,
  faWheelchair,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { COLORS } from '../../../constants/colors';
import { TRANSITMATTERS_LINKS } from '../../../constants/links';
import { chooseRandomStations } from '../../../constants/stations';
import { StationHighlight } from '../../StationHighlight';
import { about, accessExample, donate, explore, features, footer } from './content';
import { ABOUT_ID } from './Hero';

const STRIPE_COLORS = [
  COLORS.mbta.red,
  COLORS.mbta.orange,
  COLORS.mbta.green,
  COLORS.mbta.blue,
  COLORS.mbta.silver,
];

const CARD = 'flex h-full flex-col gap-3.5 rounded-xl border border-white/10 bg-white/6 p-7';
const CARD_TITLE = 'text-xl font-bold leading-snug';
const CARD_BODY = 'text-[0.9375rem] leading-relaxed text-white/75';

const Section: React.FunctionComponent<{
  labelledBy: string;
  deep?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ labelledBy, deep, className, children }) => (
  <section
    aria-labelledby={labelledBy}
    className={classNames('px-4 py-[72px] md:py-28', deep && 'bg-cyan-950', className)}
  >
    <div className="mx-auto w-full max-w-6xl">{children}</div>
  </section>
);

/** Heading with a short stripe of line colors above it, like a route map legend. */
const SectionHeader: React.FunctionComponent<{ id: string; title: string; intro: string }> = ({
  id,
  title,
  intro,
}) => (
  <div className="mb-12 flex max-w-2xl flex-col gap-4">
    <div className="flex gap-1" aria-hidden="true">
      {STRIPE_COLORS.map((color) => (
        <span key={color} className="h-1.5 w-7 rounded-full" style={{ background: color }} />
      ))}
    </div>
    <h2
      id={id}
      className="text-[clamp(2rem,5vw,3rem)] leading-tight font-extrabold tracking-tight italic"
    >
      {title}
    </h2>
    <p className="text-[1.0625rem] leading-relaxed text-white/75">{intro}</p>
  </div>
);

// ---------------------------------------------------------------- about

const PILLAR_ICONS: Record<string, { icon: IconDefinition; a: string; b: string }> = {
  access: { icon: faWheelchair, a: COLORS.mbta.orange, b: COLORS.mbta.red },
  connectivity: { icon: faBicycle, a: COLORS.mbta.green, b: COLORS.mbta.blue },
  landUse: { icon: faBuilding, a: COLORS.mbta.bus, b: COLORS.mbta.cr },
};

/** White disc with two offset line-color discs behind it. */
const PillarIcon: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const { icon, a, b } = PILLAR_ICONS[id];
  return (
    <span className="relative m-1.5 mb-2 block h-14 w-14" aria-hidden="true">
      <span
        className="absolute inset-0 -translate-x-1.5 -translate-y-1.5 rounded-full"
        style={{ background: a }}
      />
      <span
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-full"
        style={{ background: b }}
      />
      <span className="absolute inset-0 grid place-items-center rounded-full bg-white text-cyan-900">
        <FontAwesomeIcon icon={icon} className="h-6 w-6" />
      </span>
    </span>
  );
};

export const AboutSection: React.FunctionComponent = () => (
  <Section labelledBy={ABOUT_ID}>
    <SectionHeader id={ABOUT_ID} title={about.title} intro={about.intro} />
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {about.pillars.map((pillar) => (
        <div key={pillar.id} className={CARD}>
          <PillarIcon id={pillar.id} />
          <h3 className={CARD_TITLE}>{pillar.title}</h3>
          <p className={CARD_BODY}>{pillar.body}</p>
        </div>
      ))}
    </div>
  </Section>
);

// ---------------------------------------------------------------- features

const TILE_ICONS: Record<string, IconDefinition> = {
  access: faWheelchair,
  scores: faPersonWalking,
  bikes: faBicycle,
  parking: faSquareParking,
  amenities: faRestroom,
  compare: faRightLeft,
};

// On the 4-column grid the accessibility tile takes a 2x2 corner and the
// others pack around it; on phones everything stacks.
const TILE_LAYOUT: Record<string, string | undefined> = {
  access: 'sm:col-span-2 sm:row-span-2',
  scores: 'sm:col-span-2',
  amenities: 'sm:col-span-2',
  compare: 'sm:col-span-2',
};

/** An example of the accessibility summary on a station page. */
const AccessExample: React.FunctionComponent = () => (
  <ul
    className="flex flex-1 flex-col justify-center divide-y divide-white/10 rounded-lg border border-white/10 bg-cyan-900/60 px-4"
    aria-hidden="true"
  >
    {accessExample.map((row) => (
      <li key={row.id} className="flex items-center justify-between gap-4 py-3 text-sm">
        <span className="text-white/75">{row.label}</span>
        <span className="flex items-center gap-2 font-semibold">
          <span
            className={classNames(
              'h-2.5 w-2.5 rounded-full',
              row.ok ? 'bg-green-400' : 'bg-amber-400'
            )}
          />
          {row.status}
        </span>
      </li>
    ))}
  </ul>
);

export const FeaturesSection: React.FunctionComponent = () => (
  <Section labelledBy="features-title" deep>
    <SectionHeader id="features-title" title={features.title} intro={features.intro} />
    <div className="grid auto-rows-auto grid-cols-1 gap-5 sm:auto-rows-[minmax(200px,auto)] sm:grid-cols-2 lg:grid-cols-4">
      {features.tiles.map((tile) => (
        <div key={tile.id} className={classNames(CARD, TILE_LAYOUT[tile.id])}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-white/50 uppercase">
            <FontAwesomeIcon icon={TILE_ICONS[tile.id]} className="h-3.5 w-3.5" />
            {tile.label}
          </span>
          {tile.id === 'access' && <AccessExample />}
          <div className="mt-auto flex flex-col gap-1.5">
            <h3 className={CARD_TITLE}>{tile.title}</h3>
            <p className={CARD_BODY}>{tile.body}</p>
          </div>
        </div>
      ))}
    </div>
  </Section>
);

// ---------------------------------------------------------------- explore

export const ExploreSection: React.FunctionComponent = () => {
  // Picked once, so the stations don't reshuffle on every render.
  const [picks] = React.useState(() => chooseRandomStations(6));

  return (
    <Section labelledBy="explore-title" className="pb-14!">
      <SectionHeader id="explore-title" title={explore.title} intro={explore.intro} />
      {/* The cards evoke real station signage, so they keep their own look. */}
      <div className="grid w-full grid-cols-1 gap-8 text-center md:grid-cols-2">
        {picks.map((station) => (
          <StationHighlight key={station.station} station={station} />
        ))}
      </div>
    </Section>
  );
};

// ---------------------------------------------------------------- donate + footer

// The donate callout every TransitMatters site carries before its footer: a
// TM-red block with a short pitch and a white button.
export const DonateSection: React.FunctionComponent = () => (
  <section aria-labelledby="donate-title" className="px-4 pb-14 md:pb-16">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 rounded-xl bg-tm-red px-6 py-7 shadow-sm md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-9">
      <div className="flex max-w-2xl flex-col gap-2">
        <h2
          id="donate-title"
          className="text-[clamp(1.5rem,3.5vw,2rem)] leading-tight font-extrabold italic"
        >
          {donate.title}
        </h2>
        <p className="leading-relaxed text-white/90">{donate.body}</p>
      </div>
      <a
        href={donate.href}
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white px-6 py-3.5 font-bold text-tm-red shadow-sm transition-transform hover:scale-[1.04] focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <FontAwesomeIcon icon={faHeart} className="h-4 w-4" aria-hidden="true" />
        {donate.cta}
      </a>
    </div>
  </section>
);

export const LandingFooter: React.FunctionComponent = () => (
  <footer className="flex flex-col items-center gap-5 border-t border-white/10 bg-cyan-950 px-4 pt-12 pb-10 text-center">
    <a href="https://transitmatters.org" aria-label="TransitMatters" className="leading-none">
      <img src="/TMLogo.png" alt="" width={3189} height={299} className="h-auto w-44" />
    </a>
    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
      {TRANSITMATTERS_LINKS.map((link) => (
        <li key={link.href}>
          <a href={link.href} className="text-sm text-white/75 hover:text-white">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
    <p className="text-[0.8125rem] text-white/50">{footer.madeBy}</p>
  </footer>
);
