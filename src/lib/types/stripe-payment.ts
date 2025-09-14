export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details?: {
    name?: string;
  };
}

export interface StripeSetupIntent {
  id: string;
  client_secret: string;
  status: string;
  payment_method?: StripePaymentMethod;
}

export interface StripeSetupIntentResponse {
  setupIntent: StripeSetupIntent;
}

export interface CreatePaymentMethodDto {
  stripePaymentMethodId: string;
  type: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface UpdatePaymentMethodDto {
  type?: string;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface ValidateCardDto {
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface ValidateCardResponse {
  success: boolean;
  valid: boolean;
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
  error?: string;
  errorCode?: string;
}

export interface CreateSetupIntentDto {
  metadata?: {
    cardholderName?: string;
    cardType?: string;
    userId?: string;
    cpf?: string;
  };
}

export interface CreateSetupIntentResponse {
  success: boolean;
  clientSecret?: string;
  setupIntentId?: string;
  error?: string;
}
