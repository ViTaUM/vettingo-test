import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPhone } from '@/lib/types/api';
import { getUserPhones, checkPhoneExists, searchUserPhone, getUserPhoneById } from '@/lib/api/user-phones';

export function useUserPhones() {
  const [phones, setPhones] = useState<UserPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhones() {
      setLoading(true);
      setError(null);

      const response = await getUserPhones();

      if (response.success && response.phones) {
        setPhones(response.phones);
      } else {
        setError(response.error || 'Erro ao carregar telefones');
        toast.error('Erro ao carregar telefones');
      }

      setLoading(false);
    }

    fetchPhones();
  }, []);

  return {
    phones,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      getUserPhones().then((response) => {
        if (response.success && response.phones) {
          setPhones(response.phones);
        } else {
          setError(response.error || 'Erro ao carregar telefones');
        }
        setLoading(false);
      });
    },
  };
}

export function usePhoneValidation() {
  const [checking, setChecking] = useState(false);

  const checkPhone = async (countryCode: string, areaCode: string, number: string): Promise<boolean | null> => {
    if (!countryCode || !areaCode || !number) return null;

    setChecking(true);
    const response = await checkPhoneExists(countryCode, areaCode, number);
    setChecking(false);

    if (response.success) {
      return response.exists || false;
    }

    toast.error('Erro ao verificar telefone');
    return null;
  };

  const searchPhone = async (countryCode: string, areaCode: string, number: string) => {
    if (!countryCode || !areaCode || !number) return null;

    setChecking(true);
    const response = await searchUserPhone(countryCode, areaCode, number);
    setChecking(false);

    if (response.success) {
      return response.phone || null;
    }

    if (response.error) {
      toast.error(response.error);
    }
    return null;
  };

  const getPhoneById = async (phoneId: number) => {
    setChecking(true);
    const response = await getUserPhoneById(phoneId);
    setChecking(false);

    if (response.success) {
      return response.phone || null;
    }

    if (response.error) {
      toast.error(response.error);
    }
    return null;
  };

  return { checkPhone, searchPhone, getPhoneById, checking };
}
