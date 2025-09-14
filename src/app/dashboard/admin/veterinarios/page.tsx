'use client';

import FormSelect from '@/components/form/select';
import SearchField from '@/components/form/search-field';
import UIButton from '@/components/ui/button';
import { useLoadingContext } from '@/components/ui/loading-provider';
import { LoadingInline } from '@/components/ui/loading-inline';
import {
  Grid,
  List,
  Stethoscope,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Shield,
  Mail,
  MapPin,
  Star,
  Home,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

interface AdminVeterinarian {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  crmv: string;
  crmvState: string;
  bio?: string;
  website?: string;
  avatar?: string;
  profilePhotos?: string[];
  providesEmergencyService: boolean;
  providesHomeService: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  totalAppointments: number;
  averageRating: number;
  totalReviews: number;
  specializations: string[];
  city: string;
  state: string;
}

export default function AdminVeterinariansPage() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingContext();

  const [veterinarians, setVeterinarians] = useState<AdminVeterinarian[]>([]);
  const [filteredVeterinarians, setFilteredVeterinarians] = useState<AdminVeterinarian[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEmergency, setFilterEmergency] = useState('');
  const [filterHomeService, setFilterHomeService] = useState('');
  const [filterState, setFilterState] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dados mockados
  const mockVeterinarians: AdminVeterinarian[] = useMemo(
    () => [
      {
        id: 1,
        userId: 101,
        firstName: 'Dr. Carlos',
        lastName: 'Oliveira',
        email: 'carlos.oliveira@vet.com',
        crmv: '12345',
        crmvState: 'SP',
        bio: 'Veterinário especializado em pequenos animais com 10 anos de experiência. Atendo cães, gatos e animais exóticos.',
        website: 'https://drveterinario.com.br',
        avatar: '/images/vet-avatar-1.jpg',
        profilePhotos: ['/images/vet-photo-1.jpg', '/images/vet-photo-2.jpg'],
        providesEmergencyService: true,
        providesHomeService: false,
        isActive: true,
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-01-20T09:00:00'),
        totalAppointments: 156,
        averageRating: 4.8,
        totalReviews: 23,
        specializations: ['Pequenos Animais', 'Cirurgia', 'Emergência'],
        city: 'São Paulo',
        state: 'SP',
      },
      {
        id: 2,
        userId: 102,
        firstName: 'Dra. Fernanda',
        lastName: 'Lima',
        email: 'fernanda.lima@vet.com',
        crmv: '67890',
        crmvState: 'RJ',
        bio: 'Especialista em felinos e medicina preventiva. Atendo em domicílio para maior conforto dos pets.',
        website: 'https://vetdomiciliar.com.br',
        avatar: '/images/vet-avatar-2.jpg',
        profilePhotos: ['/images/vet-photo-3.jpg'],
        providesEmergencyService: false,
        providesHomeService: true,
        isActive: true,
        createdAt: new Date('2023-11-20'),
        updatedAt: new Date('2024-01-18'),
        lastLogin: new Date('2024-01-20T11:20:00'),
        totalAppointments: 89,
        averageRating: 4.9,
        totalReviews: 15,
        specializations: ['Felinos', 'Medicina Preventiva', 'Atendimento Domiciliar'],
        city: 'Rio de Janeiro',
        state: 'RJ',
      },
      {
        id: 3,
        userId: 103,
        firstName: 'Dr. Roberto',
        lastName: 'Silva',
        email: 'roberto.silva@vet.com',
        crmv: '11223',
        crmvState: 'MG',
        bio: 'Veterinário especializado em animais de grande porte e equinos. Atendo fazendas e haras.',
        website: 'https://vetgrandesanimais.com.br',
        avatar: '/images/vet-avatar-3.jpg',
        providesEmergencyService: true,
        providesHomeService: true,
        isActive: true,
        createdAt: new Date('2023-10-15'),
        updatedAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-19T16:30:00'),
        totalAppointments: 234,
        averageRating: 4.7,
        totalReviews: 31,
        specializations: ['Grandes Animais', 'Equinos', 'Bovinos'],
        city: 'Belo Horizonte',
        state: 'MG',
      },
      {
        id: 4,
        userId: 104,
        firstName: 'Dra. Ana',
        lastName: 'Costa',
        email: 'ana.costa@vet.com',
        crmv: '44556',
        crmvState: 'PR',
        bio: 'Especialista em dermatologia veterinária e alergias. Atendo casos complexos de pele.',
        website: 'https://dermatovet.com.br',
        avatar: '/images/vet-avatar-4.jpg',
        profilePhotos: ['/images/vet-photo-4.jpg', '/images/vet-photo-5.jpg'],
        providesEmergencyService: false,
        providesHomeService: false,
        isActive: false,
        createdAt: new Date('2023-09-10'),
        updatedAt: new Date('2024-01-05'),
        lastLogin: new Date('2024-01-15T14:45:00'),
        totalAppointments: 67,
        averageRating: 4.6,
        totalReviews: 12,
        specializations: ['Dermatologia', 'Alergias', 'Pequenos Animais'],
        city: 'Curitiba',
        state: 'PR',
      },
      {
        id: 5,
        userId: 105,
        firstName: 'Dr. Paulo',
        lastName: 'Santos',
        email: 'paulo.santos@vet.com',
        crmv: '77889',
        crmvState: 'RS',
        bio: 'Especialista em cardiologia veterinária e ultrassonografia. Atendo casos cardíacos complexos.',
        website: 'https://cardiovet.com.br',
        avatar: '/images/vet-avatar-5.jpg',
        providesEmergencyService: true,
        providesHomeService: false,
        isActive: true,
        createdAt: new Date('2023-08-25'),
        updatedAt: new Date('2024-01-12'),
        lastLogin: new Date('2024-01-20T08:15:00'),
        totalAppointments: 198,
        averageRating: 4.9,
        totalReviews: 28,
        specializations: ['Cardiologia', 'Ultrassonografia', 'Emergência'],
        city: 'Porto Alegre',
        state: 'RS',
      },
      {
        id: 6,
        userId: 106,
        firstName: 'Dra. Mariana',
        lastName: 'Almeida',
        email: 'mariana.almeida@vet.com',
        crmv: '00112',
        crmvState: 'SC',
        bio: 'Especialista em fisioterapia veterinária e reabilitação. Ajudo pets a se recuperarem de lesões.',
        website: 'https://fisiovet.com.br',
        avatar: '/images/vet-avatar-6.jpg',
        providesEmergencyService: false,
        providesHomeService: true,
        isActive: true,
        createdAt: new Date('2023-07-30'),
        updatedAt: new Date('2024-01-08'),
        lastLogin: new Date('2024-01-20T10:30:00'),
        totalAppointments: 123,
        averageRating: 4.8,
        totalReviews: 19,
        specializations: ['Fisioterapia', 'Reabilitação', 'Ortopedia'],
        city: 'Florianópolis',
        state: 'SC',
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        startLoading('admin-veterinarians-page', {
          type: 'data',
          message: 'Carregando veterinários...',
          size: 'lg',
          inline: true,
        });

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setVeterinarians(mockVeterinarians);
        setFilteredVeterinarians(mockVeterinarians);
      } catch {
        toast.error('Erro inesperado ao carregar veterinários');
      } finally {
        stopLoading('admin-veterinarians-page');
      }
    };

    fetchVeterinarians();
  }, [startLoading, stopLoading, mockVeterinarians]);

  // Aplicar filtros sempre que mudarem os parâmetros
  useEffect(() => {
    let filtered = veterinarians;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (vet) =>
          `${vet.firstName} ${vet.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.crmv.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.specializations.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Filtro por status
    if (filterStatus) {
      if (filterStatus === 'active') {
        filtered = filtered.filter((vet) => vet.isActive);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter((vet) => !vet.isActive);
      }
    }

    // Filtro por emergência
    if (filterEmergency) {
      if (filterEmergency === 'yes') {
        filtered = filtered.filter((vet) => vet.providesEmergencyService);
      } else if (filterEmergency === 'no') {
        filtered = filtered.filter((vet) => !vet.providesEmergencyService);
      }
    }

    // Filtro por atendimento domiciliar
    if (filterHomeService) {
      if (filterHomeService === 'yes') {
        filtered = filtered.filter((vet) => vet.providesHomeService);
      } else if (filterHomeService === 'no') {
        filtered = filtered.filter((vet) => !vet.providesHomeService);
      }
    }

    // Filtro por estado
    if (filterState) {
      filtered = filtered.filter((vet) => vet.state === filterState);
    }

    setFilteredVeterinarians(filtered);
  }, [veterinarians, searchQuery, filterStatus, filterEmergency, filterHomeService, filterState]);

  const handleViewVeterinarian = (vetId: number) => {
    router.push(`/dashboard/admin/veterinarios/${vetId}`);
  };

  const handleEditVeterinarian = (vetId: number) => {
    router.push(`/dashboard/admin/veterinarios/${vetId}/editar`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCRMV = (crmv: string, state: string) => {
    return `${crmv}-${state}`;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : XCircle;
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <LoadingInline id="admin-veterinarians-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Veterinários</h1>
            <p className="mt-2 text-gray-600">Gerencie todos os veterinários do sistema</p>
          </div>
          <UIButton className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Veterinário
          </UIButton>
        </div>

        {/* Filtros e Controles */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Busca */}
            <div className="flex-1">
              <SearchField
                name="search"
                placeholder="Buscar por nome, email, CRMV ou especialização..."
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <FormSelect
                  label="Status"
                  name="status"
                  value={filterStatus}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'active', label: 'Ativos' },
                    { value: 'inactive', label: 'Inativos' },
                  ]}
                  onChange={(value) => setFilterStatus(value)}
                />
                <FormSelect
                  label="Emergência"
                  name="emergency"
                  value={filterEmergency}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'yes', label: 'Atende Emergência' },
                    { value: 'no', label: 'Não Atende' },
                  ]}
                  onChange={(value) => setFilterEmergency(value)}
                />
                <FormSelect
                  label="Domiciliar"
                  name="homeService"
                  value={filterHomeService}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'yes', label: 'Atende em Casa' },
                    { value: 'no', label: 'Não Atende' },
                  ]}
                  onChange={(value) => setFilterHomeService(value)}
                />
                <FormSelect
                  label="Estado"
                  name="state"
                  value={filterState}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'SP', label: 'São Paulo' },
                    { value: 'RJ', label: 'Rio de Janeiro' },
                    { value: 'MG', label: 'Minas Gerais' },
                    { value: 'PR', label: 'Paraná' },
                    { value: 'RS', label: 'Rio Grande do Sul' },
                    { value: 'SC', label: 'Santa Catarina' },
                  ]}
                  onChange={(value) => setFilterState(value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Lista de Veterinários */}
        {filteredVeterinarians.length === 0 ? (
          <div className="py-12 text-center">
            {veterinarians.length === 0 ? (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Stethoscope className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum veterinário encontrado</h3>
                <p className="mb-6 text-gray-500">
                  Não há veterinários cadastrados no sistema. Clique em &quot;Novo Veterinário&quot; para começar.
                </p>
                <UIButton className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Veterinário
                </UIButton>
              </div>
            ) : (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum veterinário encontrado</h3>
                <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
                <UIButton
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('');
                    setFilterEmergency('');
                    setFilterHomeService('');
                    setFilterState('');
                  }}>
                  Limpar Filtros
                </UIButton>
              </div>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredVeterinarians.map((vet) => {
              const StatusIcon = getStatusIcon(vet.isActive);
              return (
                <div
                  key={vet.id}
                  className={`rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md ${
                    !vet.isActive ? 'opacity-60' : ''
                  }`}>
                  {/* Header do Card */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {vet.avatar ? (
                          <Image
                            src={vet.avatar}
                            alt={`${vet.firstName} ${vet.lastName}`}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-blue-100">
                            <Stethoscope className="h-6 w-6 text-green-600" />
                          </div>
                        )}
                        {!vet.isActive && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {vet.firstName} {vet.lastName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">CRMV: {formatCRMV(vet.crmv, vet.crmvState)}</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(vet.isActive)}`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {getStatusLabel(vet.isActive)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UIButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewVeterinarian(vet.id)}
                        className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </UIButton>
                      <UIButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditVeterinarian(vet.id)}
                        className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </UIButton>
                    </div>
                  </div>

                  {/* Informações do Veterinário */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{vet.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {vet.city}, {vet.state}
                      </span>
                    </div>
                    {vet.website && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Shield className="h-4 w-4" />
                        <a href={vet.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Especializações */}
                  {vet.specializations.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-sm font-medium text-gray-700">Especializações:</p>
                      <div className="flex flex-wrap gap-1">
                        {vet.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Serviços */}
                  <div className="mt-4 flex items-center space-x-4">
                    {vet.providesEmergencyService && (
                      <div className="flex items-center space-x-1 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Emergência</span>
                      </div>
                    )}
                    {vet.providesHomeService && (
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <Home className="h-4 w-4" />
                        <span>Domiciliar</span>
                      </div>
                    )}
                  </div>

                  {/* Estatísticas */}
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Consultas</p>
                        <p className="font-semibold text-gray-900">{vet.totalAppointments}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Avaliação</p>
                        <div className="flex items-center space-x-1">
                          {renderStars(vet.averageRating)}
                          <span className="ml-1 text-xs text-gray-600">({vet.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Último Login */}
                  {vet.lastLogin && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-500">Último login: {formatDate(vet.lastLogin)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Resultados */}
        {filteredVeterinarians.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Mostrando {filteredVeterinarians.length} de {veterinarians.length} veterinário
            {veterinarians.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </LoadingInline>
  );
}
