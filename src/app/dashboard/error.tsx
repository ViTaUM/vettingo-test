'use client';

import { Home, RefreshCw, Bug, Zap } from 'lucide-react';
import Link from 'next/link';
import UIButton from '@/components/ui/button';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone de erro */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-200 rounded-full flex items-center justify-center">
              <Bug className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">500</span>
            </div>
          </div>
        </div>

        {/* Título e descrição */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ops! Algo deu errado
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Encontramos um pequeno bug em nosso sistema. Nossa equipe já foi notificada e está trabalhando para resolver isso rapidamente!
        </p>

        {/* Ilustração ou ícone decorativo */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-orange-600" />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-4">
          <UIButton
            onClick={reset}
            variant="solid"
            size="lg"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            <RefreshCw className="mr-2 h-5 w-5" />
            Tentar Novamente
          </UIButton>

          <Link href="/dashboard">
            <UIButton
              variant="outline"
              size="lg"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Dashboard
            </UIButton>
          </Link>
        </div>

        {/* Informações técnicas (opcional) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Informações para Desenvolvedores:
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-600">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Informações de suporte */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Ainda com problemas?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Se o problema persistir, nossa equipe de suporte está pronta para ajudar.
          </p>
          <div className="space-y-2">
            <Link href="/contato">
              <UIButton
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                Falar com Suporte
              </UIButton>
            </Link>
            <Link href="/dashboard/suporte">
              <UIButton
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50">
                Abrir Ticket
              </UIButton>
            </Link>
          </div>
        </div>

        {/* Status do sistema */}
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              Sistema Operacional
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Nossa equipe monitora o sistema constantemente para garantir a melhor experiência.
          </p>
        </div>

        {/* Mensagem motivacional */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
              &ldquo;Cada erro é uma oportunidade de aprendizado e melhoria.&rdquo; 🔧✨
            </p>
        </div>
      </div>
    </div>
  );
}
