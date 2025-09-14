import {
  SubscriptionResponse,
  SubscriptionPlanResponse,
  CreateUserSubscriptionDto,
  UpdateUserSubscriptionDto,
} from '@/lib/types/stripe';
import { cache, cacheKeys } from '@/lib/utils/cache';
import { apiRequest } from './config';

class SubscriptionsAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      return await apiRequest<T>(endpoint, options);
    } catch (error) {
      throw error;
    }
  }

  async createSubscription(data: CreateUserSubscriptionDto): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>('/user-subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubscriptionById(id: number): Promise<SubscriptionResponse | null> {
    return this.request<SubscriptionResponse | null>(`/user-subscriptions/${id}`);
  }

  async getMySubscription(): Promise<SubscriptionResponse | null> {
    const cached = cache.get<SubscriptionResponse | null>(cacheKeys.subscriptions.current);
    if (cached !== null) return cached;

    const data = await this.request<SubscriptionResponse | null>('/user-subscriptions/user/me');
    cache.set(cacheKeys.subscriptions.current, data);
    return data;
  }

  async getSubscriptionByUserId(userId: number): Promise<SubscriptionResponse | null> {
    return this.request<SubscriptionResponse | null>(`/user-subscriptions/user/${userId}`);
  }

  async updateSubscription(id: number, data: UpdateUserSubscriptionDto): Promise<SubscriptionResponse> {
    return this.request<SubscriptionResponse>(`/user-subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAllPlans(): Promise<SubscriptionPlanResponse[]> {
    const cached = cache.get<SubscriptionPlanResponse[]>(cacheKeys.plans.list);
    if (cached) return cached;

    const data = await this.request<SubscriptionPlanResponse[]>('/subscription-plans');
    cache.set(cacheKeys.plans.list, data, 10 * 60 * 1000);
    return data;
  }

  async getPlanById(id: number): Promise<SubscriptionPlanResponse | null> {
    return this.request<SubscriptionPlanResponse | null>(`/subscription-plans/${id}`);
  }

  async getPlanBySlug(slug: string): Promise<SubscriptionPlanResponse | null> {
    return this.request<SubscriptionPlanResponse | null>(`/subscription-plans/slug/${slug}`);
  }
}

export const subscriptionsAPI = new SubscriptionsAPI();
