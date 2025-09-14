import SpotlightCard from '@/components/ui/spotlight-card';
import { Pet } from '@/lib/types/api';
import { formatAge } from '@/utils/age';
import { Calendar, Heart, Info, PawPrint, Weight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const formatBirthDate = (birthDate: Date) => {
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

  return (
    <Link href={`/dashboard/usuario/pets/${pet.id}`} className="block">
      <SpotlightCard
        className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300"
        spotlightColor="blue">
        {/* Header com foto e nome */}
        <div className="mb-4 flex items-start space-x-4">
          <div className="relative">
            {pet.avatar ? (
              <Image
                src={pet.avatar}
                alt={pet.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-2 ring-blue-100">
                <PawPrint className="h-8 w-8 text-blue-600" />
              </div>
            )}
            {pet.hasPedigree && (
              <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400">
                <Heart className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-gray-900">{pet.name}</h3>
            <p className="text-sm text-gray-600">{pet.breed || 'Sem raça definida'}</p>
            <p className="text-xs text-gray-500">{getGenderLabel(pet.gender)}</p>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="space-y-3">
          {pet.birthDate && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Idade:</span>
              <span className="ml-auto font-medium text-gray-900">{formatAge(new Date(pet.birthDate))}</span>
            </div>
          )}

          {pet.birthDate && (
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Nascimento:</span>
              <span className="ml-auto font-medium text-gray-900">{formatBirthDate(pet.birthDate)}</span>
            </div>
          )}

          {pet.weight && (
            <div className="flex items-center text-sm">
              <Weight className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Peso:</span>
              <span className="ml-auto font-medium text-gray-900">{pet.weight}</span>
            </div>
          )}

          {pet.hasPedigree && pet.pedigreeNumber && (
            <div className="flex items-center text-sm">
              <Heart className="mr-2 h-4 w-4 text-yellow-500" />
              <span className="text-gray-600">Pedigree:</span>
              <span className="ml-auto font-medium text-gray-900">{pet.pedigreeNumber}</span>
            </div>
          )}

          {pet.description && (
            <div className="border-t border-gray-100 pt-2">
              <div className="flex items-start text-sm">
                <Info className="mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div>
                  <span className="mb-1 block text-gray-600">Observações:</span>
                  <p className="text-xs leading-relaxed text-gray-900">{pet.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer com status */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center text-xs text-gray-500">
            <div className={`mr-2 h-2 w-2 rounded-full ${pet.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
            {pet.isActive ? 'Ativo' : 'Inativo'}
          </div>

          <div className="text-xs text-gray-400">
            Cadastrado em {new Date(pet.createdAt).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
