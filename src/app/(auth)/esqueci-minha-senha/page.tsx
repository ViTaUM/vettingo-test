'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MyLink from '@/components/link';
import { ArrowLeft, Mail, PawPrint, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular verificação do e-mail no banco de dados
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-emerald-200/20 blur-3xl delay-1000" />
        </div>

        <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="group relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 opacity-75 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 shadow-lg">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500">
              E-mail enviado!
            </h1>
            <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
              Verifique sua caixa de entrada
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-600/10 to-green-600/10 opacity-0 blur-xl transition-opacity duration-500" />
            <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  Instruções enviadas
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enviamos um link para alterar sua senha para o e-mail{' '}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Verifique também sua pasta de spam caso não encontre o e-mail.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700"
                  size="lg">
                  Enviar novamente
                </Button>

                <div className="text-center">
                  <MyLink
                    className="inline-flex items-center text-sm font-medium text-blue-600 transition-all duration-300 hover:text-emerald-600"
                    size="sm"
                    always-active
                    href="/login">
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Voltar ao login
                  </MyLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-emerald-200/20 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 opacity-75 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg">
              <PawPrint className="h-8 w-8 animate-pulse text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500">
            Esqueceu sua senha?
          </h1>
          <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
            Digite seu e-mail para receber instruções de recuperação
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="group relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-emerald-600/10 opacity-0 blur-xl transition-opacity duration-500" />
          <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail cadastrado
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="seu@email.com"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Digite o e-mail que você usou para se cadastrar
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50"
                  size="lg">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verificando...
                    </div>
                  ) : (
                    'Enviar instruções'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <MyLink
                className="inline-flex items-center text-sm font-medium text-blue-600 transition-all duration-300 hover:text-emerald-600"
                size="sm"
                always-active
                href="/login">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Voltar ao login
              </MyLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
