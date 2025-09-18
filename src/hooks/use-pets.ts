'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pet } from '@/lib/types/api';
import { getUserPets } from '@/lib/api/pets';

/**
 * Hook para buscar pets do usuário
 */
export function usePets(): {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);

    const response = await getUserPets();

    if (!response.success) {
      const errorMessage = response.error || 'Erro ao carregar pets';
      setError(errorMessage);
      toast.error(errorMessage);
      setPets([]);
    } else {
      setPets(response.pets || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    loading,
    error,
    refetch: fetchPets,
  };
} 