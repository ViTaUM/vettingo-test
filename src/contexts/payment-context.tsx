'use client';

import { createContext, useContext, ReactNode } from 'react';
import { usePayments } from '@/hooks/use-payments';
import { PaymentResponse, ProcessPaymentRequest, CreatePaymentDto, UpdatePaymentDto } from '@/lib/types/stripe';

interface PaymentContextValue {
  payments: PaymentResponse[];
  isLoading: boolean;
  error: string | null;
  createPayment: (data: CreatePaymentDto) => Promise<PaymentResponse>;
  processPayment: (data: ProcessPaymentRequest) => Promise<PaymentResponse>;
  updatePayment: (id: number, data: UpdatePaymentDto) => Promise<PaymentResponse>;
  getPaymentById: (id: number) => Promise<PaymentResponse | null>;
  refreshPayments: () => Promise<PaymentResponse[]>;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextValue | null>(null);

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const paymentData = usePayments();

  return <PaymentContext.Provider value={paymentData}>{children}</PaymentContext.Provider>;
}

export function usePaymentContext(): PaymentContextValue {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePaymentContext deve ser usado dentro de um PaymentProvider');
  }
  return context;
}
