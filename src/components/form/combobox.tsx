'use client';

import { Option } from '@/types/option';
import { cn } from '@/utils/cn';
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';

interface OptionItemData {
  filteredOptions: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const OptionItem = ({ index, style, data }: { index: number; style: React.CSSProperties; data: OptionItemData }) => {
  const { filteredOptions, selectedValue } = data;
  const option = filteredOptions[index];
  const isSelected = selectedValue === option.value;

  return (
    <ComboboxOption
      key={option.value}
      value={option.value}
      style={style}
      className={cn(
        'relative cursor-pointer px-4 py-3 transition-colors duration-150 select-none',
        isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900 hover:bg-gray-50',
      )}>
      {({ selected }) => (
        <>
          <span className={cn('block truncate', selected ? 'font-semibold' : 'font-normal')}>{option.label}</span>
          {selected && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
              <CheckIcon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </ComboboxOption>
  );
};

export default function FormCombobox({
  label,
  name,
  options,
  value = '',
  required = false,
  disabled = false,
  onChange,
  placeholder = 'Buscar ou selecionar...',
}: Readonly<{
  label?: string;
  name: string;
  options: Option[];
  value?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  const [query, setQuery] = useState('');
  const listRef = useRef(null);

  const filteredOptions =
    query === '' ? options : options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Combobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <div className="relative">
            <ComboboxInput
              className={cn(
                'w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-sm text-gray-900 placeholder-gray-500',
                'transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
                'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-50',
              )}
              displayValue={() => selectedOption?.label || ''}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={selectedOption ? selectedOption.label : placeholder}
            />

            {/* Ícone de busca */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>

            {/* Botão dropdown */}
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', 'ui-open:rotate-180')}
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>

          <ComboboxOptions
            className={cn(
              'absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg',
              'overflow-hidden ring-1 ring-black/5 focus:outline-none',
            )}>
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                Nenhum resultado encontrado para {'"'}
                {query}
                {'"'}
              </div>
            ) : (
              <List
                ref={listRef}
                height={Math.min(240, filteredOptions.length * 48)} // 48px por item, máximo 5 itens visíveis
                itemCount={filteredOptions.length}
                itemSize={48}
                width="100%"
                itemData={{ filteredOptions, selectedValue: value, onSelect: onChange }}>
                {OptionItem}
              </List>
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
}
