'use client';

import { usePaymentMethods } from '@/hooks/use-payment-methods';
import { PaymentMethodData } from '@/lib/types/stripe';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/lib/types/stripe-payment';
import { ReactNode, createContext, useContext } from 'react';

interface PaymentMethodsContextValue {
  paymentMethods: PaymentMethodData[];
  defaultMethod: PaymentMethodData | null;
  isLoading: boolean;
  error: string | null;
  loadPaymentMethods: () => Promise<PaymentMethodData[]>;
  loadDefaultPaymentMethod: () => Promise<PaymentMethodData | null>;
  getPaymentMethodById: (id: number) => Promise<PaymentMethodData | null>;
  createPaymentMethod: (data: CreatePaymentMethodDto) => Promise<PaymentMethodData>;
  updatePaymentMethod: (id: number, data: UpdatePaymentMethodDto) => Promise<PaymentMethodData>;
  removePaymentMethod: (id: number) => Promise<void>;
  setDefaultPaymentMethod: (id: number) => Promise<PaymentMethodData>;
  clearError: () => void;
}

const PaymentMethodsContext = createContext<PaymentMethodsContextValue | null>(null);

interface PaymentMethodsProviderProps {
  children: ReactNode;
}

export function PaymentMethodsProvider({ children }: PaymentMethodsProviderProps) {
  const paymentMethodsValue = usePaymentMethods();

  return (
    <PaymentMethodsContext.Provider value={paymentMethodsValue}>
      {children}
    </PaymentMethodsContext.Provider>
  );
}

export function usePaymentMethodsContext() {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error('usePaymentMethodsContext must be used within a PaymentMethodsProvider');
  }
  return context;
}
