import { create } from 'zustand';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type AppMode = 'goDeep' | 'haveFun';

export interface City {
  id: string;
  name: string;
}

interface UIState {
  mode: AppMode;
  currentCity: City | null;
  isBackgroundAnimationEnabled: boolean;
}

interface UIActions {
  setMode: (mode: AppMode) => void;
  setCurrentCity: (city: City | null) => void;
  toggleBackgroundAnimation: () => void;
}

type UIStore = UIState & UIActions;

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useUIStore = create<UIStore>((set) => ({
  // State
  mode: 'goDeep',
  currentCity: null,
  isBackgroundAnimationEnabled: true,

  // Actions
  setMode: (mode: AppMode) => set({ mode }),

  setCurrentCity: (city: City | null) => set({ currentCity: city }),

  toggleBackgroundAnimation: () =>
    set((state) => ({
      isBackgroundAnimationEnabled: !state.isBackgroundAnimationEnabled,
    })),
}));
