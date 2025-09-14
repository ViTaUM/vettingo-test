'use client';

import HookFormField from '@/components/form/hook-form-field';
import StrongPasswordFeedback from '@/components/form/strong-password-feedback';
import { Button } from '@/components/ui/button';
import { changePasswordAction } from '@/lib/api/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
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

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function PasswordChangeForm({ onMessage }: PasswordChangeFormProps) {
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedNewPassword = watch('newPassword');
  const watchedConfirmPassword = watch('confirmPassword');

  const onSubmit = async (data: PasswordChangeFormData) => {
    setSaving(true);
    try {
      const result = await changePasswordAction(data.currentPassword, data.newPassword);

      if (result.success) {
        onMessage?.({ type: 'success', text: 'Senha alterada com sucesso!' });
        reset();
      } else {
        onMessage?.({ type: 'error', text: result.error || 'Erro ao alterar senha' });
      }
    } catch {
      onMessage?.({ type: 'error', text: 'Erro ao alterar senha' });
    }
    setSaving(false);
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Key className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Alterar Senha</h2>
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <HookFormField
            label="Senha Atual"
            name="currentPassword"
            type="password"
            control={control}
            error={errors.currentPassword?.message}
            required
          />

          <HookFormField
            label="Nova Senha"
            name="newPassword"
            type="password"
            control={control}
            error={errors.newPassword?.message}
            required
          />

          <HookFormField
            label="Confirmar Nova Senha"
            name="confirmPassword"
            type="password"
            control={control}
            error={errors.confirmPassword?.message}
            required
          />

          {(watchedNewPassword || watchedConfirmPassword) && (
            <StrongPasswordFeedback password={watchedNewPassword} confirmPassword={watchedConfirmPassword} />
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={saving}
              loading={saving}
              variant="solid"
              size="md"
              className="bg-blue-600 hover:bg-blue-700">
              {saving ? 'Alterando...' : 'Alterar Senha'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
