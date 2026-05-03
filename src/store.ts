import { create } from 'zustand';
import type { Station } from './types/station';

export interface Store {
  darkMode?: boolean;
  setDarkMode: (mode: boolean) => void;
  compareStation?: Station;
  setCompareStation: (station: Station | undefined) => void;
}

export const useStore = create<Store>((set) => ({
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
  compareStation: undefined,
  setCompareStation: (station: Station | undefined) => set({ compareStation: station }),
}));
