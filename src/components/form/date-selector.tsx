'use client';

import { useEffect, useState } from 'react';
import FormSelect from './select';

type FormDateSelectorProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
};

export default function FormDateSelector({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  minYear = 1900,
  maxYear = new Date().getFullYear(),
}: FormDateSelectorProps) {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');

  useEffect(() => {
    if (value) {
      const [yearVal, monthVal, dayVal] = value.split('-');
      if (yearVal && monthVal && dayVal) {
        setYear(yearVal);
        setMonth(monthVal);
        setDay(dayVal);
      }
    }
  }, [value]);

  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31;

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum === 2) {
      const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0;
      return isLeapYear ? 29 : 28;
    }
    if ([4, 6, 9, 11].includes(monthNum)) {
      return 30;
    }
    return 31;
  };

  const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1),
  }));

  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    value: String(maxYear - i),
    label: String(maxYear - i),
  }));

  const handleDayChange = (newDay: string) => {
    setDay(newDay);
    if (newDay && month && year) {
      onChange(`${year}-${month}-${newDay}`);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);

    // Ajustar dia se necessário
    if (newMonth && year && day) {
      const maxDays = getDaysInMonth(newMonth, year);
      const currentDay = parseInt(day);
      const adjustedDay = currentDay > maxDays ? String(maxDays).padStart(2, '0') : day;

      setDay(adjustedDay);
      onChange(`${year}-${newMonth}-${adjustedDay}`);
    } else if (newMonth && year) {
      onChange(`${year}-${newMonth}-${day || '01'}`);
    }
  };

  const handleYearChange = (newYear: string) => {
    setYear(newYear);

    // Ajustar dia se necessário (ano bissexto)
    if (newYear && month && day) {
      const maxDays = getDaysInMonth(month, newYear);
      const currentDay = parseInt(day);
      const adjustedDay = currentDay > maxDays ? String(maxDays).padStart(2, '0') : day;

      setDay(adjustedDay);
      onChange(`${newYear}-${month}-${adjustedDay}`);
    } else if (newYear && month) {
      onChange(`${newYear}-${month}-${day || '01'}`);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="grid grid-cols-[1fr_2fr_1fr] gap-3">
        <div>
          <FormSelect
            name={`${name}-day`}
            value={day}
            onChange={handleDayChange}
            disabled={disabled}
            options={days}
            placeholder="Dia"
          />
        </div>

        <div>
          <FormSelect
            name={`${name}-month`}
            value={month}
            onChange={handleMonthChange}
            disabled={disabled}
            options={months}
            placeholder="Mês"
          />
        </div>

        <div>
          <FormSelect
            name={`${name}-year`}
            value={year}
            onChange={handleYearChange}
            disabled={disabled}
            options={years}
            placeholder="Ano"
          />
        </div>
      </div>
    </div>
  );
}
