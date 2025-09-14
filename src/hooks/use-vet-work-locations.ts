import { getVetWorkLocationsByVeterinarianId } from '@/lib/api/vet-work-locations';
import { VeterinarianWorkLocation } from '@/lib/types/api';
import { useCallback, useEffect, useState } from 'react';

interface VetWorkLocationFilters {
  cityId?: number;
  active?: boolean;
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

export function useVetWorkLocations(veterinarianId: number, filters: VetWorkLocationFilters = {}) {
  const [data, setData] = useState<VeterinarianWorkLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    if (!veterinarianId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getVetWorkLocationsByVeterinarianId(veterinarianId, filters);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Erro ao buscar locais de trabalho');
      }
    } catch {
      setError('Erro ao buscar locais de trabalho');
    } finally {
      setLoading(false);
    }
  }, [veterinarianId, filters]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchLocations 
  };
} 