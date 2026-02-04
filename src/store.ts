import { create } from 'zustand';
import type { Station } from './types/station';

export interface Store {
  darkMode?: boolean;
  setDarkMode: (mode: boolean) => void;
  fullMapNavigation?: boolean;
  setFullMapNavigation: (mode: boolean) => void;
  comparisonStation: Station | null;
  setComparisonStation: (station: Station | null) => void;
}

export const useStore = create<Store>((set) => ({
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
  fullMapNavigation: false,
  setFullMapNavigation: (mode: boolean) => set({ fullMapNavigation: mode }),
  comparisonStation: null,
  setComparisonStation: (station: Station | null) => set({ comparisonStation: station }),
}));
