'use client';

import { useEffect, useState } from 'react';

// Simulação de um serviço para obter o nome da cidade pelo ID
// Em um cenário real, você teria uma API ou um serviço para isso
const getCityNameById = async (cityId: number): Promise<string> => {
  // Simulação de uma chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mapeamento simulado de IDs para nomes de cidades
      const cityMap: Record<number, string> = {
        1: 'São Paulo',
        2: 'Rio de Janeiro',
        3: 'Belo Horizonte',
        4: 'Brasília',
        5: 'Salvador',
        // Adicione mais cidades conforme necessário
      };

      resolve(cityMap[cityId] || `Cidade ${cityId}`);
    }, 100);
  });
};

export function useCityName(cityId: number): string | null {
  const [cityName, setCityName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCityName = async () => {
      try {
        const name = await getCityNameById(cityId);
        if (isMounted) {
          setCityName(name);
        }
      } catch (error) {
        console.error('Erro ao buscar nome da cidade:', error);
      }
    };

    fetchCityName();

    return () => {
      isMounted = false;
    };
  }, [cityId]);

  return cityName;
}
