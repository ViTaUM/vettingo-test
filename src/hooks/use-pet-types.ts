'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PetType } from '@/lib/types/api';
import { getActivePetTypes, getPetTypesByCategory } from '@/lib/api/pet-types';

/**
 * Hook para buscar tipos de pet ativos
 */
export function usePetTypes(): {
  petTypes: PetType[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPetTypes = async () => {
    setLoading(true);
    setError(null);

    const response = await getActivePetTypes();

    if (!response.success) {
      const errorMessage = response.error || 'Erro ao carregar tipos de pet';
      setError(errorMessage);
      toast.error(errorMessage);
      setPetTypes([]);
    } else {
      setPetTypes(response.petTypes || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPetTypes();
  }, []);

  return {
    petTypes,
    loading,
    error,
    refetch: fetchPetTypes,
  };
}

/**
 * Hook para buscar tipos de pet por categoria
 */
export function usePetTypesByCategory(categoryId: number | null): {
  petTypes: PetType[];
  loading: boolean;
  error: string | null;
  categoryInfo?: { id: number; name: string };
  refetch: () => void;
} {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<{ id: number; name: string }>();

  const fetchPetTypesByCategory = async () => {
    if (!categoryId) {
      setPetTypes([]);
      setCategoryInfo(undefined);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getPetTypesByCategory(categoryId, { activeOnly: true });

    if (!response.success) {
      const errorMessage = response.error || 'Erro ao carregar tipos de pet da categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      setPetTypes([]);
      setCategoryInfo(undefined);
    } else {
      setPetTypes(response.data?.petTypes || []);
      setCategoryInfo(response.data?.categoryInfo);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPetTypesByCategory();
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    petTypes,
    loading,
    error,
    categoryInfo,
    refetch: fetchPetTypesByCategory,
  };
}

/**
 * Hook simples para buscar apenas tipos de pet ativos (mais leve)
 */
export function useActivePetTypes(): {
  petTypes: PetType[];
  loading: boolean;
  error: string | null;
} {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivePetTypes() {
      setLoading(true);
      setError(null);

      const response = await getActivePetTypes();

      if (!response.success) {
        const errorMessage = response.error || 'Erro ao carregar tipos de pet ativos';
        setError(errorMessage);
        toast.error(errorMessage);
        setPetTypes([]);
      } else {
        setPetTypes(response.petTypes || []);
      }

      setLoading(false);
    }

    fetchActivePetTypes();
  }, []);

  return {
    petTypes,
    loading,
    error,
  };
}
