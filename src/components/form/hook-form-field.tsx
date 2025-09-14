'use client';

import { cn } from '@/utils/cn';
import { HTMLInputTypeAttribute, forwardRef } from 'react';
import { Control, useController } from 'react-hook-form';

interface HookFormFieldProps {
  label?: string;
  labelClassName?: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  mask?: 'cpf' | 'phone' | 'cep' | 'none';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

const HookFormField = forwardRef<HTMLInputElement, HookFormFieldProps>(
  ({ label, labelClassName, name, type = 'text', placeholder, required = false, disabled, error, className, mask = 'none', control }, ref) => {
    const {
      field,
      fieldState: { error: fieldError },
    } = useController({
      name,
      control,
    });

    const errorMessage = error || fieldError?.message;

    const applyMask = (value: string, maskType: string): string => {
      if (maskType === 'cpf') {
        const numbers = value.replace(/\D/g, '').slice(0, 11);
        return numbers
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      if (maskType === 'phone') {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 8) {
          return numbers
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 9);
        } else {
          return numbers
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 10);
        }
      }
      if (maskType === 'cep') {
        const numbers = value.replace(/\D/g, '');
        return numbers
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 9);
      }
      return value;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask !== 'none') {
        const maskedValue = applyMask(e.target.value, mask);
        field.onChange(maskedValue);
      } else {
        field.onChange(e.target.value);
      }
    };

    return (
      <div className="mb-4 w-full last:mb-0">
        {label && (
          <label htmlFor={name} className={cn('mb-2 block text-sm font-medium text-gray-700', labelClassName)}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={name}
          type={type}
          {...field}
          ref={ref}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
            errorMessage
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            className,
          )}
        />
        {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  },
);

HookFormField.displayName = 'HookFormField';

export default HookFormField; 