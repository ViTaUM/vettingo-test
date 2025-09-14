'use client';

import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';
import { Control, useController } from 'react-hook-form';

interface HookFormCheckboxProps {
  label: string;
  name: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
}

const HookFormCheckbox = ({
  label,
  name,
  disabled = false,
  control,
  error,
}: HookFormCheckboxProps) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  const errorMessage = error || fieldError?.message;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={name}
            {...field}
            checked={field.value}
            disabled={disabled}
            className="sr-only"
          />
          <label
            htmlFor={name}
            className={cn(
              'relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border-2 transition-all duration-200',
              field.value
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-gray-300 bg-white hover:border-gray-400',
              disabled && 'cursor-not-allowed opacity-50',
            )}>
            {field.value && (
              <Check
                className={cn('h-3 w-3 text-white transition-transform duration-200', field.value ? 'scale-100' : 'scale-0')}
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

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default HookFormCheckbox; 