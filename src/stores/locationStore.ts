import { create } from 'zustand';
import * as Location from 'expo-location';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type PermissionStatus = 'undetermined' | 'granted' | 'denied' | 'restricted';

interface LocationState {
  coordinates: Coordinates | null;
  currentCityId: string | null;
  permissionStatus: PermissionStatus;
  isLoading: boolean;
  error: string | null;
}

interface LocationActions {
  requestPermission: () => Promise<boolean>;
  updateLocation: () => Promise<void>;
  setCity: (cityId: string | null) => void;
}

type LocationStore = LocationState & LocationActions;

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useLocationStore = create<LocationStore>((set, get) => ({
  // State
  coordinates: null,
  currentCityId: null,
  permissionStatus: 'undetermined',
  isLoading: false,
  error: null,

  // Actions
  requestPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      set({
        permissionStatus: granted ? 'granted' : 'denied',
      });
      return granted;
    } catch (error) {
      set({
        permissionStatus: 'denied',
        error: 'Failed to request location permission',
      });
      return false;
    }
  },

  updateLocation: async () => {
    const { permissionStatus } = get();
    if (permissionStatus !== 'granted') {
      set({ error: 'Location permission not granted' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      set({
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to get current location',
      });
    }
  },

  setCity: (cityId: string | null) => set({ currentCityId: cityId }),
}));
