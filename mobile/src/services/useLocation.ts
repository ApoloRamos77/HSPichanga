import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  errorMsg: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    coords: null,
    errorMsg: null,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation({
            coords: null,
            errorMsg: 'Permiso de ubicación denegado',
            loading: false,
          });
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation({
          coords: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          },
          errorMsg: null,
          loading: false,
        });
      } catch (error) {
        setLocation({
          coords: null,
          errorMsg: 'Error al obtener la ubicación',
          loading: false,
        });
      }
    })();
  }, []);

  return location;
};
