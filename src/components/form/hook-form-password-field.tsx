'use client';

import { cn } from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import UIButton from '@/components/ui/button';
import PasswordStrength from './password-strength';

interface HookFormPasswordFieldProps {
  label?: string;
  labelClassName?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  showStrength?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
}

const HookFormPasswordField = forwardRef<HTMLInputElement, HookFormPasswordFieldProps>(
  ({ 
    label, 
    labelClassName, 
    name, 
    placeholder, 
    required = false, 
    disabled, 
    error, 
    className, 
    showStrength = false, 
    control 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
      field,
      fieldState: { error: fieldError },
    } = useController({
      name,
      control,
    });

    const errorMessage = error || fieldError?.message;

    return (
      <div className="mb-4 w-full last:mb-0">
        {label && (
          <label htmlFor={name} className={cn('mb-2 block text-sm font-medium text-gray-700', labelClassName)}>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={name}
            type={showPassword ? 'text' : 'password'}
            {...field}
            ref={ref}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border px-3 py-2.5 pr-12 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
              errorMessage
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
              className,
            )}
          />
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 p-0 transition-all duration-200 hover:bg-gray-100"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}>
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500 transition-all duration-200" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500 transition-all duration-200" />
            )}
          </UIButton>
        </div>

        {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}

        {showStrength && <PasswordStrength password={field.value || ''} />}
      </div>
    );
  },
);

HookFormPasswordField.displayName = 'HookFormPasswordField';

export default HookFormPasswordField; 