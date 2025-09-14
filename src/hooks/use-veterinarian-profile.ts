'use client';

import { getCurrentVeterinarian } from '@/lib/api/veterinarians';
import { Veterinarian } from '@/lib/types/api';
import { useCallback, useEffect, useState } from 'react';

export function useVeterinarianProfile() {
  const [veterinarian, setVeterinarian] = useState<Veterinarian | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVeterinarianProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCurrentVeterinarian();
      if (result.success && result.veterinarian) {
        setVeterinarian(result.veterinarian);
      } else {
        setError(result.error || 'Erro ao carregar perfil do veterinário');
      }
    } catch {
      setError('Erro ao carregar perfil do veterinário');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVeterinarianProfile();
  }, [loadVeterinarianProfile]);

  const hasProfile = veterinarian !== null && veterinarian.id > 0;

  return {
    veterinarian,
    loading,
    error,
    hasProfile,
    refetch: loadVeterinarianProfile
  };
} 