'use client';

import { cn } from '@/utils/cn';
import { useEffect, useRef, useState } from 'react';

export default function FormTextarea({
  label,
  name,
  placeholder,
  initialValue = '',
  value,
  required = false,
  disabled,
  onChange,
  resize = true,
  rows = 4,
}: Readonly<{
  label?: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  resize?: boolean;
  rows?: number;
  onChange: (value: string, name: string) => void;
}>) {
  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (!isControlled && onChangeRef.current) {
      onChangeRef.current(internalValue, name);
    }
  }, [internalValue, name, isControlled]);

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
  }, [initialValue, isControlled]);
  
  useEffect(() => {
    if (isControlled && onChangeRef.current) {
      onChangeRef.current(value || '', name);
    }
  }, [value, name, isControlled]);

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={displayValue}
        onChange={(e) => {
          const newValue = e.target.value;
          if (isControlled) {
            if (onChangeRef.current) {
              onChangeRef.current(newValue, name);
            }
          } else {
            setInternalValue(newValue);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
          !resize && 'resize-none',
        )}
      />
    </div>
  );
}
