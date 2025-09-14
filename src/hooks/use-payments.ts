import { useState, useEffect, useCallback } from 'react';
import {
  getMyPayments as getMyPaymentsAction,
  createPayment as createPaymentAction,
  processPayment as processPaymentAction,
  updatePayment as updatePaymentAction,
  getPaymentById as getPaymentByIdAction,
} from '@/lib/api/payments-client';
import { PaymentResponse, CreatePaymentDto, ProcessPaymentRequest, UpdatePaymentDto } from '@/lib/types/stripe';
import { cache, cacheKeys } from '@/lib/utils/cache';

export function usePayments() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Payments error:', err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    clearError();
    try {
      const cached = cache.get<PaymentResponse[]>(cacheKeys.payments.list);
      if (cached) {
        setPayments(cached);
        return cached;
      }

      const data = await getMyPaymentsAction();
      setPayments(data);
      cache.set(cacheKeys.payments.list, data);
      return data;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  const createPayment = useCallback(
    async (data: CreatePaymentDto) => {
      setIsLoading(true);
      clearError();
      try {
        const payment = await createPaymentAction(data);
        setPayments((prev) => [payment, ...prev]);
        cache.invalidate(cacheKeys.payments.list);
        return payment;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const processPayment = useCallback(
    async (data: ProcessPaymentRequest) => {
      setIsLoading(true);
      clearError();
      try {
        const payment = await processPaymentAction(data);
        setPayments((prev) => [payment, ...prev]);
        cache.invalidate(cacheKeys.payments.list);
        return payment;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const updatePayment = useCallback(
    async (id: number, data: UpdatePaymentDto) => {
      setIsLoading(true);
      clearError();
      try {
        const updatedPayment = await updatePaymentAction(id, data);
        setPayments((prev) =>
          prev.map((payment) => (payment.id === id ? updatedPayment : payment)),
        );
        cache.invalidate(cacheKeys.payments.list);
        return updatedPayment;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const getPaymentById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      clearError();
      try {
        const payment = await getPaymentByIdAction(id);
        return payment;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const refreshPayments = useCallback(() => {
    return loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return {
    payments,
    isLoading,
    error,
    createPayment,
    processPayment,
    updatePayment,
    getPaymentById,
    refreshPayments,
    clearError,
  };
}

export function usePaymentById(id: number) {
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Payment by ID error:', err);
  }, []);

  const loadPayment = useCallback(async () => {
    if (!id) return null;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getPaymentByIdAction(id);
      setPayment(data);
      return data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [id, handleError]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  return {
    payment,
    isLoading,
    error,
    loadPayment,
  };
}
