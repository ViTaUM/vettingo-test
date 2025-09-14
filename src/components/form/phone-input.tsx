'use client';

import type React from 'react';

type FormPhoneInputProps = {
  label: string;
  countryCodeName: string;
  areaCodeName: string;
  phoneName: string;
  countryCodeValue: string;
  areaCodeValue: string;
  phoneValue: string;
  onChange: (field: string, value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

export default function FormPhoneInput({
  label,
  countryCodeName,
  areaCodeName,
  phoneName,
  countryCodeValue,
  areaCodeValue,
  phoneValue,
  onChange,
  required = false,
  disabled = false,
}: FormPhoneInputProps) {
  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 3) {
      onChange(countryCodeName, value);
    }
  };

  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 2) {
      onChange(areaCodeName, value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 9) {
      onChange(phoneName, value);
    }
  };

  const formatPhoneDisplay = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{4})(\d{0,4})/, '$1-$2').slice(0, 9);
    } else {
      return numbers.replace(/(\d{5})(\d{0,4})/, '$1-$2').slice(0, 10);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={phoneName} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <div className="w-16">
          <div className="relative">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">+</span>
            <input
              id={countryCodeName}
              name={countryCodeName}
              type="text"
              value={countryCodeValue}
              onChange={handleCountryCodeChange}
              placeholder="55"
              disabled={true}
              className="font-input rounded-input p-input focus:border-primary w-full border border-gray-300 bg-gray-50 pl-7 text-sm text-gray-700 outline-0 transition duration-300 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
        <div className="w-16">
          <input
            id={areaCodeName}
            name={areaCodeName}
            type="text"
            value={areaCodeValue}
            onChange={handleAreaCodeChange}
            placeholder="DDD"
            disabled={disabled}
            className="font-input rounded-input p-input focus:border-primary w-full border border-gray-300 bg-gray-50 text-sm text-gray-700 outline-0 transition duration-300 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex-1">
          <input
            id={phoneName}
            name={phoneName}
            type="text"
            value={formatPhoneDisplay(phoneValue)}
            onChange={handlePhoneChange}
            placeholder="Número de telefone"
            disabled={disabled}
            className="font-input rounded-input p-input focus:border-primary w-full border border-gray-300 bg-gray-50 text-sm text-gray-700 outline-0 transition duration-300 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
