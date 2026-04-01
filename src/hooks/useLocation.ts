import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '../stores/locationStore';

export function useLocation() {
  const {
    coordinates,
    permissionStatus,
    requestPermission,
    updateLocation,
  } = useLocationStore();

  useEffect(() => {
    async function init() {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        updateLocation();
      }
    }
    init();
  }, []);

  return {
    coordinates,
    permissionStatus,
    requestPermission,
    refreshLocation: updateLocation,
  };
}
