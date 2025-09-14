'use client';

import UIButton from '@/components/ui/button';
import { CreditCard, CreditCard as CreditCardIcon } from 'lucide-react';
import { useState } from 'react';
import BillingPlanCard from './billing-plan-card';
import PaymentHistoryCard from './payment-history-card';
import PaymentMethodCard from './payment-method-card';
import BillingErrorFallback from './billing-error-fallback';
import { useSubscriptionContext } from '@/contexts/subscription-context';
import { usePaymentContext } from '@/contexts/payment-context';
import ApiPaymentMethodModal from '@/components/billing/api-payment-method-modal';

interface BillingSectionProps {
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function BillingSection({ onMessage }: BillingSectionProps) {
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const {
    subscription,
    cancelSubscription,
    error: subscriptionError,
    clearError: clearSubscriptionError,
  } = useSubscriptionContext();
  const { refreshPayments, error: paymentError, clearError: clearPaymentError } = usePaymentContext();

  const handleUpdatePaymentMethod = async () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentMethodSuccess = async (paymentMethodId: string) => {
    try {
      console.log('Novo método de pagamento adicionado:', paymentMethodId);
      await refreshPayments();
      onMessage?.({ type: 'success', text: 'Método de pagamento adicionado com sucesso' });
      setIsPaymentModalOpen(false);
    } catch {
      onMessage?.({ type: 'error', text: 'Erro ao adicionar método de pagamento' });
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) {
      onMessage?.({ type: 'error', text: 'Nenhuma assinatura ativa encontrada' });
      return;
    }

    setLoading(true);
    try {
      await cancelSubscription();
      onMessage?.({ type: 'success', text: 'Assinatura cancelada com sucesso' });
    } catch {
      onMessage?.({ type: 'error', text: 'Erro ao cancelar assinatura' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    clearSubscriptionError();
    clearPaymentError();
    refreshPayments();
  };

  const hasError = subscriptionError || paymentError;
  const errorMessage = subscriptionError || paymentError;

  if (hasError) {
    return (
      <BillingErrorFallback error={errorMessage || 'Erro desconhecido'} onRetry={handleRetry} isLoading={loading} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <CreditCard className="mr-3 h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">Assinatura e Pagamentos</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <BillingPlanCard />
            <PaymentMethodCard onUpdate={handleUpdatePaymentMethod} />
          </div>

          <div className="mt-6">
            <PaymentHistoryCard />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <UIButton
              onClick={handleUpdatePaymentMethod}
              loading={loading}
              variant="solid"
              size="md"
              className="bg-blue-600 hover:bg-blue-700">
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Atualizar Método de Pagamento
            </UIButton>

            {subscription && !subscription.cancelAtPeriodEnd && (
              <UIButton
                onClick={handleCancelSubscription}
                loading={loading}
                variant="outline"
                size="md"
                className="border-red-300 bg-white text-red-700 hover:bg-red-50">
                Cancelar Assinatura
              </UIButton>
            )}
          </div>
        </div>
      </div>

      <ApiPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentMethodSuccess}
        title="Adicionar Método de Pagamento"
        subtitle="Adicione um novo cartão de crédito para pagamentos seguros"
      />
    </div>
  );
}
