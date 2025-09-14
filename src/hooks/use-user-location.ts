'use client';

import { getLocationFromCoordinates } from '@/lib/actions/geolocation';
import { City, State } from '@/lib/types/api';
import { useCallback, useEffect, useState, useTransition } from 'react';

export function useUserLocation() {
  const [city, setCity] = useState<City | null>(null);
  const [state, setState] = useState<State | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();

  const getCurrentPosition = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo navegador');
      return;
    }

    startTransition(async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });

        if (permission.state === 'denied') {
          setError('Permissão para acessar a localização negada');
          return;
        }

        await new Promise<void>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const {
                coords: { latitude, longitude },
              } = position;

              setLatitude(latitude);
              setLongitude(longitude);

              try {
                const result = await getLocationFromCoordinates(latitude, longitude);
                
                if (result.error) {
                  setError(result.error);
                } else {
                  setState(result.state);
                  setCity(result.city);
                }
                             } catch {
                 setError('Erro ao processar localização');
               }

              resolve();
            },
            (error) => {
              if (error.code === 1) {
                setError('Permissão para acessar a localização negada');
              } else if (error.code === 2) {
                setError('Localização indisponível');
              } else if (error.code === 3) {
                setError('Tempo limite excedido para obter localização');
              } else {
                setError('Não foi possível obter a localização');
              }
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutos
            }
          );
        });
             } catch {
         setError('Erro ao obter permissão de localização');
       }
    });
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const refreshLocation = useCallback(() => {
    setError(null);
    getCurrentPosition();
  }, [getCurrentPosition]);

  return { 
    latitude, 
    longitude, 
    error, 
    isLoading, 
    city, 
    state,
    refreshLocation 
  };
}
