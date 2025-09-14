'use client';

import EmailManagement from '@/components/dashboard/settings/email-management';
import PhoneManagement from '@/components/dashboard/settings/phone-management';
import HookFormField from '@/components/form/hook-form-field';
import ImageUpload from '@/components/form/image-upload';
import { Button } from '@/components/ui/button';
import { updateUser } from '@/lib/api/users';
import { UserEmail, UserPhone, User as UserType } from '@/lib/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, User } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const userProfileSchema = z.object({
  firstName: z.string().min(2, 'Primeiro nome deve ter pelo menos 2 caracteres').max(50, 'Primeiro nome deve ter no máximo 50 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres').max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  avatar: z.string().optional(),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  user: UserType;
  emails: UserEmail[];
  phones: UserPhone[];
}

export default function UserProfileForm({ user, emails, phones }: UserProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar || '',
    },
  });

  const handleAvatarChange = useCallback((base64: string) => {
    setAvatarPreview(base64);
    setValue('avatar', base64, { shouldDirty: true });
  }, [setValue]);

  const handleAvatarRemove = useCallback(() => {
    setAvatarPreview(null);
    setValue('avatar', '', { shouldDirty: true });
  }, [setValue]);

  const validateAvatar = (avatar: string): boolean => {
    if (!avatar || avatar === user.avatar) {
      return true;
    }

    if (!avatar.startsWith('data:image/')) {
      toast.error('Avatar deve ser uma imagem em formato base64 válida');
      return false;
    }

    try {
      const base64Data = avatar.split(',')[1];
      const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB > 5) {
        toast.error('Avatar deve ter no máximo 5MB');
        return false;
      }
    } catch {
      toast.error('Avatar deve ser uma imagem em formato base64 válida');
      return false;
    }

    return true;
  };

  const onSubmit = async (data: UserProfileFormData) => {
    if (!validateAvatar(data.avatar || '')) {
      return;
    }

    setSaving(true);

    try {
      const payload: {
        firstName: string;
        lastName: string;
        avatar?: string;
      } = {
        firstName: data.firstName,
        lastName: data.lastName,
      };

      if (data.avatar !== user.avatar) {
        payload.avatar = data.avatar;
      }

      const result = await updateUser(payload);
      
      if (result.success) {
        toast.success('Perfil atualizado com sucesso!');
        return;
      }

      toast.error(result.error || 'Erro ao atualizar perfil');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  };

  const formatGender = (gender: string) => {
    const genderMap: Record<string, string> = {
      'M': 'Masculino',
      'F': 'Feminino',
      'O': 'Outro',
    };
    return genderMap[gender] || gender;
  };



  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <User className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Perfil do Usuário</h2>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de Perfil
            </label>
            <ImageUpload
              value={avatarPreview || undefined}
              onChange={handleAvatarChange}
              onRemove={handleAvatarRemove}
              disabled={saving}
              size="lg"
              aspectRatio="circle"
              placeholder="Escolher Foto"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <HookFormField
              label="Primeiro Nome"
              name="firstName"
              type="text"
              placeholder="Digite seu primeiro nome"
              control={control}
              error={errors.firstName?.message}
              required
              disabled={saving}
            />
            
            <HookFormField
              label="Sobrenome"
              name="lastName"
              type="text"
              placeholder="Digite seu sobrenome"
              control={control}
              error={errors.lastName?.message}
              required
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-300">
                {formatDate(user.birthDate)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gênero
              </label>
              <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-300">
                {formatGender(user.gender)}
              </div>
            </div>
          </div>

          <EmailManagement 
            emails={emails} 
            disabled={saving} 
          />

          <PhoneManagement 
            phones={phones} 
            disabled={saving} 
          />

          <div className="pt-4 border-t border-gray-200">
            <Button
              type="submit"
              disabled={saving}
              loading={saving}
              variant="solid"
              size="md"
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Salvando...' : 'Salvar Informações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 