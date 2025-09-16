'use client';

import UIButton from '@/components/ui/button';
import { usePaymentMethodsContext } from '@/contexts/payment-methods-context';
import { useSubscriptionPlans } from '@/hooks/use-subscriptions';
import { createSubscription } from '@/lib/api/subscriptions-client';
import { SubscriptionPlanResponse } from '@/lib/types/stripe';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Check, CreditCard, Crown, Shield, Star } from 'lucide-react';
import { Fragment, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AddCardForm from './add-card-form';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStep?: Step;
}



type Step = 'plan-selection' | 'payment-method' | 'add-card' | 'confirmation';

export default function SubscriptionModal({ isOpen, onClose, onSuccess, initialStep = 'plan-selection' }: SubscriptionModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanResponse | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const { plans } = useSubscriptionPlans();
  const { paymentMethods } = usePaymentMethodsContext();

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
    }
  }, [isOpen, initialStep]);

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case 'BASIC':
        return <Shield className="h-6 w-6" />;
      case 'PRO':
        return <Crown className="h-6 w-6" />;
      case 'ENTERPRISE':
        return <Star className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (slug: string) => {
    switch (slug) {
      case 'BASIC':
        return 'blue';
      case 'PRO':
        return 'purple';
      case 'ENTERPRISE':
        return 'emerald';
      default:
        return 'blue';
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handlePlanSelect = (plan: SubscriptionPlanResponse) => {
    if (plan.slug === 'FREE') {
      toast.error('O plano gratuito não pode ser contratado diretamente');
      return;
    }
    setSelectedPlan(plan);
    setCurrentStep('payment-method');
  };

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId);
    setCurrentStep('confirmation');
  };

  const handleBack = () => {
    if (currentStep === 'confirmation') {
      setCurrentStep('add-card');
    } else if (currentStep === 'add-card') {
      setCurrentStep('payment-method');
    } else if (currentStep === 'payment-method') {
      setCurrentStep('plan-selection');
    }
  };

  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedPaymentMethod) {
      toast.error('Selecione um plano e método de pagamento');
      return;
    }

    setIsProcessing(true);
    try {
      await createSubscription({
        planSlug: selectedPlan.slug,
        paymentMethodId: selectedPaymentMethod,
      });

      toast.success('Assinatura criada com sucesso!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao criar assinatura. Tente novamente.');
      console.error('Erro na assinatura:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(initialStep);
    setSelectedPlan(null);
    setSelectedPaymentMethod(null);
    onClose();
  };

  const handleAddCard = () => {
    setCurrentStep('add-card');
  };

  const handleAddCardSubmit = (cardData: any) => {
    // TODO: Implementar lógica para salvar o cartão
    toast.success('Cartão adicionado com sucesso!');
    setCurrentStep('confirmation');
  };

  const renderPlanSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Escolha seu Plano</h3>
        <p className="text-sm text-gray-600 mt-1">Selecione o plano ideal para suas necessidades</p>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setPeriod('month')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'month'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Mensal
        </button>
        <button
          onClick={() => setPeriod('year')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'year'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          Anual
          <span className="ml-1 text-xs text-green-600">-17%</span>
        </button>
      </div>

      <div className="grid gap-4">
        {plans
          .filter((plan) => plan.slug !== 'FREE')
          .map((plan) => {
            const color = getPlanColor(plan.slug);
                         const price = period === 'month' ? (plan.priceMonthly || plan.price || 0) : (plan.priceYearly || plan.price || 0);
            const isPopular = plan.slug === 'PRO';

            return (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                  isPopular ? `border-${color}-300 bg-gradient-to-r ${getColorClasses(color)} text-white` : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}

                                 <div className="flex items-start justify-between mb-4">
                   <div className="flex items-center space-x-3">
                     <div className={`p-2 rounded-lg ${isPopular ? 'bg-white/20' : 'bg-gray-100'}`}>
                       {getPlanIcon(plan.slug)}
                     </div>
                     <div>
                       <h4 className={`font-semibold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                         {plan.name}
                       </h4>
                       <p className={`text-sm ${isPopular ? 'text-white/80' : 'text-gray-600'}`}>
                         {plan.description || 'Descrição não disponível'}
                       </p>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className={`text-2xl font-bold ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                       {formatPrice(price)}
                     </div>
                     <div className={`text-sm ${isPopular ? 'text-white/80' : 'text-gray-500'}`}>
                       /{period === 'month' ? 'mês' : 'ano'}
                     </div>
                   </div>
                 </div>

                <div className="mb-4">
                  <h5 className={`font-medium mb-2 ${isPopular ? 'text-white' : 'text-gray-900'}`}>
                    Incluído no plano:
                  </h5>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className={`flex items-center text-sm ${isPopular ? 'text-white/90' : 'text-gray-600'}`}>
                        <Check className={`mr-2 h-4 w-4 flex-shrink-0 ${isPopular ? 'text-white' : 'text-green-500'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                    isPopular
                      ? 'bg-white text-gray-900 hover:bg-gray-50'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  Escolher Plano
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Método de Pagamento</h3>
        <p className="text-sm text-gray-600 mt-1">Escolha como deseja pagar</p>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Você não possui métodos de pagamento cadastrados</p>
          <button
            onClick={handleAddCard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Adicionar Cartão
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentMethodSelect(method.stripePaymentMethodId)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentMethod === method.stripePaymentMethodId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.brand.toUpperCase()} •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expira {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Padrão
                    </span>
                  )}
                  {selectedPaymentMethod === method.stripePaymentMethodId && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Confirmar Assinatura</h3>
        <p className="text-sm text-gray-600 mt-1">Revise os detalhes antes de confirmar</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plano:</span>
          <span className="font-medium text-gray-900">{selectedPlan?.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Período:</span>
          <span className="font-medium text-gray-900 capitalize">{period}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Valor:</span>
          <span className="font-medium text-gray-900">
                         {selectedPlan && formatPrice(
               period === 'month' ? (selectedPlan.priceMonthly || selectedPlan.price || 0) : (selectedPlan.priceYearly || selectedPlan.price || 0)
             )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Método de pagamento:</span>
          <span className="font-medium text-gray-900">
            {paymentMethods.find(m => m.stripePaymentMethodId === selectedPaymentMethod)?.brand.toUpperCase()} Cartão de Crédito {paymentMethods.find(m => m.stripePaymentMethodId === selectedPaymentMethod)?.last4}
          </span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Pagamento Seguro</p>
            <p>Sua assinatura será processada pelo Stripe com criptografia bancária.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'plan-selection':
        return 'Escolher Plano';
      case 'payment-method':
        return 'Método de Pagamento';
      case 'add-card':
        return 'Adicionar Cartão';
      case 'confirmation':
        return 'Confirmar Assinatura';
      default:
        return 'Assinatura';
    }
  };

  const canGoBack = currentStep !== 'plan-selection' && currentStep !== initialStep;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Crown className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h2>
                        <p className="text-sm text-gray-600 mt-1">Fluxo de assinatura em {currentStep === 'plan-selection' ? '1' : currentStep === 'payment-method' ? '2' : currentStep === 'add-card' ? '3' : '3'} de 3 passos</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {currentStep === 'plan-selection' && renderPlanSelection()}
                  {currentStep === 'payment-method' && renderPaymentMethodSelection()}
                  {currentStep === 'add-card' && (
                    <AddCardForm
                      onBack={handleBack}
                      onSubmit={handleAddCardSubmit}
                    />
                  )}
                  {currentStep === 'confirmation' && renderConfirmation()}
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  {canGoBack && (
                    <UIButton
                      onClick={handleBack}
                      variant="outline"
                      size="md"
                      disabled={isProcessing}>
                      Voltar
                    </UIButton>
                  )}
                  
                  <div className="flex space-x-3 ml-auto">
                    <UIButton
                      onClick={handleClose}
                      variant="outline"
                      size="md"
                      disabled={isProcessing}>
                      Cancelar
                    </UIButton>
                    
                    {currentStep === 'confirmation' && (
                      <UIButton
                        onClick={handleSubscribe}
                        loading={isProcessing}
                        variant="solid"
                        size="md"
                        className="bg-green-600 hover:bg-green-700">
                        Confirmar Assinatura
                      </UIButton>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
