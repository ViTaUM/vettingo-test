'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSubscriptions } from '@/hooks/use-subscriptions';
import {
  SubscriptionResponse,
  SubscriptionPlanResponse,
  CreateUserSubscriptionDto,
  UpdateUserSubscriptionDto,
} from '@/lib/types/stripe';

interface SubscriptionContextValue {
  subscription: SubscriptionResponse | null;
  plans: SubscriptionPlanResponse[];
  isLoading: boolean;
  error: string | null;
  createSubscription: (data: CreateUserSubscriptionDto) => Promise<SubscriptionResponse>;
  updateSubscription: (id: number, data: UpdateUserSubscriptionDto) => Promise<SubscriptionResponse>;
  cancelSubscription: () => Promise<SubscriptionResponse>;
  reactivateSubscription: () => Promise<SubscriptionResponse>;
  refreshSubscription: () => Promise<SubscriptionResponse | null>;
  loadPlans: () => Promise<SubscriptionPlanResponse[]>;
  clearError: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const subscriptionData = useSubscriptions();

  return <SubscriptionContext.Provider value={subscriptionData}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptionContext(): SubscriptionContextValue {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext deve ser usado dentro de um SubscriptionProvider');
  }
  return context;
}
