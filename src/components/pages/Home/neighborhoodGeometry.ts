/**
 * Geometry and timing for the animated neighborhood map in the landing page
 * hero. A street grid fades in, rapid transit lines draw across it, then the
 * map takes turns focusing on a few stations: a walking radius grows from the
 * station, and bike lanes, parking lots and amenity pins appear inside it,
 * like a miniature of the station page's context map. Everything is
 * precomputed here so the component is plain SVG driven by CSS animations.
 *
 * The map is illustrative, not geographic. Lines run horizontally,
 * vertically or at 45° along an 80-unit street grid.
 */
import {
  faBicycle,
  faBus,
  faElevator,
  faRestroom,
  faSquareParking,
  faWheelchair,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { COLORS } from '../../../constants/colors';

export type Point = readonly [number, number];

export interface HeroLine {
  id: string;
  color: string;
  points: Point[];
  /** Dark lines get a light outline so they read on the cyan background. */
  outline?: boolean;
}

export const VIEWBOX = { width: 1600, height: 900 };

export const BLOCK = 80;

/** Drawing speed in viewBox units per second. */
const SPEED = 650;
const LINE_START = 0.6;
const LINE_STAGGER = 0.3;
/** Gap between stations along a line, and how close one may sit to a transfer. */
const STATION_GAP = 95;
const TRANSFER_CLEARANCE = 38;

export const LINES: HeroLine[] = [
  {
    id: 'red',
    color: COLORS.mbta.red,
    points: [
      [-40, 160],
      [160, 160],
      [480, 480],
      [800, 480],
      [960, 640],
      [960, 940],
    ],
  },
  {
    id: 'orange',
    color: COLORS.mbta.orange,
    points: [
      [720, -40],
      [720, 940],
    ],
  },
  {
    id: 'green',
    color: COLORS.mbta.green,
    points: [
      [-40, 640],
      [160, 640],
      [400, 400],
      [1040, 400],
      [1360, 80],
      [1360, -40],
    ],
  },
  {
    id: 'blue',
    color: COLORS.mbta.blue,
    outline: true,
    points: [
      [1640, 720],
      [1440, 720],
      [1040, 320],
      // Ends at Orange, like the real Blue Line's downtown terminal.
      [720, 320],
    ],
  },
  {
    id: 'silver',
    color: COLORS.mbta.silver,
    points: [
      [720, 640],
      [800, 720],
      [1200, 720],
      [1360, 880],
      [1360, 940],
    ],
  },
];

/** Street grid lines plus a couple of diagonal avenues, as SVG path data. */
export const STREETS = (() => {
  const paths: string[] = [];
  for (let x = 0; x <= VIEWBOX.width; x += BLOCK) paths.push(`M${x} 0 V${VIEWBOX.height}`);
  for (let y = 0; y <= VIEWBOX.height; y += BLOCK) paths.push(`M0 ${y} H${VIEWBOX.width}`);
  return paths.join(' ');
})();

export const AVENUES = 'M0 880 L880 0 M560 900 L1460 0';

export const RIVER =
  'M-40 560 C 200 500, 360 600, 560 560 S 900 500, 1100 540 S 1440 620, 1640 560';

export type PinKind = 'elevator' | 'access' | 'bikeshare' | 'restroom' | 'bus';

export const PIN_ICONS: Record<PinKind, IconDefinition> = {
  elevator: faElevator,
  access: faWheelchair,
  bikeshare: faBicycle,
  restroom: faRestroom,
  bus: faBus,
};

export const PARKING_ICON = faSquareParking;

export interface Focus {
  /** A station on one of the lines. */
  point: Point;
  /** Streets inside the radius that get a bike lane. */
  bikeLanes: { axis: 'h' | 'v'; at: number }[];
  /** City blocks, as [column, row] on the street grid, that are parking lots. */
  parking: [number, number][];
  /** Amenity pins, as offsets from the station. */
  pins: { kind: PinKind; offset: Point }[];
}

/** Walking radius around a focused station, in viewBox units. */
export const WALK_RADIUS = 150;

/**
 * The stations the hero takes turns on. One is left, one right and one
 * bottom-center, so a phone-width crop of the map still shows one.
 */
export const FOCUSES: Focus[] = [
  {
    // On the Red Line's diagonal.
    point: [320, 320],
    bikeLanes: [
      { axis: 'h', at: 240 },
      { axis: 'v', at: 400 },
    ],
    parking: [
      [4, 3],
      [2, 4],
    ],
    pins: [
      { kind: 'elevator', offset: [-44, 44] },
      { kind: 'bikeshare', offset: [80, -80] },
      { kind: 'restroom', offset: [-120, -40] },
      { kind: 'bus', offset: [0, 100] },
    ],
  },
  {
    // On the Blue Line's diagonal.
    point: [1320, 600],
    bikeLanes: [
      { axis: 'v', at: 1360 },
      { axis: 'h', at: 480 },
    ],
    parking: [
      [17, 6],
      [15, 8],
    ],
    pins: [
      { kind: 'access', offset: [44, -44] },
      { kind: 'bikeshare', offset: [-120, -40] },
      { kind: 'bus', offset: [120, 0] },
    ],
  },
  {
    // On the Orange Line, south of downtown, low enough to clear the hero's
    // buttons.
    point: [720, 840],
    bikeLanes: [
      { axis: 'h', at: 800 },
      { axis: 'v', at: 640 },
    ],
    parking: [
      [10, 10],
      [7, 10],
    ],
    pins: [
      { kind: 'elevator', offset: [-36, 24] },
      { kind: 'access', offset: [44, 24] },
      { kind: 'bikeshare', offset: [-100, -60] },
      { kind: 'restroom', offset: [110, -70] },
    ],
  },
];

/** Seconds each focused station holds the spotlight. */
export const FOCUS_DURATION = 6;
/** Seconds after a focus begins before its bike lanes, lots and pins appear. */
export const FOCUS_DETAIL_DELAY = 0.9;
export const FOCUS_DETAIL_STAGGER = 0.18;

/** The part of a street that falls inside the walking radius, as a path. */
export function bikeLanePath({ point: [cx, cy] }: Focus, lane: Focus['bikeLanes'][number]) {
  const offset = lane.axis === 'h' ? lane.at - cy : lane.at - cx;
  const half = Math.sqrt(Math.max(WALK_RADIUS ** 2 - offset ** 2, 0));
  return lane.axis === 'h'
    ? `M${cx - half} ${lane.at} H${cx + half}`
    : `M${lane.at} ${cy - half} V${cy + half}`;
}

/**
 * SVG transform that draws a Font Awesome icon `size` units tall, centered on
 * a point. Icons are rendered from their path data, so they match the icons
 * on the station page without extra assets.
 */
export function iconTransform(icon: IconDefinition, [x, y]: Point, size: number) {
  const [width, height] = icon.icon;
  const scale = size / height;
  return `translate(${x - (width * scale) / 2} ${y - size / 2}) scale(${scale})`;
}

export const iconPath = (icon: IconDefinition) => {
  const path = icon.icon[4];
  return Array.isArray(path) ? path.join(' ') : path;
};

const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const lineLength = (line: HeroLine) =>
  line.points.slice(1).reduce((sum, point, i) => sum + distance(line.points[i], point), 0);

export const pathData = (line: HeroLine) =>
  line.points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

/** The point `d` units along a line. */
function pointAt(line: HeroLine, d: number): Point {
  let remaining = d;
  for (let i = 1; i < line.points.length; i++) {
    const a = line.points[i - 1];
    const b = line.points[i];
    const segment = distance(a, b);
    if (remaining <= segment) {
      const t = segment ? remaining / segment : 0;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    }
    remaining -= segment;
  }
  return line.points[line.points.length - 1];
}

/** Where two segments cross, as fractions along each; null if they don't. */
function crossing(a1: Point, a2: Point, b1: Point, b2: Point) {
  const r = [a2[0] - a1[0], a2[1] - a1[1]];
  const s = [b2[0] - b1[0], b2[1] - b1[1]];
  const denominator = r[0] * s[1] - r[1] * s[0];
  if (denominator === 0) return null;
  const q = [b1[0] - a1[0], b1[1] - a1[1]];
  const t = (q[0] * s[1] - q[1] * s[0]) / denominator;
  const u = (q[0] * r[1] - q[1] * r[0]) / denominator;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { point: [a1[0] + r[0] * t, a1[1] + r[1] * t] as Point, t, u };
}

interface Marker {
  point: Point;
  /** Seconds after load when it appears. */
  at: number;
}

interface LineTiming {
  start: number;
  duration: number;
  length: number;
}

const inView = ([x, y]: Point, margin = 0) =>
  x >= margin && x <= VIEWBOX.width - margin && y >= margin && y <= VIEWBOX.height - margin;

export function buildNetwork(lines: HeroLine[] = LINES) {
  const timing = new Map<string, LineTiming>();
  lines.forEach((line, i) => {
    const length = lineLength(line);
    timing.set(line.id, { start: LINE_START + i * LINE_STAGGER, duration: length / SPEED, length });
  });
  const arrival = (line: HeroLine, d: number) => timing.get(line.id)!.start + d / SPEED;

  // Transfers: every place two lines cross or touch.
  const transfers: Marker[] = [];
  lines.forEach((a, i) => {
    lines.slice(i + 1).forEach((b) => {
      let da = 0;
      for (let p = 1; p < a.points.length; p++) {
        const lengthA = distance(a.points[p - 1], a.points[p]);
        let db = 0;
        for (let q = 1; q < b.points.length; q++) {
          const lengthB = distance(b.points[q - 1], b.points[q]);
          const hit = crossing(a.points[p - 1], a.points[p], b.points[q - 1], b.points[q]);
          if (hit && inView(hit.point)) {
            const at = Math.max(arrival(a, da + hit.t * lengthA), arrival(b, db + hit.u * lengthB));
            const existing = transfers.find((x) => distance(x.point, hit.point) < 1);
            if (existing) {
              existing.at = Math.max(existing.at, at);
            } else {
              transfers.push({ point: hit.point, at });
            }
          }
          db += lengthB;
        }
        da += lengthA;
      }
    });
  });

  // Regular stations, evenly spaced, kept clear of transfers, focused
  // stations and the edges.
  const stations: Marker[] = [];
  const keepClear = [...transfers.map((t) => t.point), ...FOCUSES.map((f) => f.point)];
  lines.forEach((line) => {
    const { length } = timing.get(line.id)!;
    for (let d = STATION_GAP / 2; d < length; d += STATION_GAP) {
      const point = pointAt(line, d);
      if (!inView(point, 12)) continue;
      if (keepClear.some((p) => distance(p, point) < TRANSFER_CLEARANCE)) continue;
      stations.push({ point, at: arrival(line, d) });
    }
  });

  const buildEnd = Math.max(...[...timing.values()].map((t) => t.start + t.duration));
  return { lines, timing, transfers, stations, buildEnd };
}
