import { getCurrentUser } from '@/lib/api/users';
import { User } from '@/lib/types/api';
import { useEffect, useMemo, useState } from 'react';

export function useAuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await getCurrentUser();
        
        if (result.success && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
          if (result.error) {
            setError(result.error);
          }
        }
      } catch {
        setUser(null);
        setError('Erro ao verificar autenticação');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isAuthenticated = useMemo(() => {
    return !!user;
  }, [user]);

  const isUser = useMemo(() => {
    return user?.role === 'USER';
  }, [user]);

  const isVeterinarian = useMemo(() => {
    return user?.role === 'VETERINARIAN';
  }, [user]);

  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isUser,
    isVeterinarian,
    isAdmin,
  };
} 