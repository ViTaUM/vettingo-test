'use client';

import { cn } from '@/utils/cn';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export default function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    score = checks.filter(Boolean).length;

    if (score <= 1) return { score, label: 'Muito fraca', color: 'text-red-500' };
    if (score <= 2) return { score, label: 'Fraca', color: 'text-orange-500' };
    if (score <= 3) return { score, label: 'Média', color: 'text-yellow-500' };
    if (score <= 4) return { score, label: 'Forte', color: 'text-blue-500' };
    return { score, label: 'Muito forte', color: 'text-green-500' };
  };

  const strength = getStrength(password);
  const checks = [
    { label: 'Pelo menos 8 caracteres', test: password.length >= 8 },
    { label: 'Pelo menos uma letra minúscula', test: /[a-z]/.test(password) },
    { label: 'Pelo menos uma letra maiúscula', test: /[A-Z]/.test(password) },
    { label: 'Pelo menos um número', test: /[0-9]/.test(password) },
    { label: 'Pelo menos um caractere especial', test: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className={cn('mt-2 space-y-2', className)}>
      {/* Barra de força */}
      <div className="flex items-center space-x-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              'h-full transition-all duration-300 ease-out',
              strength.score <= 1 && 'bg-red-500',
              strength.score === 2 && 'bg-orange-500',
              strength.score === 3 && 'bg-yellow-500',
              strength.score === 4 && 'bg-blue-500',
              strength.score === 5 && 'bg-green-500',
            )}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className={cn('text-xs font-medium', strength.color)}>{strength.label}</span>
      </div>

      {/* Lista de requisitos */}
      <div className="space-y-1">
        {checks.map((check, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center space-x-2 text-xs transition-all duration-200',
              check.test ? 'text-green-600' : 'text-gray-500',
            )}>
            {check.test ? (
              <CheckCircle className="animate-in slide-in-from-left-2 h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
