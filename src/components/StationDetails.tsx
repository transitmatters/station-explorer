import classNames from 'classnames';
import React from 'react';
import pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBicycle,
  faBoltLightning,
  faCarSide,
  faCheck,
  faInfoCircle,
  faRestroom,
  faSquareParking,
  faTicket,
  faUniversalAccess,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { Station } from '../types/station';
import { useStationMetrics } from '../utils/useStationMetrics';
import type { StationMetrics } from '../utils/useStationMetrics';
import type { Facility } from '../types/facilities';
import { LoadingIndicator } from './LoadingIndicator';
import { UnavailableIndicator } from './UnavailableIndicator';
import { AccessiblePill } from './pills/AccessiblePill';
import { ElevatorsPill } from './pills/ElevatorsPill';
import { EscalatorsPill } from './pills/EscalatorsPill';
import { RoutePill } from './pills/RoutePill';
import { TooltipButton } from './TooltipButton';
import { MetricCard } from './MetricCard';
import { ScoreGauge } from './ScoreGauge';
import { ContextMap } from './map/ContextMap';

interface StationDetailsProps {
  station: Station;
  compareStation?: Station;
}

const scoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-teal-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  if (score === 0) return 'text-gray-800';
  return 'text-red-500';
};

export const StationDetails: React.FunctionComponent<StationDetailsProps> = ({
  station,
  compareStation,
}) => {
  const a = useStationMetrics(station);
  const b = useStationMetrics(compareStation ?? station);

  if (compareStation) {
    return (
      <CompareLayout a={{ station, metrics: a }} b={{ station: compareStation, metrics: b }} />
    );
  }
  return <SingleLayout station={station} metrics={a} />;
};

// ─────────────────────────────────────────────────────────────────────────────
// Single station layout (existing)
// ─────────────────────────────────────────────────────────────────────────────

const OSM_SOURCE = { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/about' };
const WALKSCORE_HELP_URL = 'https://www.walkscore.com/how-it-works/';
const wsSource = (helpLink?: string) => ({
  name: 'WalkScore®',
  url: helpLink ?? WALKSCORE_HELP_URL,
});

const NumberWithUnit: React.FC<{
  value: number;
  unit: string;
  fmt?: (v: number) => string;
}> = ({ value, unit, fmt }) => (
  <span>
    {fmt ? fmt(value) : value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    <span className="ml-1 text-base font-normal text-gray-500 dark:text-gray-400">
      {pluralize(unit, value)}
    </span>
  </span>
);

const SingleLayout: React.FC<{ station: Station; metrics: StationMetrics }> = ({
  station,
  metrics,
}) => {
  const {
    walkscore,
    routes,
    elevators,
    elevatorAlerts,
    escalators,
    escalatorAlerts,
    levelBoarding,
    miniHighPlatforms,
    bikeLength,
    bikeData,
    isBikeDataLoading,
    isBikeDataError,
    bikeShareData,
    isBikeShareDataLoading,
    isBikeShareDataError,
    isCommuterRail,
    percentParking,
    parkingSpots,
    parkingAcres,
    isParkingError,
  } = metrics;

  const bikeReady = !!bikeData && !isBikeDataLoading;
  const bikeShareReady = !!bikeShareData && !isBikeShareDataLoading;
  const bikeShareCount = bikeShareData?.features.length ?? 0;

  return (
    <div className="mt-6 w-full px-4 pb-4 sm:px-6 lg:px-10">
      {/* Mobility & Transit */}
      <SingleSection name="Mobility & Transit">
        <MetricCard
          title="Walk Score"
          description="Walkability of the surrounding area"
          dataSource={wsSource(walkscore?.help_link)}
          href={walkscore?.ws_link}
          accessory={<ScoreGauge score={walkscore?.walkscore} label="Walk" size={120} />}
          value={
            walkscore?.description ? (
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {walkscore.description}
              </span>
            ) : undefined
          }
        />
        <MetricCard
          title="Bike Score"
          description="Bikeability of the surrounding area"
          dataSource={wsSource(walkscore?.help_link)}
          href={walkscore?.ws_link}
          accessory={<ScoreGauge score={walkscore?.bike?.score} label="Bike" size={120} />}
          value={
            walkscore?.bike?.description ? (
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                {walkscore.bike.description}
              </span>
            ) : undefined
          }
        />
        <MetricCard
          title="Lines & Routes"
          description="Lines and bus routes serving this station"
          value={
            <div className="flex flex-row flex-wrap items-center gap-1.5">
              {routes?.length ? (
                routes.map((route) => <RoutePill key={route.id} route={route} />)
              ) : (
                <LoadingIndicator />
              )}
            </div>
          }
        />
      </SingleSection>

      {/* Accessibility */}
      <SingleSection name="Accessibility">
        <MetricCard
          title="Step-free access"
          description={
            station.accessible
              ? 'This station is accessible'
              : 'This station is not fully accessible'
          }
          value={
            <span className={station.accessible ? 'text-green-600' : 'text-red-500'}>
              {station.accessible ? 'Yes' : 'No'}
            </span>
          }
        />
        <MetricCard
          title="Elevators"
          description="Open vs. installed (alerts factored in)"
          accessory={<ElevatorsPill elevators={elevators} elevatorAlerts={elevatorAlerts} />}
        />
        <MetricCard
          title="Escalators"
          description="Open vs. installed (alerts factored in)"
          accessory={<EscalatorsPill escalators={escalators} escalatorAlerts={escalatorAlerts} />}
        />
        {isCommuterRail && (
          <MetricCard
            title="Boarding Platforms"
            description="Level-boarding and mini-high platforms"
            value={
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span>
                  {levelBoarding?.length ?? <LoadingIndicator />}
                  <span className="ml-1 text-base font-normal text-gray-500 dark:text-gray-400">
                    level boarding
                  </span>
                </span>
                <span>
                  {miniHighPlatforms?.length ?? <LoadingIndicator />}
                  <span className="ml-1 text-base font-normal text-gray-500 dark:text-gray-400">
                    mini-high
                  </span>
                </span>
              </div>
            }
          />
        )}
      </SingleSection>

      {/* Bike */}
      <SingleSection
        name="Bike Infrastructure"
        side={<ContextMap station={station} layers="bike" />}
      >
        <MetricCard
          title="Bike Lanes"
          description="Miles of bike lanes within walking distance"
          dataSource={OSM_SOURCE}
          value={
            bikeReady ? (
              <NumberWithUnit value={bikeLength} unit="mile" fmt={(v) => v.toFixed(1)} />
            ) : (
              <PendingIndicator error={isBikeDataError} />
            )
          }
        />
        <MetricCard
          title="Bike Share"
          description="Bike share stations within walking distance"
          dataSource={OSM_SOURCE}
          value={
            bikeShareReady ? (
              <NumberWithUnit value={bikeShareCount} unit="station" fmt={(v) => v.toFixed(0)} />
            ) : (
              <PendingIndicator error={isBikeShareDataError} />
            )
          }
        />
      </SingleSection>

      {/* Land Use */}
      <SingleSection name="Land Use" side={<ContextMap station={station} layers="parking" />}>
        <MetricCard
          title="Parking Area"
          description="Share of the walkshed taken up by parking"
          dataSource={OSM_SOURCE}
          value={
            percentParking > 0 ? (
              <span>
                {percentParking.toFixed(1)}
                <span className="align-top text-base font-normal">%</span>
              </span>
            ) : (
              <PendingIndicator error={isParkingError} />
            )
          }
        />
        <MetricCard
          title="Parking Spaces"
          description="Estimated parking spaces within walking distance"
          dataSource={OSM_SOURCE}
          value={
            parkingSpots > 0 ? (
              <NumberWithUnit value={parkingSpots} unit="spot" />
            ) : (
              <PendingIndicator error={isParkingError} />
            )
          }
        />
        <MetricCard
          title="Surface Parking"
          description="Estimated acreage of surface parking within walking distance"
          dataSource={OSM_SOURCE}
          value={
            parkingAcres > 0 ? (
              <NumberWithUnit value={parkingAcres} unit="acre" />
            ) : (
              <PendingIndicator error={isParkingError} />
            )
          }
        />
      </SingleSection>

      {/* Station Amenities (MBTA V3 facility data) */}
      <SingleSection name="Station Amenities">
        <AmenityCard
          icon={faRestroom}
          title="Restroom"
          loading={false}
          present={metrics.amenities.bathroom?.available}
          label={metrics.amenities.bathroom?.location}
          missingLabel="No public restroom"
          unknownLabel="Restroom info not yet curated"
        />
        <AmenityCard
          icon={faSquareParking}
          title="Parking"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.parkingArea}
        />
        <AmenityCard
          icon={faBicycle}
          title="Bike Storage"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.bikeStorage}
        />
        <AmenityCard
          icon={faTicket}
          title="Fare Vending"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.fareVending}
        />
        <AmenityCard
          icon={faTicket}
          title="Fare Assistance"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.fareAssistance}
        />
        <AmenityCard
          icon={faBoltLightning}
          title="EV Chargers"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.evChargers}
        />
        <AmenityCard
          icon={faCarSide}
          title="Pick-up / Drop-off"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.pickDrop}
        />
        <AmenityCard
          icon={faUniversalAccess}
          title="Boarding Aids"
          description="Bridge plates, ramps, portable lifts"
          loading={metrics.facilitiesLoading}
          facilities={metrics.amenities.boardingAids}
        />
      </SingleSection>
    </div>
  );
};

interface AmenityCardProps {
  icon: IconDefinition;
  title: string;
  description?: string;
  loading: boolean;
  /** Source data when this amenity is backed by MBTA facilities. */
  facilities?: Facility[];
  /** Manual present/missing/unknown override (for non-facility amenities). */
  present?: boolean;
  /** Description text when present and facilities aren't the source. */
  label?: string;
  /** Text to show when not available. */
  missingLabel?: string;
  /** Text to show when present is undefined (data not yet curated). */
  unknownLabel?: string;
}

const AmenityCard: React.FC<AmenityCardProps> = ({
  icon,
  title,
  description,
  loading,
  facilities,
  present: presentOverride,
  label: labelOverride,
  missingLabel = 'Not at this station',
  unknownLabel,
}) => {
  const count = facilities?.length ?? 0;
  const facilityPresent = count > 0;
  const facilitySingleLabel =
    count === 1 ? facilities![0].long_name || facilities![0].short_name : undefined;
  // When `facilities` isn't provided, fall back to the manual override.
  const usingOverride = facilities === undefined && presentOverride !== undefined;
  const present = usingOverride ? presentOverride : facilityPresent;
  const unknown = !facilities && presentOverride === undefined;

  return (
    <div
      className={classNames(
        'flex items-start gap-3 rounded-lg border p-3 shadow-sm',
        loading
          ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800'
          : present
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30'
            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800'
      )}
    >
      <div
        className={classNames(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white',
          loading
            ? 'bg-gray-300 dark:bg-gray-600'
            : present
              ? 'bg-emerald-600'
              : 'bg-gray-300 dark:bg-gray-600'
        )}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="min-w-0 flex-1 text-start">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h3>
          {!loading && !unknown && (
            <FontAwesomeIcon
              icon={present ? faCheck : faXmark}
              className={classNames(
                'text-xs',
                present
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : 'text-gray-400 dark:text-gray-500'
              )}
            />
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
          {loading ? (
            <LoadingIndicator />
          ) : unknown ? (
            (unknownLabel ?? missingLabel)
          ) : !present ? (
            missingLabel
          ) : usingOverride ? (
            (labelOverride ?? 'Available')
          ) : count === 1 ? (
            (facilitySingleLabel ?? 'Available')
          ) : (
            `${count} on site`
          )}
        </p>
        {description && !loading && (
          <p className="mt-1 text-[11px] italic leading-snug text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const cardGridCols = (n: number): string => {
  if (n <= 1) return 'grid-cols-1';
  if (n === 2) return 'grid-cols-1 sm:grid-cols-2';
  if (n === 3) return 'grid-cols-1 sm:grid-cols-3';
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
};

// When a map is present we use a 4-col grid where map = col-span-2 row-span-2.
// Distribute remaining cards so the right-hand 2x2 area has no empty cells:
//   2 cards → each spans 2 cols (one per row)
//   3 cards → first two span 1 col, third spans 2 cols (filling the back row)
//   4 cards → each spans 1 col
const expandCardsToFillSide = (children: React.ReactNode): React.ReactNode => {
  const arr = React.Children.toArray(children);
  const n = arr.length;
  const wideClass = 'lg:col-span-2';
  return arr.map((child, i) => {
    if (!React.isValidElement(child)) return child;
    const shouldWide = n === 2 || (n === 3 && i === 2);
    if (!shouldWide) return child;
    const props = child.props as { className?: string };
    return React.cloneElement(child as React.ReactElement<{ className?: string }>, {
      className: classNames(props.className, wideClass),
    });
  });
};

const SingleSection: React.FC<{
  name: string;
  side?: React.ReactNode;
  children: React.ReactNode;
}> = ({ name, side, children }) => {
  return (
    <section className="mb-8 last:mb-0">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-300">
          {name}
        </h2>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
      </div>
      {(() => {
        const validChildren = React.Children.toArray(children);
        if (side) {
          return (
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2 lg:row-span-2">{side}</div>
              {expandCardsToFillSide(validChildren)}
            </div>
          );
        }
        return (
          <div className={classNames('grid gap-4', cardGridCols(validChildren.length))}>
            {validChildren}
          </div>
        );
      })()}
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Compare layout
// ─────────────────────────────────────────────────────────────────────────────

type Side = { station: Station; metrics: StationMetrics };

const CompareLayout: React.FC<{ a: Side; b: Side }> = ({ a, b }) => {
  return (
    <div className="relative mt-4 w-full px-4 sm:px-6 lg:px-10">
      {/* Vertical center divider matches the gap between the two columns */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px w-px bg-gray-200 dark:bg-gray-600"
      />

      {/* Mobility */}
      <CompareSection name="Mobility">
        <CompareMetricRow
          title="Walk Score®"
          description="A walkability rating of the station's surrounding area"
          dataSourceName="WalkScore®"
          dataSourceUrl="https://www.walkscore.com"
          a={
            <ScoreValue
              value={a.metrics.walkscore?.walkscore}
              link={a.metrics.walkscore?.ws_link}
            />
          }
          b={
            <ScoreValue
              value={b.metrics.walkscore?.walkscore}
              link={b.metrics.walkscore?.ws_link}
            />
          }
          winner={pickHigher(a.metrics.walkscore?.walkscore, b.metrics.walkscore?.walkscore)}
        />
      </CompareSection>

      {/* Accessibility */}
      <CompareSection name="Accessibility">
        <div className="grid grid-cols-2 gap-3">
          <PillStack side={a} />
          <PillStack side={b} />
        </div>
      </CompareSection>

      {/* Transit */}
      <CompareSection name="Transit">
        <div className="grid grid-cols-2 gap-3">
          <RouteStack side={a} />
          <RouteStack side={b} />
        </div>
      </CompareSection>

      {/* Bike */}
      <CompareSection name="Bike">
        <CompareMetricRow
          title="Bike Score®"
          description="A bikeability rating of the station's surrounding area"
          dataSourceName="WalkScore®"
          dataSourceUrl="https://www.walkscore.com"
          a={
            <ScoreValue
              value={a.metrics.walkscore?.bike?.score}
              link={a.metrics.walkscore?.ws_link}
            />
          }
          b={
            <ScoreValue
              value={b.metrics.walkscore?.bike?.score}
              link={b.metrics.walkscore?.ws_link}
            />
          }
          winner={pickHigher(a.metrics.walkscore?.bike?.score, b.metrics.walkscore?.bike?.score)}
        />
        <CompareMetricRow
          title="Miles of Bike Lanes"
          description="Miles of bike lanes within walking distance of the station"
          dataSourceName="OpenStreetMap"
          dataSourceUrl="https://www.openstreetmap.org/about"
          a={
            <UnitValue
              ready={!!a.metrics.bikeData && !a.metrics.isBikeDataLoading}
              error={a.metrics.isBikeDataError}
              value={a.metrics.bikeLength}
              fmt={(v) => v.toFixed(1)}
              unit="mile"
            />
          }
          b={
            <UnitValue
              ready={!!b.metrics.bikeData && !b.metrics.isBikeDataLoading}
              error={b.metrics.isBikeDataError}
              value={b.metrics.bikeLength}
              fmt={(v) => v.toFixed(1)}
              unit="mile"
            />
          }
          winner={pickHigher(a.metrics.bikeLength, b.metrics.bikeLength)}
        />
        <CompareMetricRow
          title="Bike Share Stations"
          description="Bike share stations within walking distance of the station"
          dataSourceName="OpenStreetMap"
          dataSourceUrl="https://www.openstreetmap.org/about"
          a={
            <UnitValue
              ready={!!a.metrics.bikeShareData && !a.metrics.isBikeShareDataLoading}
              error={a.metrics.isBikeShareDataError}
              value={a.metrics.bikeShareData?.features.length ?? 0}
              fmt={(v) => v.toFixed(0)}
              unit="station"
            />
          }
          b={
            <UnitValue
              ready={!!b.metrics.bikeShareData && !b.metrics.isBikeShareDataLoading}
              error={b.metrics.isBikeShareDataError}
              value={b.metrics.bikeShareData?.features.length ?? 0}
              fmt={(v) => v.toFixed(0)}
              unit="station"
            />
          }
          winner={pickHigher(
            a.metrics.bikeShareData?.features.length,
            b.metrics.bikeShareData?.features.length
          )}
        />
      </CompareSection>

      {/* Land Use */}
      <CompareSection name="Land Use">
        <CompareMetricRow
          title="Parking Area"
          description="Share of the walkshed taken up by parking — lower is better"
          dataSourceName="OpenStreetMap"
          dataSourceUrl="https://www.openstreetmap.org/about"
          a={<PercentValue value={a.metrics.percentParking} error={a.metrics.isParkingError} />}
          b={<PercentValue value={b.metrics.percentParking} error={b.metrics.isParkingError} />}
          winner={pickLower(a.metrics.percentParking, b.metrics.percentParking)}
        />
        <CompareMetricRow
          title="Parking Spaces"
          description="Estimated parking spaces within walking distance — lower is better"
          dataSourceName="OpenStreetMap"
          dataSourceUrl="https://www.openstreetmap.org/about"
          a={
            <UnitValue
              ready={a.metrics.parkingSpots > 0}
              error={a.metrics.isParkingError}
              value={a.metrics.parkingSpots}
              fmt={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              unit="spot"
            />
          }
          b={
            <UnitValue
              ready={b.metrics.parkingSpots > 0}
              error={b.metrics.isParkingError}
              value={b.metrics.parkingSpots}
              fmt={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              unit="spot"
            />
          }
          winner={pickLower(a.metrics.parkingSpots, b.metrics.parkingSpots)}
        />
        <CompareMetricRow
          title="Surface Parking Land Area"
          description="Estimated surface parking acreage within walking distance — lower is better"
          dataSourceName="OpenStreetMap"
          dataSourceUrl="https://www.openstreetmap.org/about"
          a={
            <UnitValue
              ready={a.metrics.parkingAcres > 0}
              error={a.metrics.isParkingError}
              value={a.metrics.parkingAcres}
              fmt={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              unit="acre"
            />
          }
          b={
            <UnitValue
              ready={b.metrics.parkingAcres > 0}
              error={b.metrics.isParkingError}
              value={b.metrics.parkingAcres}
              fmt={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              unit="acre"
            />
          }
          winner={pickLower(a.metrics.parkingAcres, b.metrics.parkingAcres)}
        />
      </CompareSection>
    </div>
  );
};

const CompareSection: React.FC<{ name: string; children: React.ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <section className="relative mb-4">
      <div className="mb-2 flex items-center gap-3">
        <span className="bg-slate-50 pr-2 text-xs font-semibold uppercase tracking-widest text-gray-500 dark:bg-slate-700 dark:text-gray-300">
          {name}
        </span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-600" />
      </div>
      <div>{children}</div>
    </section>
  );
};

interface CompareMetricRowProps {
  title: string;
  description: string;
  dataSourceName: string;
  dataSourceUrl: string;
  a: React.ReactNode;
  b: React.ReactNode;
  winner: 'a' | 'b' | 'tie';
}

const CompareMetricRow: React.FC<CompareMetricRowProps> = ({
  title,
  description,
  dataSourceName,
  dataSourceUrl,
  a,
  b,
  winner,
}) => {
  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center gap-1.5 text-start text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
        <TooltipButton
          tooltipContent={
            <div className="inline-block whitespace-nowrap rounded-lg bg-slate-600 bg-opacity-85 p-2 text-xs text-white">
              This data comes from{' '}
              <a
                className="cursor-pointer underline decoration-dotted hover:font-semibold hover:decoration-solid"
                href={dataSourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {dataSourceName}
              </a>
            </div>
          }
          item={<FontAwesomeIcon icon={faInfoCircle} className="text-xs text-slate-400" />}
          ariaLabel={`Data source for ${title}`}
        />
      </div>
      <p className="mb-2 text-start text-xs leading-4 text-gray-500 dark:text-gray-400">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ValueCell highlighted={winner === 'a'}>{a}</ValueCell>
        <ValueCell highlighted={winner === 'b'}>{b}</ValueCell>
      </div>
    </div>
  );
};

const ValueCell: React.FC<{ children: React.ReactNode; highlighted: boolean }> = ({
  children,
  highlighted,
}) => {
  return (
    <div
      className={classNames(
        'font-mono flex items-center justify-center rounded-md border px-3 py-3 text-center text-2xl leading-6 transition-colors',
        highlighted
          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-200'
          : 'border-gray-200 bg-white text-gray-800 dark:border-gray-600 dark:bg-slate-800 dark:text-gray-100'
      )}
    >
      {children}
    </div>
  );
};

const ScoreValue: React.FC<{ value?: number; link?: string }> = ({ value, link }) => {
  if (value === undefined) return <LoadingIndicator />;
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={link}
      className={classNames('font-mono', scoreColor(value))}
    >
      {value}
    </a>
  );
};

const PendingIndicator: React.FC<{ error?: boolean }> = ({ error }) => {
  return error ? <UnavailableIndicator /> : <LoadingIndicator />;
};

const UnitValue: React.FC<{
  ready: boolean;
  error?: boolean;
  value: number;
  fmt: (v: number) => string;
  unit: string;
}> = ({ ready, error, value, fmt, unit }) => {
  if (!ready) return <PendingIndicator error={error} />;
  return (
    <div className="text-inherit">
      {fmt(value)}&nbsp;
      <span className="text-sm">{pluralize(unit, value)}</span>
    </div>
  );
};

const PercentValue: React.FC<{ value: number; error?: boolean }> = ({ value, error }) => {
  if (!(value > 0)) return <PendingIndicator error={error} />;
  return (
    <div className="text-inherit">
      {value.toFixed(1)}
      <span className="align-top text-sm">%</span>
    </div>
  );
};

const PillStack: React.FC<{ side: Side }> = ({ side }) => {
  const { station, metrics } = side;
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-slate-800">
      <AccessiblePill accessible={station.accessible} />
      <ElevatorsPill elevators={metrics.elevators} elevatorAlerts={metrics.elevatorAlerts} />
      <EscalatorsPill escalators={metrics.escalators} escalatorAlerts={metrics.escalatorAlerts} />
      {metrics.isCommuterRail && (
        <div className="text-center text-xs text-gray-600 dark:text-gray-300">
          {metrics.levelBoarding?.length ?? '—'} level boarding /{' '}
          {metrics.miniHighPlatforms?.length ?? '—'} mini-high
        </div>
      )}
    </div>
  );
};

const RouteStack: React.FC<{ side: Side }> = ({ side }) => {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-1 rounded-md border border-gray-200 bg-white p-3 dark:border-gray-600 dark:bg-slate-800">
      {side.metrics.routes?.map((route) => (
        <RoutePill key={route.id} route={route} />
      ))}
    </div>
  );
};

const pickHigher = (a?: number, b?: number): 'a' | 'b' | 'tie' => {
  if (a === undefined || b === undefined) return 'tie';
  if (a === b) return 'tie';
  return a > b ? 'a' : 'b';
};

const pickLower = (a?: number, b?: number): 'a' | 'b' | 'tie' => {
  if (a === undefined || b === undefined || a === 0 || b === 0) return 'tie';
  if (a === b) return 'tie';
  return a < b ? 'a' : 'b';
};
