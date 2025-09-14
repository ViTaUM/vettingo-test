'use client';

import { useState } from 'react';
import { createPaymentIntent, confirmPayment } from '@/lib/api/payment-api';
import UIButton from '@/components/ui/button';

interface ApiPaymentFormProps {
  amount: number;
  currency: string;
  description?: string;
  onSuccess?: (paymentId: number) => void;
  onError?: (error: string) => void;
}

export default function ApiPaymentForm({ amount, currency, description, onSuccess, onError }: ApiPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const intentResult = await createPaymentIntent({
        amount,
        currency: currency.toLowerCase(),
        description: description || 'Pagamento',
      });

      if (!intentResult.success || !intentResult.clientSecret) {
        throw new Error(intentResult.error || 'Erro ao criar PaymentIntent');
      }

      if (intentResult.paymentIntentId) {
        const confirmResult = await confirmPayment({
          paymentIntentId: intentResult.paymentIntentId,
          paymentMethodId: '', // Será preenchido pela API
        });

        if (confirmResult.success && confirmResult.paymentId) {
          onSuccess?.(confirmResult.paymentId);
        } else {
          throw new Error(confirmResult.error || 'Erro ao confirmar pagamento');
        }
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
          <span className="text-sm text-gray-600">Total a pagar:</span>
          <span className="text-lg font-semibold text-gray-900">{formatAmount(amount)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            O pagamento será processado de forma segura através da nossa API.
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
          {isProcessing ? 'Processando...' : 'Pagar'}
        </UIButton>
      </form>
    </div>
  );
}
