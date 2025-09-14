'use server';

import { PaymentResponse, ProcessPaymentRequest, CreatePaymentDto, UpdatePaymentDto } from '@/lib/types/stripe';
import { apiRequest } from './config';

export async function createPayment(data: CreatePaymentDto): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>('/payments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPaymentById(id: number): Promise<PaymentResponse | null> {
  return apiRequest<PaymentResponse | null>(`/payments/${id}`);
}

export async function getMyPayments(): Promise<PaymentResponse[]> {
  return apiRequest<PaymentResponse[]>('/payments/user/me');
}

export async function getPaymentsByUserId(userId: number): Promise<PaymentResponse[]> {
  return apiRequest<PaymentResponse[]>(`/payments/user/${userId}`);
}

export async function updatePayment(id: number, data: UpdatePaymentDto): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function processPayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
  return apiRequest<PaymentResponse>('/payments/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
