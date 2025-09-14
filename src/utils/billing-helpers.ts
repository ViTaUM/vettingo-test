import { PaymentStatus, SubscriptionStatus } from '@/lib/types/stripe';

export interface BillingError extends Error {
  code?: string;
  type?: 'payment' | 'subscription' | 'network' | 'validation';
  retryable?: boolean;
}

export class BillingErrorHandler {
  static createError(
    message: string,
    type: 'payment' | 'subscription' | 'network' | 'validation' = 'payment',
    code?: string,
    retryable: boolean = false,
  ): BillingError {
    const error = new Error(message) as BillingError;
    error.type = type;
    error.code = code;
    error.retryable = retryable;
    return error;
  }

  static handleStripeError(stripeError: Record<string, unknown>): BillingError {
    const { type, code, message } = stripeError as { type: string; code: string; message: string };

    switch (type) {
      case 'card_error':
        return this.createError(
          this.getCardErrorMessage(code, message),
          'payment',
          code,
          ['insufficient_funds', 'expired_card'].includes(code),
        );

      case 'invalid_request_error':
        return this.createError('Erro na solicitação. Tente novamente.', 'validation', code, false);

      case 'api_error':
        return this.createError(
          'Erro temporário do servidor. Tente novamente em alguns minutos.',
          'network',
          code,
          true,
        );

      case 'authentication_error':
        return this.createError('Erro de autenticação. Entre em contato com o suporte.', 'payment', code, false);

      case 'rate_limit_error':
        return this.createError('Muitas tentativas. Aguarde alguns minutos e tente novamente.', 'network', code, true);

      default:
        return this.createError(message || 'Erro desconhecido no pagamento.', 'payment', code, false);
    }
  }

  private static getCardErrorMessage(code: string, originalMessage: string): string {
    const messages: Record<string, string> = {
      card_declined: 'Cartão recusado. Verifique os dados ou use outro cartão.',
      expired_card: 'Cartão expirado. Use um cartão válido.',
      incorrect_cvc: 'Código de segurança (CVC) incorreto.',
      incorrect_number: 'Número do cartão incorreto.',
      insufficient_funds: 'Saldo insuficiente. Verifique o limite do cartão.',
      invalid_cvc: 'Código de segurança (CVC) inválido.',
      invalid_expiry_month: 'Mês de expiração inválido.',
      invalid_expiry_year: 'Ano de expiração inválido.',
      invalid_number: 'Número do cartão inválido.',
      processing_error: 'Erro no processamento. Tente novamente.',
      generic_decline: 'Transação recusada pelo banco.',
    };

    return messages[code] || originalMessage || 'Erro no cartão de crédito.';
  }

  static handleNetworkError(error: Record<string, unknown>): BillingError {
    if ((error.name as string) === 'NetworkError' || !navigator.onLine) {
      return this.createError('Sem conexão com a internet. Verifique sua conexão.', 'network', 'network_error', true);
    }

    if ((error.status as number) === 429) {
      return this.createError('Muitas tentativas. Aguarde alguns minutos.', 'network', 'rate_limit', true);
    }

    if ((error.status as number) >= 500) {
      return this.createError('Erro temporário do servidor. Tente novamente.', 'network', 'server_error', true);
    }

    return this.createError('Erro de conexão. Tente novamente.', 'network', 'unknown_network', true);
  }
}

export class LoadingStateManager {
  private loadingStates: Map<string, boolean> = new Map();
  private listeners: Map<string, Set<(loading: boolean) => void>> = new Map();

  setLoading(key: string, loading: boolean): void {
    this.loadingStates.set(key, loading);
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach((listener) => listener(loading));
    }
  }

  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  subscribe(key: string, listener: (loading: boolean) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);

    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  reset(): void {
    this.loadingStates.clear();
    this.listeners.clear();
  }
}

export const globalLoadingManager = new LoadingStateManager();

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

export class RetryHandler {
  private static defaultConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2,
  };

  static async withRetry<T>(operation: () => Promise<T>, config: Partial<RetryConfig> = {}): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: unknown;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        const billingError = error as BillingError;
        if (billingError.retryable === false || attempt === finalConfig.maxRetries) {
          throw error;
        }

        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(finalConfig.backoffFactor, attempt),
          finalConfig.maxDelay,
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

export function getPaymentStatusInfo(status: PaymentStatus) {
  const statusMap = {
    [PaymentStatus.PENDING]: {
      color: 'text-yellow-700 bg-yellow-100',
      text: 'Pendente',
      description: 'Aguardando processamento',
    },
    [PaymentStatus.SUCCEEDED]: {
      color: 'text-green-700 bg-green-100',
      text: 'Pago',
      description: 'Pagamento realizado com sucesso',
    },
    [PaymentStatus.FAILED]: {
      color: 'text-red-700 bg-red-100',
      text: 'Falhou',
      description: 'Pagamento não foi processado',
    },
    [PaymentStatus.CANCELED]: {
      color: 'text-gray-700 bg-gray-100',
      text: 'Cancelado',
      description: 'Pagamento foi cancelado',
    },
    [PaymentStatus.REFUNDED]: {
      color: 'text-blue-700 bg-blue-100',
      text: 'Reembolsado',
      description: 'Valor foi estornado',
    },
  };

  return statusMap[status] || statusMap[PaymentStatus.PENDING];
}

export function getSubscriptionStatusInfo(status: SubscriptionStatus) {
  const statusMap = {
    [SubscriptionStatus.ACTIVE]: {
      color: 'text-green-700 bg-green-100',
      text: 'Ativo',
      description: 'Assinatura funcionando normalmente',
    },
    [SubscriptionStatus.TRIALING]: {
      color: 'text-blue-700 bg-blue-100',
      text: 'Período de teste',
      description: 'Em período de avaliação gratuita',
    },
    [SubscriptionStatus.PAST_DUE]: {
      color: 'text-yellow-700 bg-yellow-100',
      text: 'Atrasado',
      description: 'Pagamento em atraso',
    },
    [SubscriptionStatus.CANCELED]: {
      color: 'text-gray-700 bg-gray-100',
      text: 'Cancelado',
      description: 'Assinatura foi cancelada',
    },
    [SubscriptionStatus.INCOMPLETE]: {
      color: 'text-orange-700 bg-orange-100',
      text: 'Incompleto',
      description: 'Aguardando confirmação de pagamento',
    },
    [SubscriptionStatus.INACTIVE]: {
      color: 'text-red-700 bg-red-100',
      text: 'Inativo',
      description: 'Assinatura não está ativa',
    },
  };

  return statusMap[status] || statusMap[SubscriptionStatus.INACTIVE];
}

export function validatePaymentAmount(amount: number): string | null {
  if (amount <= 0) {
    return 'Valor deve ser maior que zero';
  }

  if (amount < 50) {
    return 'Valor mínimo é R$ 0,50';
  }

  if (amount > 999999999) {
    return 'Valor máximo excedido';
  }

  return null;
}

export function formatPaymentDescription(
  type: 'subscription' | 'one_time',
  planName?: string,
  period?: string,
): string {
  if (type === 'subscription' && planName) {
    return `Assinatura ${planName}${period ? ` - ${period}` : ''}`;
  }

  return 'Pagamento único';
}
