'use client';

import React from 'react';
import { forceLogout, isAuthError } from '@/utils/auth-error-handler';

interface AuthErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AuthErrorBoundaryProps {
  children: React.ReactNode;
}

export class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  AuthErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AuthErrorBoundaryState {
    // Verificar se é erro de autenticação
    if (isAuthError(error)) {
      console.log('AuthErrorBoundary: Erro de autenticação capturado:', error.message);
      // Forçar logout imediato
      setTimeout(() => {
        forceLogout();
      }, 100);
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AuthErrorBoundary: Erro capturado:', error, errorInfo);
    
    if (isAuthError(error)) {
      console.log('AuthErrorBoundary: Redirecionando para login devido a erro de autenticação');
      forceLogout();
    }
  }

  render() {
    if (this.state.hasError && this.state.error && isAuthError(this.state.error)) {
      // Para erros de autenticação, mostrar uma mensagem simples enquanto redireciona
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecionando para login...</p>
          </div>
        </div>
      );
    }

    if (this.state.hasError) {
      // Para outros erros, mostrar erro genérico
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Algo deu errado</h2>
            <p className="text-gray-600 mb-4">Ocorreu um erro inesperado.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 