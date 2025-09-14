'use server';

import { SubscriptionPlanData } from '@/lib/types/api';
import {
  CreateUserSubscriptionDto,
  SubscriptionPlanResponse,
  SubscriptionResponse,
  UpdateUserSubscriptionDto,
} from '@/lib/types/stripe';
import { apiRequest } from './config';

export async function createSubscription(data: CreateUserSubscriptionDto): Promise<SubscriptionResponse> {
  return apiRequest<SubscriptionResponse>('/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSubscriptionById(id: number): Promise<SubscriptionResponse | null> {
  return apiRequest<SubscriptionResponse | null>(`/user-subscriptions/${id}`);
}

export async function getMySubscription(): Promise<SubscriptionResponse | null> {
  return apiRequest<SubscriptionResponse | null>('/subscriptions/me');
}

export async function getSubscriptionByUserId(userId: number): Promise<SubscriptionResponse | null> {
  return apiRequest<SubscriptionResponse | null>(`/user-subscriptions/user/${userId}`);
}

export async function updateSubscription(id: number, data: UpdateUserSubscriptionDto): Promise<SubscriptionResponse> {
  return apiRequest<SubscriptionResponse>(`/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

function transformPlanData(planData: SubscriptionPlanData): SubscriptionPlanResponse {
  let features: string[] = [];
  
  if (planData.features) {
    if (typeof planData.features === 'string' && planData.features.trim().length > 0) {
      // Tenta diferentes separadores
      if (planData.features.includes(',')) {
        features = planData.features.split(',').map(f => f.trim()).filter(f => f.length > 0);
      } else if (planData.features.includes(';')) {
        features = planData.features.split(';').map(f => f.trim()).filter(f => f.length > 0);
      } else if (planData.features.includes('|')) {
        features = planData.features.split('|').map(f => f.trim()).filter(f => f.length > 0);
      } else {
        // Se não tem separadores óbvios, trata como um único item
        features = [planData.features.trim()];
      }
    } else if (Array.isArray(planData.features)) {
      features = planData.features.filter(f => f && f.trim().length > 0);
    }
  }

  return {
    id: planData.id,
    name: planData.name,
    slug: String(planData.slug),
    description: planData.description,
    price: planData.priceMonthly || 0,
    priceMonthly: planData.priceMonthly || 0,
    priceYearly: planData.priceYearly || 0,
    currency: 'BRL',
    interval: 'mês',
    features: features,
    isActive: planData.isActive,
    stripePriceId: planData.stripePriceIdMonthly,
    createdAt: planData.createdAt,
    updatedAt: planData.updatedAt,
  };
}

export async function getAllPlans(): Promise<SubscriptionPlanResponse[]> {
  const plansData = await apiRequest<SubscriptionPlanData[]>('/subscription-plans');
  return plansData.map(transformPlanData);
}

export async function getPlanById(id: number): Promise<SubscriptionPlanResponse | null> {
  const planData = await apiRequest<SubscriptionPlanData | null>(`/subscription-plans/${id}`);
  return planData ? transformPlanData(planData) : null;
}

export async function getPlanBySlug(slug: string): Promise<SubscriptionPlanResponse | null> {
  const planData = await apiRequest<SubscriptionPlanData | null>(`/subscription-plans/slug/${slug}`);
  return planData ? transformPlanData(planData) : null;
}

export async function cancelSubscription(cancelAtPeriodEnd: boolean = true): Promise<SubscriptionResponse> {
  return apiRequest<SubscriptionResponse>('/subscriptions/me', {
    method: 'DELETE',
    body: JSON.stringify({ cancelAtPeriodEnd }),
  });
}

export async function reactivateSubscription(): Promise<SubscriptionResponse> {
  return apiRequest<SubscriptionResponse>('/subscriptions/me/reactivate', {
    method: 'POST',
  });
}
