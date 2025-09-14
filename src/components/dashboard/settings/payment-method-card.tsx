'use client';

import ApiPaymentMethodModal from '@/components/billing/api-payment-method-modal';
import { usePaymentMethodsContext } from '@/contexts/payment-methods-context';
import { useState } from 'react';

interface PaymentMethodCardProps {
  onUpdate: () => void;
}

export default function PaymentMethodCard({ onUpdate }: PaymentMethodCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { paymentMethods, isLoading, error, removePaymentMethod, setDefaultPaymentMethod } = usePaymentMethodsContext();

  const handleAddPaymentMethod = (paymentMethodId: string) => {
    console.log('Novo método de pagamento:', paymentMethodId);
    onUpdate();
    setIsModalOpen(false);
  };

  const handleDeletePaymentMethod = async (paymentMethodId: number) => {
    try {
      await removePaymentMethod(paymentMethodId);
      onUpdate();
    } catch (error) {
      console.error('Erro ao excluir método de pagamento:', error);
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: number) => {
    try {
      await setDefaultPaymentMethod(paymentMethodId);
      onUpdate();
    } catch (error) {
      console.error('Erro ao definir método padrão:', error);
    }
  };

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

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="py-4 text-center">
          <div className="mx-auto h-8 w-8 text-red-400">⚠️</div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar métodos de pagamento</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Métodos de Pagamento</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer">
            Adicionar Cartão
          </button>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Nenhum método de pagamento cadastrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {method.brand.toUpperCase()} •••• {method.last4}
                    </p>
                    <p className="text-gray-500">
                      Expira {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                  {method.isDefault && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Padrão
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefaultPaymentMethod(method.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      Definir como padrão
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className="text-sm text-red-600 hover:text-red-800 cursor-pointer">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
                      Seus dados de pagamento são processados de forma segura pela nossa API e nunca são armazenados em nossos
          servidores.
        </p>
      </div>

              <ApiPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddPaymentMethod}
      />
    </div>
  );
}
