export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  TRIALING = 'TRIALING',
  INCOMPLETE = 'INCOMPLETE',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export interface ProcessPaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
  subscriptionId?: string;
}

export interface PaymentResponse {
  id: number;
  userId: number;
  subscriptionId?: number;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDto {
  userId: number;
  subscriptionId?: number;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  metadata?: string;
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export interface UpdatePaymentDto {
  userId?: number;
  subscriptionId?: number;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  description?: string;
  metadata?: string;
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
}

export interface SubscriptionPlanResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  priceMonthly?: number;
  priceYearly?: number;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserSubscriptionDto {
  planSlug: string;
  paymentMethodId: string;
  couponCode?: string;
  period: string;
}

export interface UpdateUserSubscriptionDto {
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionResponse {
  id: number;
  userId: number;
  planId: number;
  planSlug: string;
  planName: string;
  status: SubscriptionStatus;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
  subscriptionPlan?: SubscriptionPlanResponse;
  // Campos para fluxo de pagamento Stripe
  clientSecret?: string;
  subscriptionId?: number;
}

export interface PaymentMethodData {
  id: number;
  userId: number;
  stripePaymentMethodId: string;
  type: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillingInfo {
  currentPlan?: SubscriptionResponse;
  paymentMethods: PaymentMethodData[];
  paymentHistory: PaymentResponse[];
  nextBilling?: Date;
}

export interface PaymentFormData {
  amount: number;
  currency: string;
  description?: string;
}

export interface StripeError {
  type: string;
  code?: string;
  message: string;
  param?: string;
}

export interface PaymentContextValue {
  payments: PaymentResponse[];
  isLoading: boolean;
  error: string | null;
  createPayment: (data: CreatePaymentDto) => Promise<PaymentResponse>;
  processPayment: (data: ProcessPaymentRequest) => Promise<PaymentResponse>;
  updatePayment: (id: number, data: UpdatePaymentDto) => Promise<PaymentResponse>;
  getPaymentById: (id: number) => Promise<PaymentResponse | null>;
  getPaymentHistory: () => Promise<PaymentResponse[]>;
  refreshPayments: () => Promise<PaymentResponse[]>;
  clearError: () => void;
}

export interface SubscriptionContextValue {
  subscription: SubscriptionResponse | null;
  plans: SubscriptionPlanResponse[];
  isLoading: boolean;
  error: string | null;
  createSubscription: (data: CreateUserSubscriptionDto) => Promise<SubscriptionResponse>;
  updateSubscription: (id: number, data: UpdateUserSubscriptionDto) => Promise<SubscriptionResponse>;
  cancelSubscription: () => Promise<SubscriptionResponse>;
  reactivateSubscription: () => Promise<SubscriptionResponse>;
  refreshSubscription: () => Promise<SubscriptionResponse | null>;
  loadPlans: () => Promise<SubscriptionPlanResponse[]>;
  clearError: () => void;
}

export interface PaymentIntentResult {
  paymentIntent?: {
    id: string;
    status: string;
    client_secret: string;
  };
  error?: StripeError;
}

export interface SetupIntentResult {
  setupIntent?: {
    id: string;
    status: string;
    client_secret: string;
  };
  error?: StripeError;
}
