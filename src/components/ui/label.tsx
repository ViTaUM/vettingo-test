'use client';

import { cn } from '@/utils/cn';
import type React from 'react';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    />
  );
}

export default Label;
