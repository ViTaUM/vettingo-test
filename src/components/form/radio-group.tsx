'use client';

import { cn } from '@/utils/cn';

type Option = {
  value: string;
  label: string;
};

type FormRadioGroupProps = {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function FormRadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
}: FormRadioGroupProps) {
  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
    }
  };

  return (
    <div className={cn('mb-4', className)}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={disabled}
              className="text-primary focus:ring-primary h-4 w-4 border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className={cn('ml-2 text-sm text-gray-700', disabled && 'cursor-not-allowed opacity-50')}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
