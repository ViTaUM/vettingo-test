'use client';

import { cn } from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import UIButton from '@/components/ui/button';
import PasswordStrength from './password-strength';

export default function PasswordField({
  label,
  labelClassName,
  name,
  placeholder,
  initialValue = '',
  required = false,
  disabled,
  onChange,
  className,
  showStrength = false,
}: Readonly<{
  label?: string;
  labelClassName?: string;
  className?: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string, name: string) => void;
  showStrength?: boolean;
}>) {
  const [value, setValue] = useState<string>(initialValue);
  const [showPassword, setShowPassword] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onChange?.(newValue, name);
  };

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
          name={name}
          value={value}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-12 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
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

      {/* Indicador de força da senha */}
      {showStrength && <PasswordStrength password={value} />}
    </div>
  );
}
