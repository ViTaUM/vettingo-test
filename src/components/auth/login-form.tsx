'use client';

import { AlertCircle, PawPrint } from 'lucide-react';
import { loginAction } from '@/lib/api/auth';
import HookFormField from '@/components/form/hook-form-field';
import HookFormPasswordField from '@/components/form/hook-form-password-field';
import UIButton from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useActionState, startTransition } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginState {
  success?: boolean;
  error?: string;
  token?: string;
}

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [state, action, isPending] = useActionState(
    async (_: LoginState | null, formData: FormData): Promise<LoginState> => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      if (!email || !password) {
        return {
          success: false,
          error: 'Por favor, preencha todos os campos obrigatórios',
        };
      }

      const result = await loginAction(email, password);

      if (result.success) {
        toast.success('Login realizado com sucesso!');
        onSuccess?.();
        router.push('/dashboard');
        return result;
      } else {
        toast.error(result.error || 'Erro no login');
        return result;
      }
    },
    null,
  );

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <form
      className="mt-6 space-y-5 md:mt-8"
      onSubmit={handleSubmit(onSubmit)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}>
      <div className="space-y-4">
        <div className="group relative">
          <HookFormField
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite o seu e-mail"
            control={control}
            error={errors.email?.message}
            required
            disabled={isPending}
          />
        </div>

        <div className="group relative">
          <HookFormPasswordField
            label="Senha"
            name="password"
            placeholder="Digite a sua senha"
            control={control}
            error={errors.password?.message}
            required
            disabled={isPending}
            showStrength={false}
          />
        </div>

        <div className="flex items-center justify-between"></div>
      </div>

      <div className="relative">
        <UIButton
          className={cn(
            'w-full transform transition-all duration-300',
            isValid
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:scale-[1.02] hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              : 'cursor-not-allowed bg-gray-300',
            isFocused && isValid ? 'animate-pulse' : '',
          )}
          type="submit"
          size="sm"
          variant="solid"
          loading={isPending}
          disabled={isPending || !isValid}>
          <div className="flex items-center justify-center space-x-2">
            {isPending ? (
              <>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <PawPrint className="h-4 w-4 animate-pulse" />
                <span>Entrar</span>
              </>
            )}
          </div>
        </UIButton>

        {isValid && (
          <div className="absolute -top-1 -right-1">
            <div className="h-3 w-3 animate-ping rounded-full bg-green-500" />
          </div>
        )}
      </div>

      {state?.error && (
        <div className="animate-in slide-in-from-top-2 rounded-md border border-red-200 bg-red-50 p-3 duration-300">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 animate-pulse text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{state.error}</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
