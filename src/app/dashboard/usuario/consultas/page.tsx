'use client';

import AppointmentCard from '@/components/dashboard/appointments/appointment-card';
import FormSelect from '@/components/form/select';
import SearchField from '@/components/form/search-field';
import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { Calendar, Clock, Filter, Search, Plus, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';
type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending';

interface Appointment {
  id: string;
  petName: string;
  petAvatar?: string;
  veterinarianName: string;
  veterinarianAvatar?: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: string;
  notes?: string;
  price: number;
  emergency: boolean;
}

// Dados mockados
const mockAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Thor',
    petAvatar: '/images/cat.jpg',
    veterinarianName: 'Dra. Maria Silva',
    veterinarianAvatar: '/images/margot2.jpg',
    clinicName: 'Clínica Veterinária PetCare',
    clinicAddress: 'Rua das Flores, 123 - Centro',
    date: '2024-01-15',
    time: '14:30',
    status: 'scheduled',
    type: 'Consulta de Rotina',
    notes: 'Check-up anual e vacinação',
    price: 120.0,
    emergency: false,
  },
  {
    id: '2',
    petName: 'Luna',
    veterinarianName: 'Dr. João Santos',
    clinicName: 'VetCenter Especializado',
    clinicAddress: 'Av. Principal, 456 - Jardim América',
    date: '2024-01-10',
    time: '09:00',
    status: 'completed',
    type: 'Exame de Sangue',
    notes: 'Exames de rotina - resultados normais',
    price: 85.5,
    emergency: false,
  },
  {
    id: '3',
    petName: 'Max',
    veterinarianName: 'Dra. Ana Costa',
    clinicName: 'Clínica 24h PetEmergency',
    clinicAddress: 'Rua da Emergência, 789',
    date: '2024-01-08',
    time: '22:15',
    status: 'completed',
    type: 'Atendimento de Emergência',
    notes: 'Dor abdominal - diagnosticado como gastrite',
    price: 250.0,
    emergency: true,
  },
  {
    id: '4',
    petName: 'Bella',
    veterinarianName: 'Dr. Carlos Oliveira',
    clinicName: 'PetClinic Premium',
    clinicAddress: 'Shopping Center, Loja 45',
    date: '2024-01-20',
    time: '16:00',
    status: 'pending',
    type: 'Consulta Especializada',
    notes: 'Avaliação dermatológica',
    price: 180.0,
    emergency: false,
  },
  {
    id: '5',
    petName: 'Rex',
    veterinarianName: 'Dra. Fernanda Lima',
    clinicName: 'VetCare Express',
    clinicAddress: 'Rua Comercial, 321',
    date: '2024-01-05',
    time: '11:30',
    status: 'cancelled',
    type: 'Vacinação',
    notes: 'Cancelado pelo cliente',
    price: 65.0,
    emergency: false,
  },
  {
    id: '6',
    petName: 'Mia',
    veterinarianName: 'Dr. Roberto Alves',
    clinicName: 'Clínica Veterinária Familiar',
    clinicAddress: 'Rua das Palmeiras, 654',
    date: '2024-01-25',
    time: '13:00',
    status: 'scheduled',
    type: 'Castração',
    notes: 'Procedimento cirúrgico agendado',
    price: 350.0,
    emergency: false,
  },
];

export default function ConsultasPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterEmergency, setFilterEmergency] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simular carregamento
    const fetchAppointments = async () => {
      try {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAppointments(mockAppointments);
        setFilteredAppointments(mockAppointments);
      } catch {
        toast.error('Erro ao carregar consultas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Aplicar filtros sempre que mudarem os parâmetros
  useEffect(() => {
    let filtered = appointments;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.veterinarianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.type.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filtro por status
    if (filterStatus) {
      filtered = filtered.filter((appointment) => appointment.status === filterStatus);
    }

    // Filtro por tipo
    if (filterType) {
      filtered = filtered.filter((appointment) => appointment.type === filterType);
    }

    // Filtro por emergência
    if (filterEmergency) {
      const isEmergency = filterEmergency === 'yes';
      filtered = filtered.filter((appointment) => appointment.emergency === isEmergency);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, filterStatus, filterType, filterEmergency]);

  // Criar opções para os selects
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'scheduled', label: 'Agendada' },
    { value: 'completed', label: 'Concluída' },
    { value: 'cancelled', label: 'Cancelada' },
    { value: 'pending', label: 'Pendente' },
  ];

  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'Consulta de Rotina', label: 'Consulta de Rotina' },
    { value: 'Exame de Sangue', label: 'Exame de Sangue' },
    { value: 'Atendimento de Emergência', label: 'Atendimento de Emergência' },
    { value: 'Consulta Especializada', label: 'Consulta Especializada' },
    { value: 'Vacinação', label: 'Vacinação' },
    { value: 'Castração', label: 'Castração' },
  ];

  const emergencyOptions = [
    { value: '', label: 'Todas as consultas' },
    { value: 'yes', label: 'Apenas emergências' },
    { value: 'no', label: 'Consultas normais' },
  ];

  const handleNewAppointment = () => {
    router.push('/dashboard/usuario/consultas/nova');
  };

  const getStatusStats = () => {
    const stats = {
      scheduled: appointments.filter((a) => a.status === 'scheduled').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      pending: appointments.filter((a) => a.status === 'pending').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return <PetDataLoading type="appointments" size="lg" inline={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Consultas</h1>
          <p className="mt-2 text-gray-600">Acompanhe o histórico e agende novas consultas para seus pets</p>
        </div>
        <UIButton onClick={handleNewAppointment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nova Consulta
        </UIButton>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-500">Agendadas</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">Concluídas</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">Pendentes</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-500">Canceladas</div>
        </div>
      </div>

      {/* Filtros e Controles */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Busca */}
          <div className="flex-1">
            <SearchField
              name="search"
              placeholder="Buscar por pet, veterinário ou clínica..."
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
                <Calendar className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}>
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Expandidos */}
        {showFilters && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormSelect
                label="Status"
                name="status"
                value={filterStatus}
                options={statusOptions}
                onChange={(value) => setFilterStatus(value)}
              />

              <FormSelect
                label="Tipo de Consulta"
                name="type"
                value={filterType}
                options={typeOptions}
                onChange={(value) => setFilterType(value)}
              />

              <FormSelect
                label="Emergência"
                name="emergency"
                value={filterEmergency}
                options={emergencyOptions}
                onChange={(value) => setFilterEmergency(value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lista de Consultas */}
      {filteredAppointments.length === 0 ? (
        <div className="py-12 text-center">
          {appointments.length === 0 ? (
            // Nenhuma consulta cadastrada
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Stethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma consulta agendada</h3>
              <p className="mb-6 text-gray-500">
                Agende sua primeira consulta para começar a acompanhar a saúde dos seus pets.
              </p>
              <UIButton onClick={handleNewAppointment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Agendar Primeira Consulta
              </UIButton>
            </div>
          ) : (
            // Nenhum resultado na busca/filtro
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma consulta encontrada</h3>
              <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
              <UIButton
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('');
                  setFilterType('');
                  setFilterEmergency('');
                }}>
                Limpar Filtros
              </UIButton>
            </div>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Resultados */}
      {filteredAppointments.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {filteredAppointments.length} de {appointments.length} consulta
          {appointments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
