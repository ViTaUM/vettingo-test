'use client';

import { cn } from '@/utils/cn';
import { Control, useController } from 'react-hook-form';

interface HookFormTextareaProps {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  resize?: boolean;
  rows?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
  hasCustomValidation?: boolean;
}

const HookFormTextarea = ({
  label,
  name,
  placeholder,
  required = false,
  disabled,
  resize = true,
  rows = 4,
  control,
  error,
  hasCustomValidation = false,
}: HookFormTextareaProps) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  const errorMessage = error || fieldError?.message;

  return (
    <div className={!hasCustomValidation ? "mb-4" : ""}>
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        {...field}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
          !resize && 'resize-none',
          errorMessage && 'border-red-300 focus:border-red-500 focus:ring-red-500/20',
        )}
      />
      {errorMessage && !hasCustomValidation && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default HookFormTextarea; 