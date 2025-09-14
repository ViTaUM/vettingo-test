'use client';

import type React from 'react';

import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

type FormSliderProps = {
  label: string;
  name: string;
  min: number;
  max: number;
  step?: number;
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  disabled?: boolean;
  isRange?: boolean;
  unit?: string;
  className?: string;
};

export default function FormSlider({
  label,
  name,
  min,
  max,
  step = 1,
  value,
  onChange,
  disabled = false,
  isRange = false,
  unit = '',
  className,
}: FormSliderProps) {
  const [localValue, setLocalValue] = useState<number | [number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const newValue = Number.parseFloat(e.target.value);

    if (isRange && Array.isArray(localValue)) {
      const rangeValue = [...localValue] as [number, number];
      if (index === 0) {
        rangeValue[0] = Math.min(newValue, rangeValue[1]);
      } else {
        rangeValue[1] = Math.max(newValue, rangeValue[0]);
      }
      setLocalValue(rangeValue);
      onChange(rangeValue);
    } else {
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const renderSingleSlider = () => {
    const singleValue = localValue as number;
    return (
      <div className="relative mt-2">
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="bg-primary absolute h-2 rounded-full"
            style={{ width: `${getPercentage(singleValue)}%` }}></div>
        </div>
        <input
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          step={step}
          value={singleValue}
          onChange={handleChange}
          disabled={disabled}
          className="absolute top-0 h-2 w-full cursor-pointer opacity-0"
        />
        <div
          className="bg-primary absolute -mt-1 h-4 w-4 -translate-x-1/2 transform rounded-full border-2 border-white"
          style={{ left: `${getPercentage(singleValue)}%` }}></div>
      </div>
    );
  };

  const renderRangeSlider = () => {
    const [minValue, maxValue] = localValue as [number, number];
    return (
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
    );
  };

  const displayValue = () => {
    if (isRange && Array.isArray(localValue)) {
      return (
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>
            {localValue[0]}
            {unit}
          </span>
          <span>
            {localValue[1]}
            {unit}
          </span>
        </div>
      );
    }

    return (
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>
          {min}
          {unit}
        </span>
        <span className="font-medium">
          {localValue as number}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    );
  };

  return (
    <div className={cn('mb-4', className)}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {isRange ? renderRangeSlider() : renderSingleSlider()}
      {displayValue()}
    </div>
  );
}
