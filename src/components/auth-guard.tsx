'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { forceLogout, isAuthError } from '@/utils/auth-error-handler';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  useEffect(() => {
    // Interceptar erros globais relacionados à autenticação
    const handleGlobalError = (event: ErrorEvent) => {
      const error = event.error;
      if (error && isAuthError(error)) {
        console.log('AuthGuard: Erro de autenticação detectado globalmente');
        forceLogout();
      }
    };

    // Interceptar rejeições de Promise não tratadas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason && isAuthError(reason)) {
        console.log('AuthGuard: Erro de autenticação detectado em Promise rejeitada');
        forceLogout();
      }
    };

    // Adicionar listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [router]);

  return <>{children}</>;
} 