'use client';

import { cn } from '@/utils/cn';
import type React from 'react';
import { useEffect, useState } from 'react';

type FormRangeSliderProps = {
  label: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  disabled?: boolean;
  unit?: string;
  className?: string;
};

export default function FormRangeSlider({
  label,
  name,
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
  unit = '',
  className,
}: FormRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = Number.parseFloat(e.target.value);
    const rangeValue = [...localValue] as [number, number];
    if (index === 0) {
      rangeValue[0] = Math.min(newValue, rangeValue[1]);
    } else {
      rangeValue[1] = Math.max(newValue, rangeValue[0]);
    }
    setLocalValue(rangeValue);
    onChange(rangeValue);
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const [minValue, maxValue] = localValue;

  return (
    <div className={cn('mb-4', className)}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="bg-primary absolute h-2 rounded-full"
            style={{
              left: `${getPercentage(minValue)}%`,
              width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
            }}></div>
        </div>
        <input
          type="range"
          id={`${name}-min`}
          name={`${name}-min`}
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => handleChange(e, 0)}
          disabled={disabled}
          className="absolute top-0 h-2 w-full cursor-pointer opacity-0"
        />
        <input
          type="range"
          id={`${name}-max`}
          name={`${name}-max`}
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => handleChange(e, 1)}
          disabled={disabled}
          className="absolute top-0 h-2 w-full cursor-pointer opacity-0"
        />
        <div
          className="bg-primary absolute -mt-1 h-4 w-4 -translate-x-1/2 transform rounded-full border-2 border-white"
          style={{ left: `${getPercentage(minValue)}%` }}></div>
        <div
          className="bg-primary absolute -mt-1 h-4 w-4 -translate-x-1/2 transform rounded-full border-2 border-white"
          style={{ left: `${getPercentage(maxValue)}%` }}></div>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>
          {minValue}
          {unit}
        </span>
        <span>
          {maxValue}
          {unit}
        </span>
      </div>
    </div>
  );
}
