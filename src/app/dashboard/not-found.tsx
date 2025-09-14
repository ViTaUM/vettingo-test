'use client';

import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import UIButton from '@/components/ui/button';

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone de erro */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">404</span>
            </div>
          </div>
        </div>

        {/* Título e descrição */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Ops! Página não encontrada
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Parece que você se aventurou por um caminho que ainda não existe em nosso dashboard. 
          Não se preocupe, vamos te ajudar a encontrar o que procura!
        </p>

        {/* Ilustração ou ícone decorativo */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
            <Search className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <UIButton
              variant="solid"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="mr-2 h-5 w-5" />
              Voltar ao Dashboard
            </UIButton>
          </Link>

          <Link href="/">
            <UIButton
              variant="outline"
              size="lg"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Ir para a Página Inicial
            </UIButton>
          </Link>
        </div>

        {/* Informações adicionais */}
        <div className="mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Precisa de ajuda?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Se você acredita que esta página deveria existir, entre em contato conosco.
          </p>
          <Link href="/contato">
            <UIButton
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              Falar com Suporte
            </UIButton>
          </Link>
        </div>

        {/* Mensagem motivacional */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg">
          <p className="text-sm text-gray-700 italic">
            &ldquo;Às vezes, os melhores caminhos são os que ainda estão sendo construídos.&rdquo; 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
