import { getVetReviews, VetReviewsResponse } from '@/lib/api/vet-reviews';
import { useCallback, useEffect, useState } from 'react';

export function useVetReviews(veterinarianId: number, page = 1, perPage = 10) {
  const [data, setData] = useState<VetReviewsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getVetReviews(veterinarianId, { page, perPage });
      setData(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar reviews';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [veterinarianId, page, perPage]);

  useEffect(() => {
    if (veterinarianId) {
      fetchReviews();
    }
  }, [veterinarianId, fetchReviews]);

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchReviews 
  };
} 