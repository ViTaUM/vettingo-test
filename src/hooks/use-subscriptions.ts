import { useState, useEffect, useCallback } from 'react';
import {
  createSubscription as createSubscriptionAction,
  getMySubscription as getMySubscriptionAction,
  updateSubscription as updateSubscriptionAction,
  cancelSubscription as cancelSubscriptionAction,
  reactivateSubscription as reactivateSubscriptionAction,
  getAllPlans as getAllPlansAction,
  getPlanBySlug as getPlanBySlugAction,
} from '@/lib/api/subscriptions-client';
import {
  SubscriptionResponse,
  SubscriptionPlanResponse,
  CreateUserSubscriptionDto,
  UpdateUserSubscriptionDto,
} from '@/lib/types/stripe';
import { cache, cacheKeys } from '@/lib/utils/cache';

export function useSubscriptions() {
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Subscription error:', err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getMySubscription = useCallback(async () => {
    setIsLoading(true);
    clearError();
    try {
      const cached = cache.get<SubscriptionResponse | null>(cacheKeys.subscriptions.current);
      if (cached !== null) {
        setSubscription(cached);
        return cached;
      }

      const data = await getMySubscriptionAction();
      setSubscription(data);
      cache.set(cacheKeys.subscriptions.current, data);
      return data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    clearError();
    try {
      const cached = cache.get<SubscriptionPlanResponse[]>(cacheKeys.plans.list);
      if (cached) {
        setPlans(cached);
        return cached;
      }

      const data = await getAllPlansAction();
      setPlans(data);
      cache.set(cacheKeys.plans.list, data, 10 * 60 * 1000);
      return data;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clearError, handleError]);

  const createSubscription = useCallback(
    async (data: CreateUserSubscriptionDto) => {
      setIsLoading(true);
      clearError();
      try {
        const newSubscription = await createSubscriptionAction(data);
        setSubscription(newSubscription);
        cache.set(cacheKeys.subscriptions.current, newSubscription);
        return newSubscription;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const updateSubscription = useCallback(
    async (id: number, data: UpdateUserSubscriptionDto) => {
      setIsLoading(true);
      clearError();
      try {
        const updatedSubscription = await updateSubscriptionAction(id, data);
        setSubscription(updatedSubscription);
        cache.set(cacheKeys.subscriptions.current, updatedSubscription);
        return updatedSubscription;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const cancelSubscription = useCallback(
    async () => {
      setIsLoading(true);
      clearError();
      try {
        const canceledSubscription = await cancelSubscriptionAction(true);
        setSubscription(canceledSubscription);
        cache.set(cacheKeys.subscriptions.current, canceledSubscription);
        return canceledSubscription;
      } catch (err) {
        handleError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError],
  );

  const refreshSubscription = useCallback(() => {
    return getMySubscription();
  }, [getMySubscription]);

  const reactivateSubscription = useCallback(
    async () => {
      setIsLoading(true);
      clearError();
      try {
        const reactivatedSubscription = await reactivateSubscriptionAction();
        setSubscription(reactivatedSubscription);
        cache.set(cacheKeys.subscriptions.current, reactivatedSubscription);
        return reactivatedSubscription;
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
    getMySubscription();
    loadPlans();
  }, [getMySubscription, loadPlans]);

  return {
    subscription,
    plans,
    isLoading,
    error,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription,
    loadPlans,
    clearError,
  };
}

export function useSubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlanResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    setError(message);
    console.error('Subscription plans error:', err);
  }, []);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cached = cache.get<SubscriptionPlanResponse[]>(cacheKeys.plans.list);
      if (cached) {
        setPlans(cached);
        return cached;
      }

      const data = await getAllPlansAction();
      setPlans(data);
      cache.set(cacheKeys.plans.list, data, 10 * 60 * 1000);
      return data;
    } catch (err) {
      handleError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getPlanBySlug = useCallback(
    async (slug: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const plan = await getPlanBySlugAction(slug);
        return plan;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError],
  );

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  return {
    plans,
    isLoading,
    error,
    loadPlans,
    getPlanBySlug,
    refetch: loadPlans,
  };
}
