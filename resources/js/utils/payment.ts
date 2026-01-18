export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  PAYSTACK: 'paystack',
  FLUTTERWAVE: 'flutterwave',
  BANK: 'bank',
  SKRILL: 'skrill',
  COINGATE: 'coingate'
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.STRIPE]: 'Credit Card (Stripe)',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.PAYSTACK]: 'Paystack',
  [PAYMENT_METHODS.FLUTTERWAVE]: 'Flutterwave',
  [PAYMENT_METHODS.BANK]: 'Bank Transfer',
  [PAYMENT_METHODS.SKRILL]: 'Skrill',
  [PAYMENT_METHODS.COINGATE]: 'CoinGate'
} as const;

export const PAYMENT_METHOD_HELP_URLS = {
  [PAYMENT_METHODS.STRIPE]: 'https://dashboard.stripe.com/apikeys',
  [PAYMENT_METHODS.PAYPAL]: 'https://developer.paypal.com/home',
  [PAYMENT_METHODS.PAYSTACK]: 'https://dashboard.paystack.com/#/settings/developers',
  [PAYMENT_METHODS.FLUTTERWAVE]: 'https://dashboard.flutterwave.com/settings/apis',
  [PAYMENT_METHODS.SKRILL]: 'https://www.skrill.com/en/business/',
  [PAYMENT_METHODS.COINGATE]: 'https://coingate.com/api/docs'
} as const;

export const PAYMENT_MODES = {
  SANDBOX: 'sandbox',
  LIVE: 'live'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
export type PaymentMode = typeof PAYMENT_MODES[keyof typeof PAYMENT_MODES];

export interface PaymentConfig {
  enabled: boolean;
  mode?: PaymentMode;
  [key: string]: any;
}

export interface PaymentFormData {
  planId: number;
  planPrice: number;
  couponCode?: string;
  billingCycle: 'monthly' | 'yearly';
}

export function formatPaymentAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function validatePaymentMethodCredentials(method: PaymentMethod, config: any): string[] {
  const errors: string[] = [];

  switch (method) {
    case PAYMENT_METHODS.STRIPE:
      if (!config.key) errors.push('Stripe publishable key is required');
      if (!config.secret) errors.push('Stripe secret key is required');
      break;

    case PAYMENT_METHODS.PAYPAL:
      if (!config.client_id) errors.push('PayPal client ID is required');
      if (!config.secret) errors.push('PayPal secret key is required');
      break;

    case PAYMENT_METHODS.PAYSTACK:
      if (!config.public_key) errors.push('Paystack public key is required');
      if (!config.secret_key) errors.push('Paystack secret key is required');
      break;

    case PAYMENT_METHODS.FLUTTERWAVE:
      if (!config.public_key) errors.push('Flutterwave public key is required');
      if (!config.secret_key) errors.push('Flutterwave secret key is required');
      break;

    case PAYMENT_METHODS.BANK:
      if (!config.details) errors.push('Bank details are required');
      break;

    case PAYMENT_METHODS.SKRILL:
      if (!config.merchant_id) errors.push('Skrill merchant ID is required');
      if (!config.secret_word) errors.push('Skrill secret word is required');
      break;

    case PAYMENT_METHODS.COINGATE:
      if (!config.api_token) errors.push('CoinGate API token is required');
      break;
  }

  return errors;
}

export function getPaymentMethodIcon(method: PaymentMethod): string {
  const icons = {
    [PAYMENT_METHODS.STRIPE]: 'credit-card',
    [PAYMENT_METHODS.PAYPAL]: 'credit-card',
    [PAYMENT_METHODS.PAYSTACK]: 'credit-card',
    [PAYMENT_METHODS.FLUTTERWAVE]: 'credit-card',
    [PAYMENT_METHODS.BANK]: 'banknote',
    [PAYMENT_METHODS.SKRILL]: 'wallet',
    [PAYMENT_METHODS.COINGATE]: 'coins'
  };

  return icons[method] || 'credit-card';
}