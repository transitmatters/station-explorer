import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { StationPicker } from '../../StationPicker';

/** Opens the station search modal and goes to the station the visitor picks. */
export const useStationPicker = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const picker = isOpen ? (
    <StationPicker
      title="Find a station"
      onPick={(station) => {
        setIsOpen(false);
        navigate({ to: '/$station', params: { station: station.station } });
      }}
      onClose={() => setIsOpen(false)}
    />
  ) : null;

  return { openPicker: () => setIsOpen(true), picker };
};
