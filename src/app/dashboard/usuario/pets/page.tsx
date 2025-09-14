'use client';

import PetCard from '@/components/dashboard/pets/pet-card';
import FormSelect from '@/components/form/select';
import SearchField from '@/components/form/search-field';
import UIButton from '@/components/ui/button';
import { useLoadingContext } from '@/components/ui/loading-provider';
import { LoadingInline } from '@/components/ui/loading-inline';
import { getUserPets } from '@/lib/api/pets';
import { usePetTypes } from '@/hooks/use-pet-types';
import { Pet } from '@/lib/types/api';
import { Grid, List, PawPrint, Plus, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

export default function MyPetsPage() {
  const router = useRouter();
  const { petTypes } = usePetTypes();
  const { startLoading, stopLoading } = useLoadingContext();

  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPetType, setFilterPetType] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterPedigree, setFilterPedigree] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        startLoading('pets-page', {
          type: 'data',
          message: 'Carregando seus pets...',
          size: 'lg',
          inline: true,
        });

        const result = await getUserPets();
        if (result.success && result.pets) {
          setPets(result.pets);
          setFilteredPets(result.pets);
        } else {
          toast.error('Erro ao carregar pets');
        }
      } catch {
        toast.error('Erro inesperado ao carregar pets');
      } finally {
        stopLoading('pets-page');
      }
    };

    fetchPets();
  }, [startLoading, stopLoading]);

  // Aplicar filtros sempre que mudarem os parâmetros
  useEffect(() => {
    let filtered = pets;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Filtro por tipo de pet
    if (filterPetType) {
      filtered = filtered.filter((pet) => pet.petTypeId?.toString() === filterPetType);
    }

    // Filtro por gênero
    if (filterGender) {
      filtered = filtered.filter((pet) => pet.gender === filterGender);
    }

    // Filtro por pedigree
    if (filterPedigree) {
      if (filterPedigree === 'yes') {
        filtered = filtered.filter((pet) => pet.hasPedigree === true);
      } else if (filterPedigree === 'no') {
        filtered = filtered.filter((pet) => pet.hasPedigree === false);
      }
    }

    setFilteredPets(filtered);
  }, [pets, searchQuery, filterPetType, filterGender, filterPedigree]);

  const handleAddPet = () => {
    router.push('/dashboard/usuario/pets/novo');
  };

  return (
    <LoadingInline id="pets-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Pets</h1>
            <p className="mt-2 text-gray-600">Gerencie as informações dos seus animais de estimação</p>
          </div>
          <UIButton onClick={handleAddPet} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Pet
          </UIButton>
        </div>

        {/* Filtros e Controles */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Busca */}
            <div className="flex-1">
              <SearchField
                name="search"
                placeholder="Buscar por nome, raça..."
                initialValue={searchQuery}
                onChange={(value) => setSearchQuery(value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <UIButton
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'border-blue-300 bg-blue-50' : ''}>
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </UIButton>
              <UIButton variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </UIButton>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormSelect
                  label="Tipo de Pet"
                  name="petType"
                  value={filterPetType}
                  options={[
                    { value: '', label: 'Todos os tipos' },
                    ...(petTypes?.map((type) => ({
                      value: type.id.toString(),
                      label: type.name,
                    })) || []),
                  ]}
                  onChange={(value) => setFilterPetType(value)}
                />
                <FormSelect
                  label="Gênero"
                  name="gender"
                  value={filterGender}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'M', label: 'Macho' },
                    { value: 'F', label: 'Fêmea' },
                    { value: 'O', label: 'Outro' },
                  ]}
                  onChange={(value) => setFilterGender(value)}
                />
                <FormSelect
                  label="Pedigree"
                  name="pedigree"
                  value={filterPedigree}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'true', label: 'Com Pedigree' },
                    { value: 'false', label: 'Sem Pedigree' },
                  ]}
                  onChange={(value) => setFilterPedigree(value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Lista de Pets */}
        {filteredPets.length === 0 ? (
          <div className="py-12 text-center">
            {pets.length === 0 ? (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <PawPrint className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum pet encontrado</h3>
                <p className="mb-6 text-gray-500">
                  Você ainda não cadastrou nenhum pet. Clique em &quot;Cadastrar Pet&quot; para começar.
                </p>
                <UIButton onClick={handleAddPet} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Pet
                </UIButton>
              </div>
            ) : (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum pet encontrado</h3>
                <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
                <UIButton
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterPetType('');
                    setFilterGender('');
                    setFilterPedigree('');
                  }}>
                  Limpar Filtros
                </UIButton>
              </div>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}

        {/* Resultados */}
        {filteredPets.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Mostrando {filteredPets.length} de {pets.length} pet{pets.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </LoadingInline>
  );
}
