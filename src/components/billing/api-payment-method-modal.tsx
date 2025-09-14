'use client';

import UIButton from '@/components/ui/button';
import { createPaymentMethod } from '@/lib/api/payment-methods-client';
import stripePromise from '@/lib/stripe';
import { CreatePaymentMethodDto } from '@/lib/types/stripe-payment';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js';

import { CreditCard, Shield } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import StripeCardElement from './stripe-card-element';

interface ApiPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentMethodId: string) => void;
  title?: string;
  subtitle?: string;
}

interface FormData {
  cardholderName: string;
  cpf: string;
}

function PaymentMethodForm({ onClose, onSuccess }: Omit<ApiPaymentMethodModalProps, 'isOpen'>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      cardholderName: '',
      cpf: '',
    },
  });



  const onSubmit = async (data: FormData) => {
    console.log(data);

    if (!stripe || !elements) {
      setError('Stripe não está carregado');
      return;
    }

    if (!data.cardholderName.trim() || !data.cpf.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement('card');
      if (!cardElement) {
        throw new Error('Elemento do cartão não encontrado');
      }

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: data.cardholderName,
        },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao criar método de pagamento');
      }

      if (!paymentMethod) {
        throw new Error('PaymentMethod não foi criado');
      }

      const paymentMethodData: CreatePaymentMethodDto = {
        stripePaymentMethodId: paymentMethod.id,
        type: paymentMethod.type,
        brand: paymentMethod.card?.brand || 'unknown',
        last4: paymentMethod.card?.last4 || '',
        expMonth: paymentMethod.card?.exp_month || 0,
        expYear: paymentMethod.card?.exp_year || 0,
        isDefault: true,
      };

      console.log('Dados para enviar ao backend:', paymentMethodData);

      const savedPaymentMethod = await createPaymentMethod(paymentMethodData);

      toast.success('Método de pagamento adicionado com sucesso!');
      onSuccess(savedPaymentMethod.stripePaymentMethodId);

      reset();

      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="cardholderName" className="mb-2 block text-left text-sm font-medium text-gray-700">
            Nome do Titular *
          </label>
          <input
            {...register('cardholderName', { required: 'Nome do titular é obrigatório' })}
            type="text"
            placeholder="Nome completo"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {errors.cardholderName && <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>}
        </div>

        <div>
          <label htmlFor="cpf" className="mb-2 block text-left text-sm font-medium text-gray-700">
            CPF do Titular *
          </label>
          <input
            {...register('cpf', { required: 'CPF é obrigatório' })}
            type="text"
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          {errors.cpf && <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-left text-sm font-medium text-gray-700">Dados do Cartão *</label>
          <StripeCardElement />
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start space-x-3">
          <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="text-sm text-blue-800">
            <p className="mb-1 font-medium">Pagamento Seguro</p>
            <p>Seus dados são processados pelo Stripe com criptografia bancária.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm text-red-800">
              <p className="mb-1 font-medium">Erro ao processar</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <UIButton
          type="button"
          onClick={onClose}
          variant="outline"
          size="md"
          disabled={isProcessing}
          className="px-6 py-2.5">
          Cancelar
        </UIButton>
        <UIButton
          type="submit"
          disabled={!stripe || isProcessing}
          loading={isProcessing}
          variant="solid"
          size="md"
          className="bg-blue-600 px-6 py-2.5 hover:bg-blue-700">
          {isProcessing ? 'Processando...' : 'Adicionar Cartão'}
        </UIButton>
      </div>
    </form>
  );
}

export default function ApiPaymentMethodModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Adicionar Método de Pagamento',
  subtitle = 'Adicione um novo cartão de crédito para pagamentos seguros',
}: ApiPaymentMethodModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                      <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <Elements stripe={stripePromise}>
                    <PaymentMethodForm onClose={onClose} onSuccess={onSuccess} title={title} subtitle={subtitle} />
                  </Elements>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
