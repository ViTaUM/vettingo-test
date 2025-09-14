'use client';

import PetPreview from '@/components/dashboard/pets/pet-preview';
import HookFormCheckbox from '@/components/form/hook-form-checkbox';
import HookFormField from '@/components/form/hook-form-field';
import HookFormSelect from '@/components/form/hook-form-select';
import HookFormTextarea from '@/components/form/hook-form-textarea';
import ImageUpload from '@/components/form/image-upload';
import { Button } from '@/components/ui/button';
import { usePetTypes } from '@/hooks/use-pet-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const petFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  petTypeId: z.string().min(1, 'Tipo de pet é obrigatório'),
  breed: z.string().optional(),
  age: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  weight: z.number().optional(),
  hasPedigree: z.boolean().default(false),
  pedigreeNumber: z.string().optional(),
  description: z.string().optional(),
  avatar: z.string().optional(),
}).refine((data) => {
  if (data.hasPedigree && !data.pedigreeNumber) {
    return false;
  }
  return true;
}, {
  message: 'Número do pedigree é obrigatório quando o pet possui pedigree',
  path: ['pedigreeNumber'],
});

export type PetFormData = z.infer<typeof petFormSchema>;

interface PetFormState {
  success?: boolean;
  error?: string;
}

interface PetFormProps {
  initialData?: Partial<PetFormData>;
  onSubmit: (data: PetFormData) => Promise<void>;
  submitLabel: string;
  loading: boolean;
  onCancel: () => void;
  isEdit?: boolean;
}

const PetForm = ({ initialData, onSubmit, submitLabel, loading, onCancel, isEdit = false }: PetFormProps) => {
  const { petTypes } = usePetTypes();
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.avatar || null);
  const [state, setState] = useState<PetFormState | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      petTypeId: '',
      breed: '',
      birthDate: '',
      gender: '',
      weight: undefined,
      hasPedigree: false,
      pedigreeNumber: '',
      description: '',
      avatar: '',
      ...initialData,
    },
  });

  const watchedHasPedigree = watch('hasPedigree');

  useEffect(() => {
    if (initialData?.avatar) {
      setPhotoPreview(initialData.avatar);
    }
  }, [initialData?.avatar]);

  const handlePhotoChange = useCallback((base64: string) => {
    setPhotoPreview(base64);
    setValue('avatar', base64);
  }, [setValue]);

  const handlePhotoRemove = useCallback(() => {
    setPhotoPreview(null);
    setValue('avatar', '');
  }, [setValue]);

  const handleFormSubmit = async (data: PetFormData) => {
    try {
      await onSubmit(data);
      setState({ success: true });
    } catch {
      setState({
        success: false,
        error: 'Erro ao salvar as informações do pet',
      });
    }
  };

  const genderOptions = [
    { value: 'M', label: 'Macho' },
    { value: 'F', label: 'Fêmea' },
    { value: 'O', label: 'Outro' },
  ];

  const petTypeOptions = petTypes.map((type) => ({
    value: type.id.toString(),
    label: type.name,
  }));

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Formulário - Coluna Esquerda */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Foto do Pet */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Foto do Pet</h3>
            <ImageUpload
              value={photoPreview || undefined}
              onChange={handlePhotoChange}
              onRemove={handlePhotoRemove}
              disabled={loading}
              size="md"
              aspectRatio="circle"
              placeholder="Escolher Foto"
            />
          </div>

          {/* Informações Básicas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Básicas</h3>

            <div className="space-y-4">
              <HookFormField
                label="Nome do Pet"
                name="name"
                type="text"
                placeholder="Digite o nome do seu pet"
                control={control}
                error={errors.name?.message}
                required
                disabled={loading || isEdit}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <HookFormSelect
                    label="Tipo de Pet"
                    name="petTypeId"
                    control={control}
                    error={errors.petTypeId?.message}
                    required
                    options={petTypeOptions}
                    disabled={loading || isEdit}
                  />
                </div>

                <div>
                  <HookFormField
                    label="Raça"
                    name="breed"
                    type="text"
                    placeholder="Digite a raça do pet"
                    control={control}
                    error={errors.breed?.message}
                    disabled={loading || isEdit}
                  />
                </div>
              </div>

              <div>
                <HookFormSelect
                  label="Gênero"
                  name="gender"
                  control={control}
                  error={errors.gender?.message}
                  options={genderOptions}
                  disabled={loading || isEdit}
                />
              </div>
            </div>
          </div>

          {/* Informações Físicas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Físicas</h3>

            <div className="space-y-4">
              <HookFormField
                label="Peso (kg)"
                name="weight"
                type="number"
                placeholder="0.0"
                control={control}
                error={errors.weight?.message}
                disabled={loading}
              />

              <HookFormField
                label="Data de Nascimento"
                name="birthDate"
                type="date"
                control={control}
                error={errors.birthDate?.message}
                disabled={loading}
              />
            </div>
          </div>

          {/* Informações de Pedigree */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações de Pedigree</h3>

            <div className="space-y-4">
              <HookFormCheckbox
                label="Este pet possui pedigree"
                name="hasPedigree"
                control={control}
                disabled={loading}
              />

              {watchedHasPedigree && (
                <HookFormField
                  label="Número do Pedigree"
                  name="pedigreeNumber"
                  type="text"
                  placeholder="Digite o número do pedigree"
                  control={control}
                  error={errors.pedigreeNumber?.message}
                  required
                  disabled={loading}
                />
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Adicionais</h3>

            <HookFormTextarea
              label="Descrição"
              name="description"
              placeholder="Conte um pouco sobre o seu pet..."
              control={control}
              error={errors.description?.message}
              disabled={loading}
              rows={4}
            />
          </div>

          {/* Botões de Ação */}
          <div className="space-y-4">
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid"
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                loading={loading}
                disabled={loading}>
                {loading ? 'Salvando...' : submitLabel}
              </Button>
            </div>

            {/* Feedback de Erro */}
            {state?.error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{state.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Preview - Coluna Direita */}
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Prévia do Pet</h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <PetPreview
              formData={{
                name: watch('name') || '',
                petTypeId: watch('petTypeId') || '',
                breed: watch('breed') || '',
                age: watch('age') || '',
                birthDate: watch('birthDate') || '',
                gender: watch('gender') || '',
                weight: watch('weight') || undefined,
                hasPedigree: watch('hasPedigree') || false,
                pedigreeNumber: watch('pedigreeNumber') || '',
                description: watch('description') || '',
                avatar: photoPreview || undefined,
              }}
              petTypes={petTypes}
            />
          </div>
        </div>

        {/* Dicas */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h4 className="mb-3 text-sm font-medium text-blue-900">💡 Dicas para um cadastro completo</h4>
          <ul className="space-y-2 text-xs text-blue-800">
            <li>• Adicione uma foto clara do seu pet</li>
            <li>• Preencha todas as informações disponíveis</li>
            <li>• Mantenha o peso atualizado para consultas</li>
            <li>• A descrição ajuda veterinários a conhecer melhor seu pet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PetForm; 