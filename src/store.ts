import { create } from 'zustand';

export interface Store {
  darkMode?: boolean;
  setDarkMode: (mode: boolean) => void;
  fullMapNavigation?: boolean;
  setFullMapNavigation: (mode: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
  fullMapNavigation: false,
  setFullMapNavigation: (mode: boolean) => set({ fullMapNavigation: mode }),
}));
