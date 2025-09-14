'use client';

import { PetFormData } from '@/components/dashboard/pets/pet-form';
import { PetType } from '@/lib/types/api';
import { PawPrint, Calendar, Weight, Heart, Info } from 'lucide-react';
import Image from 'next/image';

interface PetPreviewProps {
  formData: PetFormData;
  petTypes: PetType[];
}

export default function PetPreview({ formData, petTypes }: PetPreviewProps) {
  const formatAge = (birthDate: string) => {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);

      if (remainingMonths === 0) {
        return `${years} ${years === 1 ? 'ano' : 'anos'}`;
      }
      return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
  };

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return null;
    return new Date(birthDate).toLocaleDateString('pt-BR');
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case 'M':
        return 'Macho';
      case 'F':
        return 'Fêmea';
      case 'O':
        return 'Outro';
      default:
        return 'Não informado';
    }
  };

  const getPetTypeName = (petTypeId: string) => {
    const petType = petTypes.find((type) => type.id.toString() === petTypeId);
    return petType?.name || 'Tipo não selecionado';
  };

  // Se não há dados suficientes, mostrar placeholder
  if (!formData.name && !formData.petTypeId) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6">
        <div className="text-center">
          <PawPrint className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Prévia do Pet</h3>
          <p className="mt-1 text-sm text-gray-500">Preencha as informações para ver como o card do seu pet ficará</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300">
      {/* Header com foto e nome */}
      <div className="mb-4 flex items-start space-x-4">
        <div className="relative">
          {formData.avatar ? (
            <Image
              src={formData.avatar}
              alt={formData.name || 'Pet'}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-2 ring-blue-100">
              <PawPrint className="h-8 w-8 text-blue-600" />
            </div>
          )}
          {formData.hasPedigree && (
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
              <Heart className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-gray-900">{formData.name || 'Nome do pet'}</h3>
          <p className="text-sm text-gray-600">{formData.breed || 'Sem raça definida'}</p>
          <p className="text-xs text-gray-500">{getGenderLabel(formData.gender)}</p>
        </div>
      </div>

      {/* Informações detalhadas */}
      <div className="space-y-3">
        {/* Tipo de Pet */}
        <div className="flex items-center text-sm">
          <PawPrint className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-600">Tipo:</span>
          <span className="ml-auto font-medium text-gray-900">{getPetTypeName(formData.petTypeId)}</span>
        </div>

        {/* Idade calculada */}
        {formData.birthDate && (
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Idade:</span>
            <span className="ml-auto font-medium text-gray-900">{formatAge(formData.birthDate)}</span>
          </div>
        )}

        {/* Data de nascimento */}
        {formData.birthDate && (
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Nascimento:</span>
            <span className="ml-auto font-medium text-gray-900">{formatBirthDate(formData.birthDate)}</span>
          </div>
        )}

        {/* Peso */}
        {formData.weight && (
          <div className="flex items-center text-sm">
            <Weight className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Peso:</span>
            <span className="ml-auto font-medium text-gray-900">{formData.weight}kg</span>
          </div>
        )}

        {/* Pedigree */}
        {formData.hasPedigree && formData.pedigreeNumber && (
          <div className="flex items-center text-sm">
            <Heart className="mr-2 h-4 w-4 text-yellow-500" />
            <span className="text-gray-600">Pedigree:</span>
            <span className="ml-auto font-medium text-gray-900">{formData.pedigreeNumber}</span>
          </div>
        )}

        {/* Descrição */}
        {formData.description && (
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-start text-sm">
              <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
              <div>
                <span className="mb-1 block text-gray-600">Observações:</span>
                <p className="text-xs leading-relaxed text-gray-900">{formData.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer com status */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center text-xs text-gray-500">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-400" />
          Novo pet
        </div>

        <div className="text-xs text-gray-400">Será cadastrado hoje</div>
      </div>
    </div>
  );
}
