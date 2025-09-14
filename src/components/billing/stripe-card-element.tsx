'use client';

import { CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent, StripeCardElementOptions } from '@stripe/stripe-js';

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '500',
      lineHeight: '1.5',
      '::placeholder': {
        color: '#9CA3AF',
        fontWeight: '400',
      },
      ':-webkit-autofill': {
        color: '#374151',
        backgroundColor: 'transparent',
      },
    },
    invalid: {
      color: '#DC2626',
      iconColor: '#DC2626',
    },
    complete: {
      color: '#059669',
    },
  },
  hidePostalCode: true,
  classes: {
    focus: 'focused',
    invalid: 'invalid',
    complete: 'complete',
  },
};



interface StripeCardElementProps {
  onChange?: (event: StripeCardElementChangeEvent) => void;
}

export default function StripeCardElement({ onChange }: StripeCardElementProps) {
  return (
    <div className="w-full">
      <CardElement
        options={cardElementOptions}
        onChange={onChange}
        className="w-full !px-3 !py-2.5 border border-gray-300 rounded-lg shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 hover:border-gray-400 bg-white"
      />
      <style jsx global>{`
        .StripeElement {
          padding: 0;
          border-radius: 8px;
        }
        .StripeElement--focused {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .StripeElement--invalid {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .StripeElement--complete {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }
        .StripeElement input {
          font-weight: 500;
          text-align: left;
        }
        .StripeElement .__PrivateStripeElement {
          text-align: left;
        }
      `}</style>
    </div>
  );
}
