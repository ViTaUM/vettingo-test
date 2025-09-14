'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import UIButton from '@/components/ui/button';

interface BillingErrorFallbackProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export default function BillingErrorFallback({ error, onRetry, isLoading = false }: BillingErrorFallbackProps) {
  const isAuthError = error.includes('401') || error.includes('Unauthorized');

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="py-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />

        {isAuthError ? (
          <>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Sessão Expirada</h3>
            <p className="mt-2 text-sm text-gray-600">Sua sessão expirou. Faça login novamente para continuar.</p>
          </>
        ) : (
          <>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Erro ao Carregar Dados</h3>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </>
        )}

        <div className="mt-6">
          <UIButton
            onClick={onRetry}
            loading={isLoading}
            variant="solid"
            size="md"
            className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </UIButton>
        </div>
      </div>
    </div>
  );
}
