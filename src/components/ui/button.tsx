'use client';

import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';
import type React from 'react';

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
}: Readonly<{
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}>) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // Base styles
        'inline-flex cursor-pointer items-center justify-center font-medium transition-all duration-200',
        'rounded-lg border border-transparent focus:ring-2 focus:ring-offset-2 focus:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',

        // Variant styles
        variant === 'solid' && [
          'bg-blue-600 text-white shadow-sm',
          'hover:bg-blue-700 focus:ring-blue-500',
          'disabled:bg-gray-400 disabled:hover:bg-gray-400',
        ],
        variant === 'outline' && [
          'border-gray-300 bg-white text-gray-700 shadow-sm',
          'hover:border-gray-400 hover:bg-gray-50 focus:ring-blue-500',
          'disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400',
        ],
        variant === 'ghost' && [
          'bg-transparent text-gray-700',
          'hover:bg-gray-100 focus:ring-blue-500',
          'disabled:text-gray-400 disabled:hover:bg-transparent',
        ],

        // Size styles
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',

        className,
      )}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

// Export default para compatibilidade com as importações existentes
export default Button;
