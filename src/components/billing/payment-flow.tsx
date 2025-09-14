'use client';

import { useState } from 'react';
import { CreditCard, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import UIButton from '@/components/ui/button';
import ApiPaymentForm from '@/components/billing/api-payment-form';
import { usePaymentContext } from '@/contexts/payment-context';

interface PaymentFlowProps {
  amount: number;
  currency?: string;
  description?: string;
  onSuccess?: (paymentId: number) => void;
  onCancel?: () => void;
}

export default function PaymentFlow({
  amount,
  currency = 'BRL',
  description = 'Pagamento',
  onSuccess,
  onCancel,
}: PaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<'payment' | 'processing' | 'success' | 'error'>('payment');
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const { processPayment } = usePaymentContext();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  const handlePaymentSubmit = async () => {
    setCurrentStep('processing');
    try {
      const payment = await processPayment({
        amount,
        currency: currency.toLowerCase(),
        description,
        paymentMethodId: '', // Será preenchido pela API
      });

      setPaymentId(payment.id);
      setCurrentStep('success');

      setTimeout(() => {
        onSuccess?.(payment.id);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no pagamento';
      setError(errorMessage);
      setCurrentStep('error');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentStep('error');
  };

  const handleRetry = () => {
    setError('');
    setCurrentStep('payment');
  };

  if (currentStep === 'processing') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Processando pagamento...</h3>
          <p className="mt-2 text-sm text-gray-500">Aguarde enquanto processamos sua transação</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Pagamento realizado com sucesso!</h3>
          <p className="mt-2 text-sm text-gray-500">
            Pagamento ID: {paymentId} • {formatAmount(amount)}
          </p>
          <p className="mt-1 text-xs text-gray-400">Redirecionando...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'error') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Erro no pagamento</h3>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <div className="mt-6 flex justify-center space-x-3">
            <UIButton onClick={handleRetry} variant="solid" size="md" className="bg-blue-600 hover:bg-blue-700">
              Tentar novamente
            </UIButton>
            {onCancel && (
              <UIButton onClick={onCancel} variant="outline" size="md">
                Cancelar
              </UIButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="mr-3 h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pagamento</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        {onCancel && (
          <UIButton onClick={onCancel} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </UIButton>
        )}
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-gray-900">{formatAmount(amount)}</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Informações de Pagamento</h3>

        <ApiPaymentForm
          amount={amount}
          currency={currency.toLowerCase()}
          onSuccess={() => {
            handlePaymentSubmit();
          }}
          onError={handlePaymentError}
          description={description}
        />
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Pagamento seguro</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-inside list-disc space-y-1">
                <li>Processamento seguro via API</li>
                <li>Dados criptografados com SSL</li>
                <li>Suporte a principais cartões</li>
                <li>Proteção contra fraudes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
