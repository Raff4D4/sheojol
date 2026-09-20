'use client';

import { useEffect, useState } from 'react';

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_STATE: GeolocationState = {
  latitude: null,
  longitude: null,
  accuracy: null,
  loading: true,
  error: null,
};

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>(INITIAL_STATE);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((current) => ({ ...current, loading: false, error: 'Geolocation tidak didukung perangkat' }));
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState((current) => ({ ...current, loading: false, error: error.message }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return state;
}