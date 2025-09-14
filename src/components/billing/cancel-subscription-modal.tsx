'use client';

import UIButton from '@/components/ui/button';
import { useSubscriptionContext } from '@/contexts/subscription-context';
import { formatCurrency, formatDate } from '@/lib/utils/error-handler';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, Calendar, CreditCard, X } from 'lucide-react';
import { Fragment, useState } from 'react';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CancelSubscriptionModal({ isOpen, onClose, onSuccess }: CancelSubscriptionModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);
  const { subscription, plans, cancelSubscription } = useSubscriptionContext();

  const currentPlan = plans.find((plan) => plan.slug === subscription?.planSlug);

  const reasons = [
    'Muito caro',
    'Não uso mais o serviço',
    'Encontrei uma alternativa melhor',
    'Funcionalidades insuficientes',
    'Problemas técnicos',
    'Mudança nas necessidades do negócio',
    'Outro',
  ];

  const handleCancel = async () => {
    if (!subscription) return;

    setIsProcessing(true);
    try {
      await cancelSubscription();
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getBenefitsLost = () => {
    if (!currentPlan?.features) return [];
    return currentPlan.features;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="bg-opacity-25 fixed inset-0 bg-black" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-3 h-6 w-6 text-red-600" />
                    <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                      Cancelar Assinatura
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    onClick={onClose}>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {subscription && currentPlan && (
                  <div className="mb-6 rounded-lg bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{currentPlan.name}</h4>
                        <p className="text-sm text-gray-500">
                          {currentPlan.priceMonthly && !isNaN(currentPlan.priceMonthly) ? formatCurrency(currentPlan.priceMonthly) : 'R$ 0,00'}/mês
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Próximo débito</p>
                        <p className="font-medium text-gray-900">
                          {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="mb-3 block text-sm font-medium text-gray-700">Quando cancelar?</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={cancelAtPeriodEnd}
                        onChange={() => setCancelAtPeriodEnd(true)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <Calendar className="mr-1 inline h-4 w-4" />
                        No final do período atual (recomendado)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!cancelAtPeriodEnd}
                        onChange={() => setCancelAtPeriodEnd(false)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        <CreditCard className="mr-1 inline h-4 w-4" />
                        Imediatamente (sem reembolso)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Por que está cancelando? (opcional)
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                    <option value="">Selecione um motivo</option>
                    {reasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6 rounded-lg bg-red-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-red-800">Você perderá acesso a:</h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    {getBenefitsLost()
                      .slice(0, 4)
                      .map((benefit: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    {getBenefitsLost().length > 4 && (
                      <li className="text-xs">E mais {getBenefitsLost().length - 4} benefícios...</li>
                    )}
                  </ul>
                </div>

                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-blue-800">Antes de cancelar, considere:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Fazer downgrade para um plano mais barato</li>
                    <li>• Pausar a assinatura temporariamente</li>
                    <li>• Entrar em contato com nosso suporte</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <UIButton onClick={onClose} variant="outline" size="md" disabled={isProcessing}>
                    Manter Assinatura
                  </UIButton>
                  <UIButton
                    onClick={handleCancel}
                    loading={isProcessing}
                    variant="solid"
                    size="md"
                    className="bg-red-600 hover:bg-red-700">
                    {cancelAtPeriodEnd ? 'Cancelar no Final do Período' : 'Cancelar Imediatamente'}
                  </UIButton>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Você pode reativar sua assinatura a qualquer momento</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
