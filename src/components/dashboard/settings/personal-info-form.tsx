'use client';

import HookFormCheckbox from '@/components/form/hook-form-checkbox';
import HookFormField from '@/components/form/hook-form-field';
import ImageUpload from '@/components/form/image-upload';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/api/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Nome é obrigatório'),
  lastName: z.string().min(1, 'Sobrenome é obrigatório'),
  wantsNewsletter: z.boolean().default(false),
  avatar: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    wantsNewsletter?: boolean;
    avatar?: string;
  };
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function PersonalInfoForm({ initialData, onMessage }: PersonalInfoFormProps) {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData.avatar || null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      wantsNewsletter: initialData.wantsNewsletter || false,
      avatar: initialData.avatar,
    },
  });

  const handleAvatarChange = useCallback((base64: string) => {
    setAvatarPreview(base64);
    setValue('avatar', base64);
  }, [setValue]);

  const handleAvatarRemove = useCallback(() => {
    setAvatarPreview(null);
    setValue('avatar', '');
  }, [setValue]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    setSaving(true);
    try {
      const result = await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
      });

      if (result.success) {
        onMessage?.({ type: 'success', text: 'Informações pessoais atualizadas com sucesso!' });
      } else {
        onMessage?.({ type: 'error', text: result.error || 'Erro ao atualizar informações' });
      }
    } catch {
      onMessage?.({ type: 'error', text: 'Erro ao atualizar informações pessoais' });
    }
    setSaving(false);
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <User className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ImageUpload
            label="Foto de Perfil"
            value={avatarPreview || undefined}
            onChange={handleAvatarChange}
            onRemove={handleAvatarRemove}
            disabled={saving}
            size="lg"
            aspectRatio="circle"
            placeholder="Escolher Foto"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <HookFormField
              label="Nome"
              name="firstName"
              type="text"
              control={control}
              error={errors.firstName?.message}
              required
            />
            <HookFormField
              label="Sobrenome"
              name="lastName"
              type="text"
              control={control}
              error={errors.lastName?.message}
              required
            />
          </div>

          <div className="mt-4">
            <HookFormCheckbox
              label="Quero receber newsletters e novidades"
              name="wantsNewsletter"
              control={control}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={saving}
              loading={saving}
              variant="solid"
              size="md"
              className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar Informações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
