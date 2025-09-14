'use client';

import { ReactNode } from 'react';
import { PaymentProvider } from '@/contexts/payment-context';
import { SubscriptionProvider } from '@/contexts/subscription-context';
import { PaymentMethodsProvider } from '@/contexts/payment-methods-context';

interface BillingProviderProps {
  children: ReactNode;
}

export function BillingProvider({ children }: BillingProviderProps) {
  return (
    <SubscriptionProvider>
      <PaymentProvider>
        <PaymentMethodsProvider>{children}</PaymentMethodsProvider>
      </PaymentProvider>
    </SubscriptionProvider>
  );
}

export default BillingProvider;
