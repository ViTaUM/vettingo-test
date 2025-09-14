'use client';

import React from 'react';
import { Check, LucideIcon } from 'lucide-react';
import SpotlightCard from '@/components/ui/spotlight-card';

interface SelectableCardFeature {
  icon: LucideIcon;
  text: string;
}

interface SelectableCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features?: SelectableCardFeature[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  selectedColor?: 'blue' | 'emerald' | 'green' | 'pink' | 'purple' | 'red' | 'yellow' | 'orange' | 'gray';
  spotlightColor?: string;
  className?: string;
}

export default function SelectableCard({
  id,
  title,
  description,
  icon: Icon,
  features = [],
  isSelected,
  onSelect,
  disabled = false,
  selectedColor = 'blue',
  spotlightColor = 'white',
  className = '',
}: SelectableCardProps) {
  const colorConfig = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      ring: 'ring-blue-200',
      iconBg: 'bg-blue-600',
      checkBg: 'bg-blue-600',
    },
    emerald: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-200',
      iconBg: 'bg-emerald-600',
      checkBg: 'bg-emerald-600',
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      ring: 'ring-green-200',
      iconBg: 'bg-green-600',
      checkBg: 'bg-green-600',
    },
    pink: {
      border: 'border-pink-500',
      bg: 'bg-pink-50',
      ring: 'ring-pink-200',
      iconBg: 'bg-pink-600',
      checkBg: 'bg-pink-600',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      ring: 'ring-purple-200',
      iconBg: 'bg-purple-600',
      checkBg: 'bg-purple-600',
    },
    red: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      ring: 'ring-red-200',
      iconBg: 'bg-red-600',
      checkBg: 'bg-red-600',
    },
    yellow: {
      border: 'border-yellow-500',
      bg: 'bg-yellow-50',
      ring: 'ring-yellow-200',
      iconBg: 'bg-yellow-600',
      checkBg: 'bg-yellow-600',
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-50',
      ring: 'ring-orange-200',
      iconBg: 'bg-orange-600',
      checkBg: 'bg-orange-600',
    },
    gray: {
      border: 'border-gray-500',
      bg: 'bg-gray-50',
      ring: 'ring-gray-200',
      iconBg: 'bg-gray-600',
      checkBg: 'bg-gray-600',
    },
  };

  const colors = colorConfig[selectedColor];

  const handleClick = () => {
    if (!disabled) {
      onSelect(id);
    }
  };

  const cardClassName = `
    relative cursor-pointer border-2 p-6 transition-all duration-200
    ${isSelected ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}` : 'border-gray-100 hover:border-gray-200'}
    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
    ${className}
  `.trim();

  return (
    <SpotlightCard className={cardClassName} spotlightColor={spotlightColor} onClick={handleClick}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200 ${
              isSelected ? `${colors.iconBg} text-white` : 'bg-gray-100 text-gray-600'
            }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-medium text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {features.length > 0 && (
            <div className="mt-3 space-y-1">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                  <feature.icon className="h-4 w-4" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${colors.checkBg}`}>
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
