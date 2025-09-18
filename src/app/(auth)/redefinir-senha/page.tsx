'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MyLink from '@/components/link';
import StrongPasswordFeedback from '@/components/form/strong-password-feedback';
import { ArrowLeft, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { resetPasswordWithToken } from '@/lib/api/auth';

// Schema adaptado do password-change-form.tsx, removendo currentPassword
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
    .regex(/\d/, 'A senha deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Token de redefinição não encontrado. Verifique o link recebido por e-mail.');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const watchedNewPassword = watch('newPassword');
  const watchedConfirmPassword = watch('confirmPassword');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Token não encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await resetPasswordWithToken(token, data.newPassword);
      
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Erro ao redefinir senha');
      }
    } catch {
      setError('Erro inesperado ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  // Se não há token, mostrar erro
  if (!token && error) {
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
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 opacity-75 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-orange-600 shadow-lg">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500">
              Link inválido
            </h1>
            <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
              {error}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600/10 to-orange-600/10 opacity-0 blur-xl transition-opacity duration-500" />
            <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Solicite um novo link de redefinição de senha ou entre em contato com o suporte.
                </p>
              </div>

              <div className="mt-6">
                <MyLink
                  className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-emerald-700"
                  href="/esqueci-minha-senha">
                  Solicitar novo link
                </MyLink>
              </div>
              
              <div className="mt-4">
                <MyLink
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao login
                </MyLink>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
              Senha alterada!
            </h1>
            <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
              Sua nova senha foi definida com sucesso
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-600/10 to-green-600/10 opacity-0 blur-xl transition-opacity duration-500" />
            <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Key className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">
                  Pronto para usar!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Agora você pode fazer login com sua nova senha.
                </p>
              </div>

              <div className="mt-8">
                <MyLink
                  className="inline-flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-emerald-600 px-4 py-3 text-sm font-medium text-white hover:from-blue-700 hover:to-emerald-700"
                  href="/login">
                  Ir para o login
                </MyLink>
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
              <Key className="h-8 w-8 animate-pulse text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500">
            Definir nova senha
          </h1>
          <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
            Escolha uma senha segura para sua conta
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="group relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-emerald-600/10 opacity-0 blur-xl transition-opacity duration-500" />
          <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova senha
                </Label>
                <div className="mt-1">
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...register('newPassword')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Digite sua nova senha"
                  />
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar nova senha
                </Label>
                <div className="mt-1">
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...register('confirmPassword')}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Confirme sua nova senha"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Feedback das regras de senha */}
              {(watchedNewPassword || watchedConfirmPassword) && (
                <StrongPasswordFeedback 
                  password={watchedNewPassword} 
                  confirmPassword={watchedConfirmPassword} 
                />
              )}

              {/* Mostrar erro se houver */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Erro ao redefinir senha
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50"
                  size="lg">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Definindo senha...
                    </div>
                  ) : (
                    'Definir nova senha'
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