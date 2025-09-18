'use client';

import UIButton from '@/components/ui/button';
import { createSubscription } from '@/lib/api/subscriptions-client';
import { SubscriptionPlanResponse } from '@/lib/types/stripe';
import { useState } from 'react';

interface ApiSubscriptionCheckoutProps {
  plan: SubscriptionPlanResponse;
  period?: 'month' | 'year';
  paymentMethodId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function ApiSubscriptionCheckout({ 
  plan, 
  period = 'month', 
  paymentMethodId = '', 
  onSuccess, 
  onError 
}: ApiSubscriptionCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const subscription = await createSubscription({
        planSlug: plan.slug,
        paymentMethodId: paymentMethodId,
        period: period,
      });

      if (subscription) {
        onSuccess?.();
      } else {
        throw new Error('Erro ao criar assinatura');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{plan.name}</h3>
            <p className="text-sm text-gray-600">{plan.description}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(period === 'year' ? (plan.priceYearly || 0) : (plan.priceMonthly || 0))}
            </div>
            <div className="text-sm text-gray-500">
              /{period === 'year' ? 'ano' : 'mês'}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            A assinatura será processada de forma segura através da nossa API.
          </p>
        </div>
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <UIButton
          type="submit"
          disabled={isProcessing}
          loading={isProcessing}
          variant="solid"
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700">
          {isProcessing ? 'Processando...' : `Assinar ${plan.name}`}
        </UIButton>
      </form>
    </div>
  );
}
