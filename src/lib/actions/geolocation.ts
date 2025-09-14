'use server';

import { getCities, getStates } from '@/lib/api/resources';
import { City, State } from '@/lib/types/api';

interface GeolocationResult {
  state: State | null;
  city: City | null;
  error?: string;
}

export async function getLocationFromCoordinates(
  latitude: number,
  longitude: number
): Promise<GeolocationResult> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=pt-BR`
    );

    if (!response.ok) {
      return {
        state: null,
        city: null,
        error: 'Erro ao obter dados de localização'
      };
    }

    const data = await response.json();

    if (!data.address) {
      return {
        state: null,
        city: null,
        error: 'Não foi possível identificar o endereço'
      };
    }

    const stateName = data.address.state || data.address.province || data.address.region;
    const cityName = data.address.city || data.address.town || data.address.village || data.address.municipality;

    if (!stateName || !cityName) {
      return {
        state: null,
        city: null,
        error: 'Estado ou cidade não encontrados'
      };
    }

    const states = await getStates({ activeOnly: true });
    
    if (!states.success || !states.states) {
      return {
        state: null,
        city: null,
        error: 'Erro ao buscar estados'
      };
    }

    const foundState = states.states.find(
      state => 
        state.name.toLowerCase().includes(stateName.toLowerCase()) ||
        state.uf.toLowerCase().includes(stateName.toLowerCase())
    );

    if (!foundState) {
      return {
        state: null,
        city: null,
        error: `Estado "${stateName}" não encontrado no sistema`
      };
    }

    const cities = await getCities(foundState.id, { activeOnly: true });
    
    if (!cities.success || !cities.cities) {
      return {
        state: foundState,
        city: null,
        error: 'Erro ao buscar cidades'
      };
    }

    const foundCity = cities.cities.find(
      city => city.name.toLowerCase().includes(cityName.toLowerCase())
    );

    if (!foundCity) {
      return {
        state: foundState,
        city: null,
        error: `Cidade "${cityName}" não encontrada no sistema`
      };
    }

    return {
      state: foundState,
      city: foundCity
    };

  } catch (error) {
    return {
      state: null,
      city: null,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    };
  }
} 