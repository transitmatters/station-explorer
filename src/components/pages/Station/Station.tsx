import React from 'react';
import { getStation } from '../../../constants/stations';
import { Footer } from '../../Footer';
import { HorizontalDivider } from '../../HorizontalDivider';
import { SiteHeader } from '../../SiteHeader';
import { StationDetails } from '../../StationDetails';
import { useStore } from '../../../store';
import { DetailsHeader } from '../../DetailsHeader';

interface StationProps {
  stationId: string;
}

export const Station: React.FunctionComponent<StationProps> = ({ stationId }) => {
  const station = getStation(stationId);
  const { compareStation, setCompareStation } = useStore();

  // Clear compare if it matches the primary station
  React.useEffect(() => {
    if (station && compareStation && station.station === compareStation.station) {
      setCompareStation(undefined);
    }
  }, [station, compareStation, setCompareStation]);

  if (!station) {
    // TODO: show actual error page
    return <div>Station not found</div>;
  }

  const isComparing = !!compareStation;

  return (
    <div className="flex w-screen flex-col content-center items-center bg-slate-50 text-center dark:bg-slate-700">
      <SiteHeader />
      <DetailsHeader station={station} />
      <div className="flex w-full flex-col">
        <StationDetails station={station} compareStation={compareStation} />
        {!isComparing && <HorizontalDivider />}
      </div>
      <Footer />
    </div>
  );
};
