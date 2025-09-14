'use client';

import ApiPaymentMethodModal from '@/components/billing/api-payment-method-modal';
import SubscriptionModal from '@/components/billing/subscription-modal';
import BillingErrorFallback from '@/components/dashboard/settings/billing-error-fallback';
import SubscriptionPlanCard from '@/components/dashboard/settings/billing-plan-card';
import PaymentHistoryCard from '@/components/dashboard/settings/payment-history-card';
import PaymentMethodCard from '@/components/dashboard/settings/payment-method-card';
import UIButton from '@/components/ui/button';
import { usePaymentContext } from '@/contexts/payment-context';
import { useSubscriptionContext } from '@/contexts/subscription-context';
import { usePaymentMethods } from '@/hooks/use-payment-methods';
import { SubscriptionStatus } from '@/lib/types/stripe';
import { AlertCircle, Calendar, CheckCircle, CreditCard, RefreshCw, XCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function AssinaturaPage() {
  const [loading, setLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [subscriptionModalStep, setSubscriptionModalStep] = useState<'plan-selection' | 'payment-method' | 'add-card' | 'confirmation'>('plan-selection');
  
  const {
    subscription,
    isLoading: subscriptionLoading,
    error: subscriptionError,
    cancelSubscription,
    reactivateSubscription,
    refreshSubscription,
    clearError: clearSubscriptionError,
  } = useSubscriptionContext();
  
  const { 
    isLoading: paymentsLoading, 
    error: paymentError, 
    refreshPayments, 
    clearError: clearPaymentError 
  } = usePaymentContext();
  
  const { 
    isLoading: methodsLoading, 
    error: methodsError, 
    loadPaymentMethods, 
    clearError: clearMethodsError 
  } = usePaymentMethods();

  const handleMessage = useCallback((newMessage: { type: 'success' | 'error'; text: string }) => {
    if (newMessage.type === 'success') {
      toast.success(newMessage.text);
    } else {
      toast.error(newMessage.text);
    }
  }, []);

  const handleUpdatePaymentMethod = async () => {
    try {
      await loadPaymentMethods();
      await refreshPayments();
    } catch (error) {
      console.error('Erro ao atualizar métodos de pagamento:', error);
    }
  };

  const handleOpenPlanSelector = () => {
    setSubscriptionModalStep('plan-selection');
    setIsSubscriptionModalOpen(true);
  };

  const handleOpenAddCard = () => {
    setSubscriptionModalStep('add-card');
    setIsSubscriptionModalOpen(true);
  };

  const handleSubscriptionSuccess = async () => {
    try {
      await refreshSubscription();
      await refreshPayments();
      handleMessage({ type: 'success', text: 'Assinatura criada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar após assinatura:', error);
    }
  };

  const handlePaymentMethodSuccess = async () => {
    try {
      await loadPaymentMethods();
      await refreshPayments();
      handleMessage({ type: 'success', text: 'Método de pagamento adicionado com sucesso' });
      setIsPaymentModalOpen(false);
    } catch {
      handleMessage({ type: 'error', text: 'Erro ao adicionar método de pagamento' });
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) {
      handleMessage({ type: 'error', text: 'Nenhuma assinatura ativa encontrada' });
      return;
    }

    setLoading(true);
    try {
      await cancelSubscription();
      handleMessage({ type: 'success', text: 'Assinatura cancelada com sucesso' });
    } catch {
      handleMessage({ type: 'error', text: 'Erro ao cancelar assinatura' });
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) {
      handleMessage({ type: 'error', text: 'Nenhuma assinatura encontrada' });
      return;
    }

    setLoading(true);
    try {
      await reactivateSubscription();
      handleMessage({ type: 'success', text: 'Assinatura reativada com sucesso' });
    } catch {
      handleMessage({ type: 'error', text: 'Erro ao reativar assinatura' });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    clearSubscriptionError();
    clearPaymentError();
    clearMethodsError();
    refreshSubscription();
    refreshPayments();
            loadPaymentMethods();
  };

  const hasError = subscriptionError || paymentError || methodsError;
  const errorMessage = subscriptionError || paymentError || methodsError;
  const isLoading = subscriptionLoading || paymentsLoading || methodsLoading;

  const getStatusIcon = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case SubscriptionStatus.PAST_DUE:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case SubscriptionStatus.CANCELED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case SubscriptionStatus.TRIALING:
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return 'Ativa';
      case SubscriptionStatus.PAST_DUE:
        return 'Em atraso';
      case SubscriptionStatus.CANCELED:
        return 'Cancelada';
      case SubscriptionStatus.TRIALING:
        return 'Período de teste';
      case SubscriptionStatus.INCOMPLETE:
        return 'Incompleta';
      default:
        return 'Desconhecido';
    }
  };

  if (hasError) {
    return (
      <BillingErrorFallback 
        error={errorMessage || 'Erro desconhecido'} 
        onRetry={handleRetry} 
        isLoading={loading} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Assinatura</h1>
        <p className="text-gray-600">
          Gerencie sua assinatura, métodos de pagamento e histórico de transações.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <SubscriptionPlanCard />
              
              <div className="rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center">
                    <CreditCard className="mr-3 h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Status da Assinatura</h2>
                  </div>
                </div>
                <div className="p-6">
                  {subscription ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <div className="flex items-center">
                          {getStatusIcon(subscription.status)}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {getStatusText(subscription.status)}
                          </span>
                        </div>
                      </div>
                      
                      {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Início do período</span>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {new Date(subscription.currentPeriodStart).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">Fim do período</span>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {subscription.cancelAtPeriodEnd && (
                        <div className="rounded-md bg-yellow-50 p-4">
                          <div className="flex">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Assinatura será cancelada
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                  Sua assinatura será cancelada em{' '}
                                  {subscription.currentPeriodEnd 
                                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')
                                    : 'breve'
                                  }.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma assinatura ativa</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Você ainda não possui uma assinatura ativa.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PaymentMethodCard onUpdate={handleUpdatePaymentMethod} />
              
              <div className="rounded-lg bg-white shadow">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Ações</h2>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <UIButton
                    onClick={handleOpenPlanSelector}
                    loading={loading}
                    variant="solid"
                    size="md"
                    className="w-full bg-green-600 hover:bg-green-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Ver Planos e Assinar
                  </UIButton>

                  {/*
                  <UIButton
                    onClick={handleOpenAddCard}
                    loading={loading}
                    variant="outline"
                    size="md"
                    className="w-full border-blue-300 bg-white text-blue-700 hover:bg-blue-50">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Adicionar Cartão
                  </UIButton>
                  */}
                  
                  {subscription && !subscription.cancelAtPeriodEnd && subscription.planSlug !== 'FREE' && (
                    <UIButton
                      onClick={handleCancelSubscription}
                      loading={loading}
                      variant="outline"
                      size="md"
                      className="w-full border-red-300 bg-white text-red-700 hover:bg-red-50">
                      Cancelar Assinatura
                    </UIButton>
                  )}

                  {subscription && subscription.planSlug === 'FREE' && (
                    <div className="rounded-md bg-gray-50 p-4">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-800">
                            Plano Gratuito
                          </h3>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>
                              O cancelamento não está disponível para o plano gratuito.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {subscription && subscription.cancelAtPeriodEnd && (
                    <UIButton
                      onClick={handleReactivateSubscription}
                      loading={loading}
                      variant="solid"
                      size="md"
                      className="w-full bg-green-600 hover:bg-green-700">
                      Reativar Assinatura
                    </UIButton>
                  )}
                </div>
              </div>
            </div>
          </div>

          <PaymentHistoryCard />
        </>
      )}

      <ApiPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentMethodSuccess}
        title="Adicionar Método de Pagamento"
        subtitle="Adicione um novo cartão de crédito para pagamentos seguros"
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSuccess={handleSubscriptionSuccess}
        initialStep={subscriptionModalStep}
      />
    </div>
  );
}
