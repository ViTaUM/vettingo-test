'use client';

import ApiSubscriptionCheckout from '@/components/billing/api-subscription-checkout';
import UIButton from '@/components/ui/button';
import { useSubscriptionContext } from '@/contexts/subscription-context';
import { SubscriptionPlanResponse } from '@/lib/types/stripe';
import { ArrowRight, Check, Crown, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SubscriptionFlowProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubscriptionFlow({ onSuccess, onCancel }: SubscriptionFlowProps) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [currentStep, setCurrentStep] = useState<'plans' | 'checkout' | 'processing'>('plans');
  const { plans, isLoading, createSubscription } = useSubscriptionContext();

  const formatPrice = (price?: number) => {
    if (!price) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const getFeatures = (plan: SubscriptionPlanResponse) => {
    if (!plan.features) return [];
    return plan.features;
  };

  const handlePlanSelect = (plan: SubscriptionPlanResponse) => {
    setSelectedPlan(plan);
  };

  const handleIntervalChange = (interval: 'monthly' | 'yearly') => {
    setSelectedInterval(interval);
  };

  const handleContinueToCheckout = async () => {
    if (!selectedPlan) return;

    setCurrentStep('processing');
    try {
      const subscriptionData = {
        planSlug: selectedPlan.slug,
        paymentMethodId: '', // Será preenchido pela API
        period: selectedInterval === 'yearly' ? 'year' : 'month',
      };

      await createSubscription(subscriptionData);
      setCurrentStep('checkout');
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      setCurrentStep('plans');
    }
  };

  const handleCheckoutSuccess = () => {
    setCurrentStep('processing');
    setTimeout(() => {
      onSuccess?.();
    }, 2000);
  };

  const handleCheckoutError = (error: string) => {
    console.error('Erro no checkout:', error);
    setCurrentStep('plans');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando planos...</span>
      </div>
    );
  }

  if (currentStep === 'processing') {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Processando sua assinatura...</h3>
          <p className="mt-2 text-sm text-gray-500">Aguarde enquanto configuramos sua conta</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'checkout' && selectedPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Finalizar Assinatura</h2>
          <UIButton variant="ghost" size="sm" onClick={() => setCurrentStep('plans')}>
            Voltar aos Planos
          </UIButton>
        </div>

        <ApiSubscriptionCheckout
          plan={selectedPlan}
          period={selectedInterval === 'yearly' ? 'year' : 'month'}
          onSuccess={() => {
            handleCheckoutSuccess();
          }}
          onError={handleCheckoutError}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Escolha seu Plano</h2>
        <p className="mt-2 text-gray-600">Selecione o plano ideal para suas necessidades</p>
      </div>

      <div className="flex justify-center">
        <div className="rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => handleIntervalChange('monthly')}
            className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              selectedInterval === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}>
            Mensal
          </button>
          <button
            onClick={() => handleIntervalChange('yearly')}
            className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
              selectedInterval === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}>
            Anual
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const price = selectedInterval === 'monthly' ? (plan.priceMonthly || 0) : (plan.priceYearly || 0);

          return (
            <div
              key={plan.id}
              className={`relative rounded-lg border-2 p-6 transition-colors ${
                isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
              {plan.slug === 'PREMIUM' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <Crown className="mx-auto h-8 w-8 text-blue-600" />
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{plan.name}</h3>
                {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}

                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
                  <span className="text-gray-500">/{selectedInterval === 'monthly' ? 'mês' : 'ano'}</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {getFeatures(plan).map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <UIButton
                onClick={() => handlePlanSelect(plan)}
                variant={isSelected ? 'solid' : 'outline'}
                size="md"
                className={`mt-6 w-full ${
                  isSelected ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-300 hover:border-gray-400'
                }`}>
                {isSelected ? 'Selecionado' : 'Selecionar Plano'}
              </UIButton>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <h4 className="font-medium text-gray-900">Plano Selecionado: {selectedPlan.name}</h4>
            <p className="text-sm text-gray-500">
              {formatPrice(selectedInterval === 'monthly' ? (selectedPlan.priceMonthly || 0) : (selectedPlan.priceYearly || 0))} / {selectedInterval === 'monthly' ? 'mês' : 'ano'}
            </p>
          </div>
          <UIButton
            onClick={handleContinueToCheckout}
            variant="solid"
            size="md"
            className="bg-blue-600 hover:bg-blue-700">
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </UIButton>
        </div>
      )}

      {onCancel && (
        <div className="flex justify-center">
          <UIButton onClick={onCancel} variant="ghost" size="sm">
            Cancelar
          </UIButton>
        </div>
      )}
    </div>
  );
}
