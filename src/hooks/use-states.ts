import { getStates } from '@/lib/api/resources';
import { State } from '@/lib/types/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useStates(): State[] {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    const handleFetchStates = async () => {
      const res = await getStates();

      if (!res.success) {
        toast.error('Não foi possível carregar os estados');
        return;
      }

      setStates(res.states || []);
    };

    handleFetchStates();
  }, []);

  return states;
}
