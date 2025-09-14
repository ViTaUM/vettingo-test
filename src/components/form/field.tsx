'use client';

import { cn } from '@/utils/cn';
import { HTMLInputTypeAttribute, useEffect, useState, useRef } from 'react';

export default function FormField({
  label,
  labelClassName,
  name,
  type = 'text',
  placeholder,
  initialValue = '',
  value,
  required = false,
  disabled,
  onChange,
  className,
}: Readonly<{
  label?: string;
  labelClassName?: string;
  className?: string;
  name: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  initialValue?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: string, name: string) => void;
}>) {
  const [internalValue, setInternalValue] = useState<string>(initialValue);
  const onChangeRef = useRef(onChange);

  // Manter a referência da função onChange sempre atualizada
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Se value está sendo passado, usar como valor controlado
  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  // Chamamos onChange apenas quando o valor interno muda (apenas para não controlado)
  useEffect(() => {
    if (!isControlled && onChangeRef.current) {
      onChangeRef.current(internalValue, name);
    }
  }, [internalValue, name, isControlled]);

  // Atualizar valor interno quando initialValue mudar (apenas para não controlado)
  useEffect(() => {
    if (!isControlled) {
      setInternalValue(initialValue);
    }
  }, [initialValue, isControlled]);

  // Para componentes controlados, chamar onChange quando value mudar
  useEffect(() => {
    if (isControlled && onChangeRef.current) {
      onChangeRef.current(value || '', name);
    }
  }, [value, name, isControlled]);

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
        name={name}
        value={displayValue}
        onChange={(e) => {
          const newValue = e.target.value;
          if (isControlled) {
            // Para componentes controlados, apenas chamar onChange
            if (onChangeRef.current) {
              onChangeRef.current(newValue, name);
            }
          } else {
            // Para componentes não controlados, atualizar estado interno
            setInternalValue(newValue);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
          className,
        )}
      />
    </div>
  );
}
