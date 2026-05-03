import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { Station } from '../types/station';
import { useStore } from '../store';
import { StationBanner } from './StationBanner';
import { StationPicker } from './StationPicker';

interface DetailsHeaderProps {
  station: Station;
}

type PickerSlot = 'primary' | 'compare' | null;

export const DetailsHeader: React.FunctionComponent<DetailsHeaderProps> = ({ station }) => {
  const { compareStation, setCompareStation } = useStore();
  const [pickerSlot, setPickerSlot] = React.useState<PickerSlot>(null);
  const navigate = useNavigate();
  const isComparing = !!compareStation;

  const handlePick = (picked: Station) => {
    if (pickerSlot === 'primary') {
      navigate({ to: `/${picked.station}` as never });
    } else if (pickerSlot === 'compare') {
      setCompareStation(picked);
    }
    setPickerSlot(null);
  };

  return (
    <div className="w-full px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      {isComparing ? (
        <div className="grid grid-cols-2 gap-3">
          <StationBanner
            station={station}
            size="large"
            onSwap={() => setPickerSlot('primary')}
          />
          <StationBanner
            station={compareStation}
            size="large"
            onSwap={() => setPickerSlot('compare')}
            onClose={() => setCompareStation(undefined)}
          />
        </div>
      ) : (
        <StationBanner
          station={station}
          size="large"
          onSwap={() => setPickerSlot('primary')}
          onCompare={() => setPickerSlot('compare')}
        />
      )}
      {pickerSlot && (
        <StationPicker
          title={
            pickerSlot === 'primary' ? 'Select a station' : 'Compare with another station'
          }
          excludeStationId={
            pickerSlot === 'primary' ? compareStation?.station : station.station
          }
          onPick={handlePick}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
};
