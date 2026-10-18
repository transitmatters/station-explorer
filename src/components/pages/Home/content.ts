/** All landing page copy lives here so volunteers can edit it in one place. */

export const hero = {
  title: 'Station Explorer',
  tagline: 'Every MBTA station, inside and out',
  subtitle:
    'See how easy each station is to reach, use, and live near: elevators and escalators, amenities, walking and biking, and the neighborhood around the platform.',
  primaryCta: 'Find a station',
  secondaryCta: 'What we look at',
};

export const about = {
  title: 'What makes a good station?',
  intro:
    "A station is more than a dot on the map. It's how you get in, what's there when you arrive, and the neighborhood around it. Station Explorer looks at all three.",
  pillars: [
    {
      id: 'access',
      title: 'Access',
      body: 'From bike racks to working elevators: how accessible is the station, and what could make it better?',
    },
    {
      id: 'connectivity',
      title: 'Connectivity',
      body: 'How well does the station help you get where you need to go, whether by train, bus, bike, or on foot?',
    },
    {
      id: 'landUse',
      title: 'Land use',
      body: 'How does the station fit into its neighborhood, and what could be done to improve the area around it?',
    },
  ],
} as const;

export const features = {
  title: "What you'll find",
  intro:
    'Each station page brings together live MBTA data, OpenStreetMap, and Walk Score in one place.',
  tiles: [
    {
      id: 'access',
      label: 'Accessibility',
      title: 'Step-free access, live',
      body: 'Whether a station is accessible, how many elevators and escalators it has, which are out of service right now, and whether its platforms offer level boarding.',
    },
    {
      id: 'scores',
      label: 'Walk & bike',
      title: 'Walk Score and Bike Score',
      body: 'How easy it is to run errands on foot or by bike from the station.',
    },
    {
      id: 'bikes',
      label: 'Bikes',
      title: 'Bike lanes and bike share',
      body: 'Miles of bike lanes and the Bluebikes docks near the station.',
    },
    {
      id: 'parking',
      label: 'Land use',
      title: 'Parking nearby',
      body: 'How much land around the station goes to parking, and how many spaces it holds.',
    },
    {
      id: 'amenities',
      label: 'Amenities',
      title: 'Restrooms and more',
      body: 'Restrooms, fare machines, bike storage, EV chargers, and pick-up and drop-off spots.',
    },
    {
      id: 'compare',
      label: 'Compare',
      title: 'Put two stations side by side',
      body: 'Pick a second station from any station page to see how they stack up.',
    },
  ],
} as const;

/** The example status board on the accessibility tile. Illustrative, not live data. */
export const accessExample = [
  { id: 'access', label: 'Step-free access', status: 'Yes', ok: true },
  { id: 'elevators', label: 'Elevators', status: '3 of 3 working', ok: true },
  { id: 'escalators', label: 'Escalators', status: '1 out of service', ok: false },
  { id: 'boarding', label: 'Level boarding', status: 'Yes', ok: true },
] as const;

export const explore = {
  title: 'Explore a station',
  intro: 'Pick one of these six random stations to start.',
};

// The donate callout every TransitMatters site carries before its footer.
export const donate = {
  title: 'Keep Station Explorer running',
  body: 'TransitMatters is a nonprofit fighting for better public transit in Boston and beyond. Volunteers build Station Explorer, and your donation keeps it running.',
  cta: 'Donate to TransitMatters',
  href: 'https://transitmatters.org/donate',
};

export const footer = {
  madeBy: 'Made with ❤️ by TransitMatters',
};
