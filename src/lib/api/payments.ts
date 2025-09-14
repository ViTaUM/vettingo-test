import { PaymentResponse, ProcessPaymentRequest, CreatePaymentDto, UpdatePaymentDto } from '@/lib/types/stripe';
import { cache, cacheKeys } from '@/lib/utils/cache';
import { apiRequest } from './config';

class PaymentsAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error) {
      throw error;
    }
  }

  async createPayment(data: CreatePaymentDto): Promise<PaymentResponse> {
    const result = await this.request<PaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    cache.invalidate(cacheKeys.payments.list);
    return result;
  }

  async getPaymentById(id: number): Promise<PaymentResponse | null> {
    return this.request<PaymentResponse | null>(`/payments/${id}`);
  }

  async getMyPayments(): Promise<PaymentResponse[]> {
    const cached = cache.get<PaymentResponse[]>(cacheKeys.payments.list);
    if (cached) return cached;

    const data = await this.request<PaymentResponse[]>('/payments/user/me');
    cache.set(cacheKeys.payments.list, data);
    return data;
  }

  async getPaymentsByUserId(userId: number): Promise<PaymentResponse[]> {
    return this.request<PaymentResponse[]>(`/payments/user/${userId}`);
  }

  async updatePayment(id: number, data: UpdatePaymentDto): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async processPayment(data: ProcessPaymentRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>('/payments/process', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const paymentsAPI = new PaymentsAPI();
