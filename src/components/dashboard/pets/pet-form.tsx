'use client';

import PetPreview from '@/components/dashboard/pets/pet-preview';
import FormCheckbox from '@/components/form/checkbox';
import FormDateSelector from '@/components/form/date-selector';
import FormField from '@/components/form/field';
import ImageUpload from '@/components/form/image-upload';
import FormSelect from '@/components/form/select';
import FormTextarea from '@/components/form/textarea';
import { Button } from '@/components/ui/button';
import { usePetTypes } from '@/hooks/use-pet-types';
import { AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Interfaces
export interface PetFormData {
  name: string;
  petTypeId: string;
  breed?: string;
  age?: string;
  birthDate?: string;
  gender?: string;
  weight?: number;
  hasPedigree: boolean;
  pedigreeNumber?: string;
  description?: string;
  avatar?: string;
}

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
  isEdit?: boolean; // Para identificar se é edição
}

const PetForm = ({ initialData, onSubmit, submitLabel, loading, onCancel, isEdit = false }: PetFormProps) => {
  const { petTypes } = usePetTypes();

  const [formData, setFormData] = useState<PetFormData>({
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
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.avatar || null);

  // Atualizar photoPreview quando initialData mudar
  useEffect(() => {
    if (initialData?.avatar) {
      setPhotoPreview(initialData.avatar);
    }
  }, [initialData?.avatar]);
  const [state, setState] = useState<PetFormState | null>(null);

  const handleInputChange = useCallback(
    (field: keyof PetFormData, value: string | number | boolean | undefined) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Limpar erro quando usuário começar a digitar
      if (state?.error) {
        setState(null);
      }
    },
    [state?.error],
  );

  const handlePhotoChange = (base64: string) => {
    setPhotoPreview(base64);
    handleInputChange('avatar', base64);
  };

  const handlePhotoRemove = () => {
    setPhotoPreview(null);
    handleInputChange('avatar', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.name || !formData.petTypeId) {
      setState({
        success: false,
        error: 'Por favor, preencha todos os campos obrigatórios',
      });
      return;
    }

    if (formData.hasPedigree && !formData.pedigreeNumber) {
      setState({
        success: false,
        error: 'Número do pedigree é obrigatório quando o pet possui pedigree',
      });
      return;
    }

    try {
      await onSubmit(formData);
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <FormField
                label="Nome do Pet"
                name="name"
                type="text"
                placeholder="Digite o nome do seu pet"
                initialValue={formData.name}
                required
                disabled={loading || isEdit}
                onChange={(value) => handleInputChange('name', value)}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FormSelect
                    label="Tipo de Pet"
                    name="petTypeId"
                    value={formData.petTypeId}
                    required
                    options={petTypeOptions}
                    disabled={loading || isEdit}
                    onChange={(value) => handleInputChange('petTypeId', value)}
                  />
                </div>

                <div>
                  <FormField
                    label="Raça"
                    name="breed"
                    type="text"
                    placeholder="Digite a raça do pet"
                    initialValue={formData.breed || ''}
                    disabled={loading || isEdit}
                    onChange={(value) => handleInputChange('breed', value)}
                  />
                </div>
              </div>

              <div>
                <FormSelect
                  label="Gênero"
                  name="gender"
                  value={formData.gender || ''}
                  options={genderOptions}
                  disabled={loading || isEdit}
                  onChange={(value) => handleInputChange('gender', value)}
                />
              </div>
            </div>

            {/* Inputs hidden para FormData */}
            <input type="hidden" name="petTypeId" value={formData.petTypeId} />
            <input type="hidden" name="gender" value={formData.gender || ''} />
          </div>

          {/* Informações Físicas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Físicas</h3>

            <div className="space-y-4">
              <FormField
                label="Peso (kg)"
                name="weight"
                type="number"
                placeholder="0.0"
                initialValue={formData.weight?.toString() || ''}
                disabled={loading}
                onChange={(value) => handleInputChange('weight', value ? parseFloat(value) : undefined)}
              />

              <div>
                <FormDateSelector
                  label="Data de Nascimento"
                  name="birthDate"
                  value={formData.birthDate || ''}
                  disabled={loading || isEdit}
                  onChange={(value) => handleInputChange('birthDate', value)}
                />
              </div>
            </div>

            {/* Input hidden para birthDate para FormData */}
            <input type="hidden" name="birthDate" value={formData.birthDate || ''} />
          </div>

          {/* Informações de Pedigree */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações de Pedigree</h3>

            <div className="space-y-4">
              <FormCheckbox
                name="hasPedigree"
                label="Este pet possui pedigree"
                value={formData.hasPedigree}
                disabled={loading}
                onChange={(value) => handleInputChange('hasPedigree', value)}
              />

              {formData.hasPedigree && (
                <FormField
                  label="Número do Pedigree"
                  name="pedigreeNumber"
                  type="text"
                  placeholder="Digite o número do pedigree"
                  initialValue={formData.pedigreeNumber || ''}
                  required
                  disabled={loading}
                  onChange={(value) => handleInputChange('pedigreeNumber', value)}
                />
              )}
            </div>

            {/* Input hidden para hasPedigree para FormData */}
            <input type="hidden" name="hasPedigree" value={formData.hasPedigree ? 'on' : ''} />
          </div>

          {/* Descrição */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Informações Adicionais</h3>

            <FormTextarea
              label="Descrição"
              name="description"
              placeholder="Conte um pouco sobre o seu pet..."
              initialValue={formData.description || ''}
              disabled={loading}
              onChange={(value) => handleInputChange('description', value)}
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
                disabled={loading || !formData.name || !formData.petTypeId}>
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
                ...formData,
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
