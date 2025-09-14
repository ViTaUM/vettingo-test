'use server';

import {
    CreateSetupIntentDto,
    CreateSetupIntentResponse,
    ValidateCardDto,
    ValidateCardResponse
} from '@/lib/types/stripe-payment';
import { apiRequest } from './config';

export async function createPaymentIntent(data: {
  amount: number;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}) {
  return apiRequest<{
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
  }>('/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmPayment(data: {
  paymentIntentId: string;
  paymentMethodId: string;
}) {
  return apiRequest<{
    success: boolean;
    status?: string;
    paymentId?: number;
    error?: string;
  }>('/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createSetupIntent(data: CreateSetupIntentDto): Promise<CreateSetupIntentResponse> {
  return apiRequest<CreateSetupIntentResponse>('/payment-methods/create-setup-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function validateCard(data: ValidateCardDto): Promise<ValidateCardResponse> {
  return apiRequest<ValidateCardResponse>('/payment-methods/validate-card', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
