'use client';

import UIButton from '@/components/ui/button';
import { AlertCircle, CheckCircle, Download, Receipt } from 'lucide-react';
import { usePaymentContext } from '@/contexts/payment-context';
import { getPaymentStatusColor, getPaymentStatusText, formatCurrency, formatDate } from '@/lib/utils/error-handler';

export default function PaymentHistoryCard() {
  const { payments, isLoading, error } = usePaymentContext();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h3>
          </div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-4 rounded bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-200"></div>
                    <div className="h-3 w-32 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="h-4 w-20 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="py-4 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar histórico</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleDownloadInvoice = (paymentId: number) => {
    console.log('Download invoice for payment:', paymentId);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <Receipt className="mr-2 h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h3>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <Receipt className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pagamento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Seus pagamentos aparecerão aqui quando forem processados.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(payment.status)}
                  <div>
                    <p className="font-medium text-gray-900">{payment.description || 'Pagamento'}</p>
                    <p className="text-sm text-gray-500">
                      ID: {payment.id} • {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">
                    {payment.amount && !isNaN(payment.amount) ? formatCurrency(payment.amount, payment.currency) : 'R$ 0,00'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                    {getPaymentStatusText(payment.status)}
                  </span>
                  <UIButton
                    onClick={() => handleDownloadInvoice(payment.id)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700">
                    <Download className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>
            ))}
          </div>

          {payments.length > 5 && (
            <div className="mt-4 text-center">
              <UIButton variant="outline" size="md" className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Ver Todos os Pagamentos ({payments.length})
              </UIButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
