'use client';

import { cn } from '@/utils/cn';
import { Search, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function SearchField({
  label,
  labelClassName,
  name,
  placeholder = 'Buscar...',
  initialValue = '',
  disabled,
  onChange,
  className,
}: Readonly<{
  label?: string;
  labelClassName?: string;
  className?: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
  disabled?: boolean;
  onChange?: (value: string, name: string) => void;
}>) {
  const [value, setValue] = useState<string>(initialValue);
  const onChangeRef = useRef(onChange);

  // Manter a referência da função onChange sempre atualizada
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Atualizar o valor interno quando initialValue mudar
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Função para lidar com mudanças no input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    // Chamar onChange diretamente quando o usuário digita
    onChangeRef.current?.(newValue, name);
  };

  const handleClear = () => {
    setValue('');
    // Chamar onChange quando limpar
    onChangeRef.current?.('', name);
  };

  return (
    <div className="mb-4 w-full last:mb-0">
      {label && (
        <label htmlFor={name} className={cn('mb-2 block text-sm font-medium text-gray-700', labelClassName)}>
          {label}
        </label>
      )}

      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            className,
          )}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
