'use server';

import { PaymentMethodData } from '@/lib/types/stripe';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from '@/lib/types/stripe-payment';
import { revalidateTag } from 'next/cache';
import { apiRequest } from './config';

export async function getMyPaymentMethods(): Promise<PaymentMethodData[]> {
  return apiRequest<PaymentMethodData[]>('/payment-methods/user/me', {
    next: {
      revalidate: 60,
      tags: ['payment-methods'],
    },
  });
}

export async function getPaymentMethodById(id: number): Promise<PaymentMethodData | null> {
  return apiRequest<PaymentMethodData | null>(`/payment-methods/${id}`, {
    next: {
      revalidate: 60,
      tags: ['payment-methods'],
    },
  });
}

export async function getDefaultPaymentMethod(): Promise<PaymentMethodData | null> {
  return apiRequest<PaymentMethodData | null>('/payment-methods/user/me/default', {
    next: {
      revalidate: 60,
      tags: ['payment-methods'],
    },
  });
}

export async function createPaymentMethod(data: CreatePaymentMethodDto): Promise<PaymentMethodData> {
  const result = await apiRequest<PaymentMethodData>('/payment-methods', {
    method: 'POST',
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  revalidateTag('payment-methods');
  return result;
}

export async function updatePaymentMethod(id: number, data: UpdatePaymentMethodDto): Promise<PaymentMethodData> {
  const result = await apiRequest<PaymentMethodData>(`/payment-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  revalidateTag('payment-methods');
  return result;
}

export async function deletePaymentMethod(id: number): Promise<void> {
  await apiRequest<void>(`/payment-methods/${id}`, {
    method: 'DELETE',
    cache: 'no-store',
  });

  revalidateTag('payment-methods');
}

export async function setDefaultPaymentMethod(id: number): Promise<PaymentMethodData> {
  const result = await apiRequest<PaymentMethodData>(`/payment-methods/${id}/default`, {
    method: 'PUT',
    cache: 'no-store',
  });

  revalidateTag('payment-methods');
  return result;
}
