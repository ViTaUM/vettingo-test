'use client';

import { Option } from '@/types/option';
import { cn } from '@/utils/cn';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Fragment } from 'react';
import { Control, useController } from 'react-hook-form';

interface HookFormSelectProps {
  label?: string;
  name: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: string;
}

const HookFormSelect = ({
  label,
  name,
  options,
  required = false,
  disabled = false,
  placeholder = 'Selecione uma opção',
  control,
  error,
}: HookFormSelectProps) => {
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
  });

  const errorMessage = error || fieldError?.message;
  const selectedOption = options.find((option) => option.value === field.value);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <Listbox value={field.value} onChange={field.onChange} name={name} disabled={disabled}>
        <div className="relative">
          <ListboxButton
            className={cn(
              'relative w-full rounded-lg border px-3 py-2.5 pr-10 text-left text-sm',
              'transition-all duration-200 focus:ring-2 focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errorMessage
                ? 'border-red-300 bg-white focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500/20',
            )}>
            <span className="block truncate">
              {selectedOption ? (
                <span className="text-gray-900">{selectedOption.label}</span>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className={cn('h-4 w-4 text-gray-400 transition-transform duration-200', 'ui-open:rotate-180')}
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1">
            <ListboxOptions
              className={cn(
                'absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white',
                'py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none',
              )}>
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className={cn(
                    'relative cursor-pointer px-4 py-3 transition-colors duration-150 select-none',
                    'ui-active:bg-gray-50 ui-selected:bg-blue-50 ui-selected:text-blue-900',
                    !option.value && field.value === option.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900',
                  )}>
                  {({ selected }) => (
                    <>
                      <span className={cn('block truncate', selected ? 'font-semibold' : 'font-normal')}>
                        {option.label}
                      </span>

                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default HookFormSelect; 