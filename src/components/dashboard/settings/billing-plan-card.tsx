'use client';

import { useSubscriptionContext } from '@/contexts/subscription-context';
import {
    formatCurrency,
    formatDate,
    getSubscriptionStatusColor,
    getSubscriptionStatusText,
} from '@/lib/utils/error-handler';
import { Calendar, Check, Crown } from 'lucide-react';

export default function BillingPlanCard() {
  const { subscription, plans, isLoading } = useSubscriptionContext();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-8 w-3/4 rounded bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-3 rounded bg-gray-200"></div>
            <div className="h-3 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="py-4 text-center">
          <Crown className="mx-auto h-8 w-8 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma assinatura ativa</h3>
          <p className="mt-1 text-sm text-gray-500">Assine um plano para acessar recursos premium.</p>
        </div>
      </div>
    );
  }

  const currentPlan = plans.find((plan) => plan.slug === subscription.planSlug);

  const getFeatures = () => {
    if (!currentPlan?.features || !Array.isArray(currentPlan.features)) return [];
    return currentPlan.features;
  };

  const isFreePlan = subscription.planSlug === 'FREE';

  const getPrice = () => {
    if (isFreePlan) return 'Grátis';
    if (!currentPlan || !currentPlan.priceMonthly || isNaN(currentPlan.priceMonthly)) return 'R$ 0,00';
    return formatCurrency(currentPlan.priceMonthly);
  };

  const getNextBilling = () => {
    if (!subscription.currentPeriodEnd) return 'Não definido';
    return formatDate(subscription.currentPeriodEnd);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Crown className="mr-2 h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getSubscriptionStatusColor(subscription.status)}`}>
          {getSubscriptionStatusText(subscription.status)}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{getPrice()}</span>
          {!isFreePlan && <span className="ml-1 text-gray-500">/mês</span>}
        </div>
        <h4 className="text-lg font-medium text-gray-900">{subscription.planName || currentPlan?.name || 'Plano não encontrado'}</h4>
      </div>

      {!isFreePlan && (
        <div className="mb-4 flex items-center text-sm text-gray-600">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Próximo débito: {getNextBilling()}</span>
        </div>
      )}

      {subscription.cancelAtPeriodEnd && (
        <div className="mb-4 rounded-lg bg-yellow-50 p-3">
          <p className="text-sm text-yellow-700">Sua assinatura será cancelada em {getNextBilling()}</p>
        </div>
      )}

      {!isFreePlan && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Incluído no seu plano:</h5>
          <ul className="space-y-1">
            {getFeatures().map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Check className="mr-2 h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
