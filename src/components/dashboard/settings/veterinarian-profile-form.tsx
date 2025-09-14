'use client';

import HookFormCheckbox from '@/components/form/hook-form-checkbox';
import HookFormField from '@/components/form/hook-form-field';
import HookFormSelect from '@/components/form/hook-form-select';
import HookFormTextarea from '@/components/form/hook-form-textarea';
import { Button } from '@/components/ui/button';
import { useStates } from '@/hooks/use-states';
import { createVeterinarianProfile, updateVeterinarianProfile } from '@/lib/api/veterinarians';
import { UserEmail, UserPhone, Veterinarian } from '@/lib/types/api';
import { Option } from '@/types/option';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Stethoscope } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { cn } from '@/utils/cn';

const veterinarianProfileSchema = z.object({
  bio: z.string().min(11, 'A biografia deve ter pelo menos 11 caracteres'),
  website: z.string().url().optional().or(z.literal('')),
  phoneId: z.string().min(1, 'Telefone é obrigatório'),
  professionalEmailId: z.string().min(1, 'Email profissional é obrigatório'),
  crmv: z.string().min(1, 'CRMV é obrigatório'),
  crmvStateId: z.string().min(1, 'Estado do CRMV é obrigatório'),
  providesEmergencyService: z.boolean().default(false),
  providesHomeService: z.boolean().default(false),
});

type VeterinarianProfileFormData = z.infer<typeof veterinarianProfileSchema>;

interface VeterinarianProfileFormProps {
  veterinarian?: Veterinarian | null;
  emails: UserEmail[];
  phones: UserPhone[];
}

const useFormOptions = (emails: UserEmail[], phones: UserPhone[]) => {
  return useMemo(() => {
    const sortedEmails = [...emails].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      return 0;
    });

    const emailOptions: Option[] = sortedEmails.map((email) => ({
      value: email.id.toString(),
      label: `${email.email}${email.isPrimary ? ' (Principal)' : ''}`,
    }));

    const sortedPhones = [...phones].sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1;
      if (!a.isPrimary && b.isPrimary) return 1;
      if (a.isWhatsApp && !b.isWhatsApp) return -1;
      if (!a.isWhatsApp && b.isWhatsApp) return 1;
      return 0;
    });

    const phoneOptions: Option[] = sortedPhones.map((phone) => ({
      value: phone.id.toString(),
      label: `${phone.ddi} ${phone.ddd} ${phone.number}${phone.isPrimary ? ' (Principal)' : ''}${phone.isWhatsApp ? ' - WhatsApp' : ''}`,
    }));

    return { emailOptions, phoneOptions };
  }, [emails, phones]);
};

export default function VeterinarianProfileForm({
  veterinarian,
  emails,
  phones,
}: VeterinarianProfileFormProps) {
  const { emailOptions, phoneOptions } = useFormOptions(emails, phones);
  const states = useStates();
  const [saving, setSaving] = useState(false);

  const stateOptions: Option[] = useMemo(
    () =>
      states.map((state) => ({
        value: state.id.toString(),
        label: `${state.name} (${state.uf})`,
      })),
    [states],
  );

  const getDefaultValues = useCallback((): VeterinarianProfileFormData => {
    if (veterinarian) {
      return {
        bio: veterinarian.bio || '',
        website: veterinarian.website || '',
        phoneId: veterinarian.phoneId?.toString() || '',
        professionalEmailId: veterinarian.professionalEmailId?.toString() || '',
        crmv: veterinarian.crmv || '',
        crmvStateId: veterinarian.crmvStateId?.toString() || '',
        providesEmergencyService: veterinarian.providesEmergencyService || false,
        providesHomeService: veterinarian.providesHomeService || false,
      };
    }

    const primaryEmail = emails.find((email) => email.isPrimary);
    const primaryPhone = phones.find((phone) => phone.isPrimary);

    return {
      bio: '',
      website: '',
      phoneId: primaryPhone?.id?.toString() || '',
      professionalEmailId: primaryEmail?.id?.toString() || '',
      crmv: '',
      crmvStateId: '',
      providesEmergencyService: false,
      providesHomeService: false,
    };
  }, [veterinarian, emails, phones]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(veterinarianProfileSchema),
    defaultValues: getDefaultValues(),
  });

  const bioValue = watch('bio') || '';

  useEffect(() => {
    const defaultValues = getDefaultValues();
    Object.entries(defaultValues).forEach(([key, value]) => {
      control._formValues[key] = value;
    });
  }, [getDefaultValues, control]);

  const onSubmit = useCallback(
    async (data: VeterinarianProfileFormData) => {
      setSaving(true);

      try {
        const profileData = {
          bio: data.bio,
          website: data.website,
          crmv: data.crmv,
          crmvStateId: parseInt(data.crmvStateId),
          phoneId: parseInt(data.phoneId),
          professionalEmailId: parseInt(data.professionalEmailId),
          providesEmergencyService: data.providesEmergencyService,
          providesHomeService: data.providesHomeService,
        };

        let result;
        if (veterinarian) {
          result = await updateVeterinarianProfile(profileData);
        } else {
          result = await updateVeterinarianProfile(profileData);
          if (!result.success) {
            result = await createVeterinarianProfile(profileData);
          }
        }

        if (result.success) {
          toast.success('Perfil profissional salvo com sucesso!');
        } else {
          toast.error(result.error || 'Erro ao salvar perfil profissional');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar perfil profissional';
        toast.error(errorMessage);
      } finally {
        setSaving(false);
      }
    },
    [veterinarian],
  );

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Stethoscope className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Perfil Profissional</h2>
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="bio" className="mb-2 block text-sm font-medium text-gray-700">
              Biografia
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <HookFormTextarea
                name="bio"
                control={control}
                error={errors.bio?.message}
                placeholder="Conte um pouco sobre sua experiência profissional, especialidades, áreas de atuação..."
                rows={4}
                hasCustomValidation={true}
              />
            </div>
            <div className="mt-1 flex justify-between items-center">
              <div className="text-xs">
                {errors.bio?.message && (
                  <span className="text-red-600">{errors.bio.message}</span>
                )}
              </div>
              <div className={cn(
                "text-xs font-medium",
                bioValue.length < 11 ? "text-red-600" : "text-gray-500"
              )}>
                {bioValue.length}/11 caracteres mínimos
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <HookFormField
              label="CRMV"
              name="crmv"
              type="text"
              control={control}
              error={errors.crmv?.message}
              placeholder="Ex: SP-12345"
              required
            />

            <HookFormSelect
              label="Estado do CRMV"
              name="crmvStateId"
              control={control}
              options={stateOptions}
              error={errors.crmvStateId?.message}
              placeholder="Estado onde está registrado"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <HookFormSelect
                label="Telefone Profissional"
                name="phoneId"
                control={control}
                options={phoneOptions}
                error={errors.phoneId?.message}
                placeholder={phoneOptions.length > 0 ? 'Selecione um telefone' : 'Nenhum telefone disponível'}
                required
              />
              {phoneOptions.length === 0 && (
                <p className="mt-1 text-xs text-orange-600">
                  Adicione um telefone em suas configurações de conta para poder selecioná-lo aqui.
                </p>
              )}
            </div>

            <HookFormField
              label="Website"
              name="website"
              type="url"
              control={control}
              error={errors.website?.message}
              placeholder="https://seusite.com.br (opcional)"
            />
          </div>

          <div>
            <HookFormSelect
              label="Email Profissional"
              name="professionalEmailId"
              control={control}
              options={emailOptions}
              error={errors.professionalEmailId?.message}
              placeholder={emailOptions.length > 0 ? 'Selecione um email' : 'Nenhum email disponível'}
              required
            />
            {emailOptions.length === 0 && (
              <p className="mt-1 text-xs text-orange-600">
                Adicione um email em suas configurações de conta para poder selecioná-lo aqui.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Serviços Oferecidos</h3>
            <p className="text-xs text-gray-500">Marque os serviços que você oferece aos seus clientes</p>
            <div className="space-y-2">
              <HookFormCheckbox label="Atendo emergências" name="providesEmergencyService" control={control} />
              <HookFormCheckbox label="Atendo em domicílio" name="providesHomeService" control={control} />
            </div>
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
              {saving ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
