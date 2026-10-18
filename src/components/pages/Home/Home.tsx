import React from 'react';
import { Hero } from './Hero';
import {
  AboutSection,
  DonateSection,
  ExploreSection,
  FeaturesSection,
  LandingFooter,
} from './Sections';

/**
 * Landing page at `/`: what Station Explorer looks at, what a station page
 * shows, and a few stations to start from. Copy lives in ./content.ts.
 */
export const Home: React.FunctionComponent = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-cyan-900 text-white [&_:focus-visible]:outline [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-white">
      <Hero />
      <main>
        <AboutSection />
        <FeaturesSection />
        <ExploreSection />
        <DonateSection />
      </main>
      <LandingFooter />
    </div>
  );
};
