import { getCities } from '@/lib/api/resources';
import { City } from '@/lib/types/api';
import { useEffect, useState } from 'react';

export function useCities(stateId: number): City[] {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const handleFetchCities = async () => {
      const res = await getCities(stateId);

      if (!res.success) {
        console.error('Não foi possível carregar as cidades', res.error);
        return;
      }

      setCities(res.cities || []);
    };

    handleFetchCities();
  }, [stateId]);

  return cities;
}
