import {
  createPaymentMethod as createPaymentMethodAction,
  deletePaymentMethod as deletePaymentMethodAction,
  getDefaultPaymentMethod as getDefaultPaymentMethodAction,
  getMyPaymentMethods as getMyPaymentMethodsAction,
  getPaymentMethodById as getPaymentMethodByIdAction,
  setDefaultPaymentMethod as setDefaultPaymentMethodAction,
  updatePaymentMethod as updatePaymentMethodAction,
} from '@/lib/api/payment-methods-client';
import { PaymentMethodData } from '@/lib/types/stripe';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/lib/types/stripe-payment';
import { useCallback, useEffect, useState } from 'react';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [defaultMethod, setDefaultMethod] = useState<PaymentMethodData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Payment methods error:', err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    clearError();
    try {
      const data = await getMyPaymentMethodsAction();
      setPaymentMethods(data);
      return data;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  const loadDefaultPaymentMethod = useCallback(async () => {
    try {
      const data = await getDefaultPaymentMethodAction();
      setDefaultMethod(data);
      return data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const getPaymentMethodById = useCallback(async (id: number) => {
    try {
      const data = await getPaymentMethodByIdAction(id);
      return data;
    } catch (err) {
      handleError(err);
      return null;
    }
  }, [handleError]);

  const createPaymentMethod = useCallback(
    async (data: CreatePaymentMethodDto) => {
      setIsLoading(true);
      clearError();
      try {
        const newPaymentMethod = await createPaymentMethodAction(data);
        setPaymentMethods((prev) => [...prev, newPaymentMethod]);
        
        if (newPaymentMethod.isDefault) {
          setDefaultMethod(newPaymentMethod);
          setPaymentMethods((prev) =>
            prev.map((method) => ({
              ...method,
              isDefault: method.id === newPaymentMethod.id,
            }))
          );
        }
        
        return newPaymentMethod;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const updatePaymentMethod = useCallback(
    async (id: number, data: UpdatePaymentMethodDto) => {
      setIsLoading(true);
      clearError();
      try {
        const updatedMethod = await updatePaymentMethodAction(id, data);
        setPaymentMethods((prev) =>
          prev.map((method) =>
            method.id === id ? { ...method, ...updatedMethod } : method
          )
        );
        
        if (updatedMethod.isDefault) {
          setDefaultMethod(updatedMethod);
          setPaymentMethods((prev) =>
            prev.map((method) => ({
              ...method,
              isDefault: method.id === id,
            }))
          );
        }
        
        return updatedMethod;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const removePaymentMethod = useCallback(
    async (id: number) => {
      setIsLoading(true);
      clearError();
      try {
        await deletePaymentMethodAction(id);
        setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
        
        if (defaultMethod?.id === id) {
          setDefaultMethod(null);
        }
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError, defaultMethod],
  );

  const setDefaultPaymentMethod = useCallback(
    async (id: number) => {
      setIsLoading(true);
      clearError();
      try {
        const updatedMethod = await setDefaultPaymentMethodAction(id);
        setPaymentMethods((prev) =>
          prev.map((method) => ({
            ...method,
            isDefault: method.id === id,
          })),
        );
        setDefaultMethod(updatedMethod);
        return updatedMethod;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  useEffect(() => {
    loadPaymentMethods();
    loadDefaultPaymentMethod();
  }, [loadPaymentMethods, loadDefaultPaymentMethod]);

  return {
    paymentMethods,
    defaultMethod,
    isLoading,
    error,
    loadPaymentMethods,
    loadDefaultPaymentMethod,
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    clearError,
  };
}
