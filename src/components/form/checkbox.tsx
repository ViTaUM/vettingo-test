'use client';

import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

export default function FormCheckbox({
  label,
  name,
  value = false,
  onChange,
  disabled = false,
}: Readonly<{
  label: string;
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}>) {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={name}
          className={cn(
            'relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-200',
            value
              ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
              : 'border-gray-300 bg-white hover:border-gray-400',
            disabled && 'cursor-not-allowed opacity-50',
          )}>
          {value && (
            <Check
              className={cn('h-3 w-3 text-white transition-transform duration-200', value ? 'scale-100' : 'scale-0')}
            />
          )}
        </label>
      </div>
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'ml-2 cursor-pointer text-sm font-medium text-gray-700 select-none',
            disabled && 'cursor-not-allowed opacity-50',
          )}>
          {label}
        </label>
      )}
    </div>
  );
}
