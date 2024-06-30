import { create } from 'zustand';

export interface Store {
  darkMode?: boolean;
  setDarkMode: (mode: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  setDarkMode: (mode: boolean) => set({ darkMode: mode }),
}));
