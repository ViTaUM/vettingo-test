import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserEmail } from '@/lib/types/api';
import { getUserEmails, checkEmailExists, searchUserEmail } from '@/lib/api/user-emails';

export function useUserEmails() {
  const [emails, setEmails] = useState<UserEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmails() {
      setLoading(true);
      setError(null);

      const response = await getUserEmails();

      if (response.success && response.emails) {
        setEmails(response.emails);
      } else {
        setError(response.error || 'Erro ao carregar emails');
        toast.error('Erro ao carregar emails');
      }

      setLoading(false);
    }

    fetchEmails();
  }, []);

  return {
    emails,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      getUserEmails().then((response) => {
        if (response.success && response.emails) {
          setEmails(response.emails);
        } else {
          setError(response.error || 'Erro ao carregar emails');
        }
        setLoading(false);
      });
    },
  };
}

export function useEmailValidation() {
  const [checking, setChecking] = useState(false);

  const checkEmail = async (email: string): Promise<boolean | null> => {
    if (!email) return null;

    setChecking(true);
    const response = await checkEmailExists(email);
    setChecking(false);

    if (response.success) {
      return response.exists || false;
    }

    toast.error('Erro ao verificar email');
    return null;
  };

  const searchEmail = async (email: string) => {
    if (!email) return null;

    setChecking(true);
    const response = await searchUserEmail(email);
    setChecking(false);

    if (response.success) {
      return response.email || null;
    }

    if (response.error) {
      toast.error(response.error);
    }
    return null;
  };

  return { checkEmail, searchEmail, checking };
}
