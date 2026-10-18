import React from 'react';
import type { CSSProperties } from 'react';
import {
  AVENUES,
  BLOCK,
  bikeLanePath,
  buildNetwork,
  FOCUS_DETAIL_DELAY,
  FOCUS_DETAIL_STAGGER,
  FOCUS_DURATION,
  FOCUSES,
  iconPath,
  iconTransform,
  PARKING_ICON,
  pathData,
  PIN_ICONS,
  RIVER,
  STREETS,
  VIEWBOX,
  WALK_RADIUS,
} from './neighborhoodGeometry';
import type { PinKind } from './neighborhoodGeometry';
import styles from './NeighborhoodHeader.module.css';

const network = buildNetwork();

const seconds = (value: number) => `${value.toFixed(2)}s`;

/** Train speed in viewBox units per second. */
const TRAIN_SPEED = 110;

const FOCUS_START = network.buildEnd + 0.6;
const FOCUS_CYCLE = FOCUS_DURATION * FOCUSES.length;

const PIN_COLORS: Record<PinKind, string> = {
  elevator: '#2563eb',
  access: '#2563eb',
  bikeshare: '#16a34a',
  restroom: '#7c3aed',
  bus: '#d97706',
};

const timed = (at: number) => ({ '--at': seconds(at) }) as CSSProperties;

/**
 * Animated neighborhood map for the hero: a street grid fades in, rapid
 * transit lines draw across it, then the map takes turns on a few stations,
 * growing a walking radius and filling it with bike lanes, parking and
 * amenities. Trains shuttle along every line. Plain SVG with CSS animations
 * (and SMIL for the trains), so it needs no client-side JavaScript. With
 * reduced motion it shows the finished map with one station in focus.
 */
export const NeighborhoodHeader: React.FunctionComponent = () => {
  return (
    <div className={styles.backdrop}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {FOCUSES.map(({ point: [x, y] }, i) => (
            <clipPath key={i} id={`walk-radius-${i}`}>
              <circle cx={x} cy={y} r={WALK_RADIUS - 2} />
            </clipPath>
          ))}
        </defs>

        <g className={styles.fadeIn}>
          <path className={styles.river} d={RIVER} />
          <path className={styles.streets} d={STREETS} />
          <path className={styles.avenues} d={AVENUES} />
        </g>

        {network.lines.map((line) => {
          const { start, duration, length } = network.timing.get(line.id)!;
          // The gap is a little longer than the line and the start offset sits
          // inside it, so an undrawn line shows nothing at all; a zero-length
          // dash would otherwise still paint its round cap as a dot.
          const style = {
            '--dash': `${length.toFixed(1)} ${(length + 24).toFixed(1)}`,
            '--hidden': (length + 12).toFixed(1),
            '--start': seconds(start),
            '--duration': seconds(duration),
          } as CSSProperties;
          const d = pathData(line);
          return (
            <g key={line.id}>
              <path
                className={`${styles.draw} ${line.outline ? styles.outline : styles.casing}`}
                d={d}
                style={style}
              />
              <path
                className={`${styles.draw} ${styles.line}`}
                d={d}
                stroke={line.color}
                style={style}
              />
            </g>
          );
        })}

        {network.stations.map(({ point: [x, y], at }, i) => (
          <circle
            key={`station-${i}`}
            className={`${styles.pop} ${styles.station}`}
            cx={x}
            cy={y}
            r={5.5}
            style={timed(at)}
          />
        ))}

        {network.transfers.map(({ point: [x, y], at }, i) => (
          <circle
            key={`transfer-${i}`}
            className={`${styles.pop} ${styles.transfer}`}
            cx={x}
            cy={y}
            r={10}
            style={timed(at)}
          />
        ))}

        <g>
          {FOCUSES.map((focus, i) => {
            const [x, y] = focus.point;
            const start = FOCUS_START + i * FOCUS_DURATION;
            const detail = (k: number) => start + FOCUS_DETAIL_DELAY + k * FOCUS_DETAIL_STAGGER;
            const item = (className: string) => `${styles.focusItem} ${className}`;
            let k = 0;
            return (
              <g
                key={i}
                className={styles.focus}
                style={{ ...timed(start), '--cycle': seconds(FOCUS_CYCLE) } as CSSProperties}
              >
                <circle
                  className={item(styles.radius)}
                  cx={x}
                  cy={y}
                  r={WALK_RADIUS}
                  style={timed(start + 0.2)}
                />
                <circle
                  className={styles.ripple}
                  cx={x}
                  cy={y}
                  r={WALK_RADIUS}
                  style={timed(start + 1.2)}
                />

                <g clipPath={`url(#walk-radius-${i})`}>
                  {focus.parking.map(([col, row]) => {
                    const inset = 10;
                    const size = BLOCK - 2 * inset;
                    const center = [col * BLOCK + BLOCK / 2, row * BLOCK + BLOCK / 2] as const;
                    return (
                      <g
                        key={`${col}-${row}`}
                        className={item(styles.parking)}
                        style={timed(detail(k++))}
                      >
                        <rect
                          className={styles.parkingLot}
                          x={col * BLOCK + inset}
                          y={row * BLOCK + inset}
                          width={size}
                          height={size}
                          rx={6}
                        />
                        <path
                          className={styles.parkingIcon}
                          d={iconPath(PARKING_ICON)}
                          transform={iconTransform(PARKING_ICON, center, 26)}
                        />
                      </g>
                    );
                  })}
                  {focus.bikeLanes.map((lane) => (
                    <path
                      key={`${lane.axis}-${lane.at}`}
                      className={item(styles.bikeLane)}
                      d={bikeLanePath(focus, lane)}
                      pathLength={1}
                      style={timed(detail(k++))}
                    />
                  ))}
                </g>

                <circle className={item(styles.halo)} cx={x} cy={y} r={24} style={timed(start)} />
                <circle
                  className={item(styles.focusStation)}
                  cx={x}
                  cy={y}
                  r={13}
                  style={timed(start)}
                />

                {focus.pins.map(({ kind, offset: [dx, dy] }) => {
                  const icon = PIN_ICONS[kind];
                  const center = [x + dx, y + dy] as const;
                  return (
                    <g
                      key={`${kind}-${dx}-${dy}`}
                      className={item(styles.pin)}
                      style={timed(detail(k++))}
                    >
                      <circle
                        className={styles.pinDisc}
                        cx={center[0]}
                        cy={center[1]}
                        r={17}
                        fill={PIN_COLORS[kind]}
                      />
                      <path
                        className={styles.pinIcon}
                        d={iconPath(icon)}
                        transform={iconTransform(icon, center, 17)}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>

        {network.lines.map((line, i) => {
          const { length } = network.timing.get(line.id)!;
          const begin = seconds(network.buildEnd + 0.4 + i * 0.6);
          return (
            <rect
              key={`train-${line.id}`}
              className={styles.train}
              x={-14}
              y={-5}
              width={28}
              height={10}
              rx={5}
              style={{ '--train-start': begin } as CSSProperties}
            >
              <animateMotion
                rotate="auto"
                path={pathData(line)}
                dur={seconds((2 * length) / TRAIN_SPEED)}
                begin={begin}
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;0.5;1"
                calcMode="linear"
              />
            </rect>
          );
        })}
      </svg>
    </div>
  );
};
