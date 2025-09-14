export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export class PaymentError extends Error {
  code?: string;
  status?: number;
  details?: unknown;

  constructor(message: string, code?: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class SubscriptionError extends Error {
  code?: string;
  status?: number;
  details?: unknown;

  constructor(message: string, code?: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'SubscriptionError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: (error as unknown as Record<string, unknown>).code as string,
      status: (error as unknown as Record<string, unknown>).status as number,
      details: (error as unknown as Record<string, unknown>).details,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: 'Erro desconhecido' };
}

export function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError;
}

export function isSubscriptionError(error: unknown): error is SubscriptionError {
  return error instanceof SubscriptionError;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as Record<string, unknown>).message);
  }

  return 'Erro desconhecido';
}

export function formatCurrency(amount: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

export function getPaymentStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return 'text-green-700 bg-green-100';
    case 'pending':
      return 'text-yellow-700 bg-yellow-100';
    case 'failed':
      return 'text-red-700 bg-red-100';
    case 'canceled':
      return 'text-gray-700 bg-gray-100';
    case 'refunded':
      return 'text-blue-700 bg-blue-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

export function getPaymentStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'succeeded':
      return 'Pago';
    case 'pending':
      return 'Pendente';
    case 'failed':
      return 'Falhou';
    case 'canceled':
      return 'Cancelado';
    case 'refunded':
      return 'Reembolsado';
    default:
      return 'Desconhecido';
  }
}

export function getSubscriptionStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'text-green-700 bg-green-100';
    case 'trialing':
      return 'text-blue-700 bg-blue-100';
    case 'past_due':
      return 'text-yellow-700 bg-yellow-100';
    case 'canceled':
      return 'text-gray-700 bg-gray-100';
    case 'incomplete':
      return 'text-orange-700 bg-orange-100';
    case 'inactive':
      return 'text-red-700 bg-red-100';
    default:
      return 'text-gray-700 bg-gray-100';
  }
}

export function getSubscriptionStatusText(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Ativo';
    case 'trialing':
      return 'Período de teste';
    case 'past_due':
      return 'Atrasado';
    case 'canceled':
      return 'Cancelado';
    case 'incomplete':
      return 'Incompleto';
    case 'inactive':
      return 'Inativo';
    default:
      return 'Desconhecido';
  }
}
