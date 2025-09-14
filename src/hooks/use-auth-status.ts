import { getCurrentUser } from '@/lib/api/users';
import { User } from '@/lib/types/api';
import { useEffect, useMemo, useState } from 'react';
import { handleAuthError } from '@/utils/auth-error-handler';

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
            await handleAuthError(result.error);
          }
        }
      } catch (err) {
        setUser(null);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar autenticação';
        setError(errorMessage);
        await handleAuthError(err as Error);
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