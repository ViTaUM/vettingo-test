'use client';

import AddressCard from '@/components/dashboard/addresses/address-card';
import FormSelect from '@/components/form/select';
import SearchField from '@/components/form/search-field';
import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { UserAddress } from '@/lib/types/api';
import { Grid3X3, List, MapPin, Plus, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

// Dados mockados para demonstração
const mockAddresses: UserAddress[] = [
  {
    id: 1,
    userId: 1,
    type: 'personal',
    label: 'Casa',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    zipCode: '01000-000',
    cityId: 1,
    stateId: 1,
    isPrimary: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    userId: 1,
    type: 'work',
    label: 'Trabalho',
    street: 'Avenida Paulista',
    number: '1000',
    complement: 'Sala 1501',
    neighborhood: 'Bela Vista',
    zipCode: '01310-100',
    cityId: 1,
    stateId: 1,
    isPrimary: false,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 3,
    userId: 1,
    type: 'billing',
    label: 'Endereço de Cobrança',
    street: 'Rua Augusta',
    number: '500',
    complement: 'Loja 10',
    neighborhood: 'Consolação',
    zipCode: '01212-000',
    cityId: 1,
    stateId: 1,
    isPrimary: false,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 4,
    userId: 1,
    type: 'other',
    label: 'Casa da Praia',
    street: 'Rua da Praia',
    number: '789',
    complement: 'Casa 2',
    neighborhood: 'Centro',
    zipCode: '11600-000',
    cityId: 2,
    stateId: 1,
    isPrimary: false,
    isActive: false,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

export default function EnderecosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<UserAddress[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Por enquanto usando dados mockados
        // const result = await getUserAddresses();
        // if (result.success && result.addresses) {
        //   setAddresses(result.addresses);
        //   setFilteredAddresses(result.addresses);
        // } else {
        //   toast.error('Erro ao carregar endereços');
        // }

        setAddresses(mockAddresses);
        setFilteredAddresses(mockAddresses);
      } catch (error) {
        toast.error('Erro inesperado ao carregar endereços' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Aplicar filtros sempre que mudarem os parâmetros
  useEffect(() => {
    let filtered = addresses;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (address) =>
          address.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          address.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
          address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
          address.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filtro por tipo
    if (filterType) {
      filtered = filtered.filter((address) => address.type === filterType);
    }

    // Filtro por status
    if (filterStatus) {
      const isActive = filterStatus === 'active';
      filtered = filtered.filter((address) => address.isActive === isActive);
    }

    setFilteredAddresses(filtered);
  }, [addresses, searchQuery, filterType, filterStatus]);

  // Criar opções para os selects
  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'work', label: 'Trabalho' },
    { value: 'billing', label: 'Cobrança' },
    { value: 'other', label: 'Outro' },
  ];

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
  ];

  const handleAddAddress = () => {
    router.push('/dashboard/usuario/enderecos/novo');
  };

  const getAddressStats = () => {
    const stats = {
      total: addresses.length,
      active: addresses.filter((a) => a.isActive).length,
      primary: addresses.filter((a) => a.isPrimary).length,
      personal: addresses.filter((a) => a.type === 'personal').length,
    };
    return stats;
  };

  const stats = getAddressStats();

  if (loading) {
    return <PetDataLoading type="general" size="lg" inline={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Endereços</h1>
          <p className="mt-2 text-gray-600">Gerencie seus endereços pessoais, de trabalho e de cobrança</p>
        </div>
        <UIButton onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Endereço
        </UIButton>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total de Endereços</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-sm text-gray-500">Ativos</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.primary}</div>
          <div className="text-sm text-gray-500">Principal</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.personal}</div>
          <div className="text-sm text-gray-500">Pessoais</div>
        </div>
      </div>

      {/* Filtros e Controles */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Busca */}
          <div className="flex-1">
            <SearchField
              name="search"
              placeholder="Buscar por rótulo, rua ou bairro..."
              initialValue={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            {/* Toggle de Filtros */}
            <UIButton
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'border-blue-300 bg-blue-50' : ''}>
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </UIButton>

            {/* View Mode Toggle */}
            <div className="flex overflow-hidden rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}>
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelect
                label="Tipo de Endereço"
                name="type"
                value={filterType}
                options={typeOptions}
                onChange={(value) => setFilterType(value)}
              />

              <FormSelect
                label="Status"
                name="status"
                value={filterStatus}
                options={statusOptions}
                onChange={(value) => setFilterStatus(value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de Endereços */}
      {filteredAddresses.length === 0 ? (
        <div className="py-12 text-center">
          {addresses.length === 0 ? (
            // Nenhum endereço cadastrado
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum endereço cadastrado</h3>
              <p className="mb-6 text-gray-500">
                Adicione seu primeiro endereço para facilitar o agendamento de consultas e entrega de documentos.
              </p>
              <UIButton onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Endereço
              </UIButton>
            </div>
          ) : (
            // Nenhum resultado na busca/filtro
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum endereço encontrado</h3>
              <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
              <UIButton
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('');
                  setFilterStatus('');
                }}>
                Limpar Filtros
              </UIButton>
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredAddresses.map((address) => (
            <AddressCard key={address.id} address={address} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Resultados */}
      {filteredAddresses.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {filteredAddresses.length} de {addresses.length} endereço{addresses.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
