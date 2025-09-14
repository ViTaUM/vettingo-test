'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { PetTypeCategory } from '@/lib/types/api';
import { getActivePetTypeCategories, searchPetTypeCategories } from '@/lib/api/pet-type-categories';

/**
 * Hook para buscar categorias de tipos de pet ativas
 */
export function usePetTypeCategories(): {
  categories: PetTypeCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [categories, setCategories] = useState<PetTypeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    const response = await getActivePetTypeCategories();

    if (!response.success) {
      const errorMessage = response.error || 'Erro ao carregar categorias de tipos de pet';
      setError(errorMessage);
      toast.error(errorMessage);
      setCategories([]);
    } else {
      setCategories(response.categories || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook para buscar categorias por termo de busca
 */
export function useSearchPetTypeCategories(searchTerm: string): {
  categories: PetTypeCategory[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
} {
  const [categories, setCategories] = useState<PetTypeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setCategories([]);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await searchPetTypeCategories(query);

    if (!response.success) {
      const errorMessage = response.error || 'Erro ao buscar categorias';
      setError(errorMessage);
      toast.error(errorMessage);
      setCategories([]);
    } else {
      setCategories(response.categories || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    search(searchTerm);
  }, [searchTerm, search]);

  return {
    categories,
    loading,
    error,
    search,
  };
}

/**
 * Hook para buscar categorias com funcionalidade de pesquisa
 */
export function usePetTypeCategoriesSearch(): {
  categories: PetTypeCategory[];
  loading: boolean;
  error: string | null;
  searchCategories: (searchTerm: string) => Promise<void>;
  clearSearch: () => void;
} {
  const [categories, setCategories] = useState<PetTypeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalCategories, setOriginalCategories] = useState<PetTypeCategory[]>([]);

  // Carrega categorias iniciais
  useEffect(() => {
    async function fetchInitialCategories() {
      setLoading(true);
      setError(null);

      const response = await getActivePetTypeCategories();

      if (response.success && response.categories) {
        setCategories(response.categories);
        setOriginalCategories(response.categories);
      } else {
        const errorMessage = response.error || 'Erro ao carregar categorias';
        setError(errorMessage);
        toast.error(errorMessage);
      }

      setLoading(false);
    }

    fetchInitialCategories();
  }, []);

  const searchCategories = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setCategories(originalCategories);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await searchPetTypeCategories(searchTerm);

      if (response.success && response.categories) {
        setCategories(response.categories);
      } else {
        const errorMessage = response.error || 'Erro ao buscar categorias';
        setError(errorMessage);
        toast.error(errorMessage);
      }

      setLoading(false);
    },
    [originalCategories],
  );

  const clearSearch = useCallback(() => {
    setCategories(originalCategories);
    setError(null);
  }, [originalCategories]);

  return {
    categories,
    loading,
    error,
    searchCategories,
    clearSearch,
  };
}
