import { getSpecializations } from '@/lib/api/resources';
import { SpecializationCategory } from '@/lib/types/api';
import { useEffect, useState } from 'react';

export function useSpecializations(): SpecializationCategory[] {
  const [categories, setCategories] = useState<SpecializationCategory[]>([]);

  useEffect(() => {
    const handleFetchSpecializations = async () => {
      const res = await getSpecializations();
      if (res.success && res.specializations) {
        setCategories(res.specializations);
      }
    };

    handleFetchSpecializations();
  }, []);

  return categories;
}
