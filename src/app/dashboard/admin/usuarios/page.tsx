'use client';

import FormSelect from '@/components/form/select';
import SearchField from '@/components/form/search-field';
import UIButton from '@/components/ui/button';
import { useLoadingContext } from '@/components/ui/loading-provider';
import { LoadingInline } from '@/components/ui/loading-inline';
import { Grid, List, User, Plus, Filter, Search, Eye, Edit, Shield, Mail, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  role: 'USER' | 'VETERINARIAN' | 'ADMIN';
  isActive: boolean;
  birthDate: Date;
  gender: 'M' | 'F' | 'O';
  wantsNewsletter: boolean;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
  totalPets: number;
  totalAppointments: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoadingContext();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Dados mockados
  const mockUsers: AdminUser[] = useMemo(
    () => [
      {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@email.com',
        cpf: '123.456.789-01',
        role: 'USER',
        isActive: true,
        birthDate: new Date('1990-05-15'),
        gender: 'M',
        wantsNewsletter: true,
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-01-20T10:30:00'),
        totalPets: 2,
        totalAppointments: 5,
      },
      {
        id: 2,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@email.com',
        cpf: '987.654.321-00',
        role: 'USER',
        isActive: true,
        birthDate: new Date('1985-08-22'),
        gender: 'F',
        wantsNewsletter: false,
        createdAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-19T14:15:00'),
        totalPets: 1,
        totalAppointments: 3,
      },
      {
        id: 3,
        firstName: 'Dr. Carlos',
        lastName: 'Oliveira',
        email: 'carlos.oliveira@vet.com',
        cpf: '456.789.123-45',
        role: 'VETERINARIAN',
        isActive: true,
        birthDate: new Date('1980-03-10'),
        gender: 'M',
        wantsNewsletter: true,
        avatar: '/images/vet-avatar.jpg',
        createdAt: new Date('2023-12-01'),
        lastLogin: new Date('2024-01-20T09:00:00'),
        totalPets: 0,
        totalAppointments: 0,
      },
      {
        id: 4,
        firstName: 'Ana',
        lastName: 'Costa',
        email: 'ana.costa@email.com',
        cpf: '789.123.456-78',
        role: 'USER',
        isActive: false,
        birthDate: new Date('1992-11-05'),
        gender: 'F',
        wantsNewsletter: true,
        createdAt: new Date('2024-01-05'),
        lastLogin: new Date('2024-01-15T16:45:00'),
        totalPets: 0,
        totalAppointments: 0,
      },
      {
        id: 5,
        firstName: 'Dr. Fernanda',
        lastName: 'Lima',
        email: 'fernanda.lima@vet.com',
        cpf: '321.654.987-32',
        role: 'VETERINARIAN',
        isActive: true,
        birthDate: new Date('1988-07-18'),
        gender: 'F',
        wantsNewsletter: false,
        createdAt: new Date('2023-11-20'),
        lastLogin: new Date('2024-01-20T11:20:00'),
        totalPets: 0,
        totalAppointments: 0,
      },
      {
        id: 6,
        firstName: 'Pedro',
        lastName: 'Almeida',
        email: 'pedro.almeida@email.com',
        cpf: '654.321.987-65',
        role: 'USER',
        isActive: true,
        birthDate: new Date('1995-02-28'),
        gender: 'M',
        wantsNewsletter: true,
        createdAt: new Date('2024-01-12'),
        lastLogin: new Date('2024-01-20T08:30:00'),
        totalPets: 3,
        totalAppointments: 8,
      },
    ],
    [],
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        startLoading('admin-users-page', {
          type: 'data',
          message: 'Carregando usuários...',
          size: 'lg',
          inline: true,
        });

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch {
        toast.error('Erro inesperado ao carregar usuários');
      } finally {
        stopLoading('admin-users-page');
      }
    };

    fetchUsers();
  }, [startLoading, stopLoading, mockUsers]);

  // Aplicar filtros sempre que mudarem os parâmetros
  useEffect(() => {
    let filtered = users;

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.cpf.replace(/[^\d]/g, '').includes(searchQuery.replace(/[^\d]/g, '')),
      );
    }

    // Filtro por role
    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Filtro por status
    if (filterStatus) {
      if (filterStatus === 'active') {
        filtered = filtered.filter((user) => user.isActive);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter((user) => !user.isActive);
      }
    }

    // Filtro por gênero
    if (filterGender) {
      filtered = filtered.filter((user) => user.gender === filterGender);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, filterRole, filterStatus, filterGender]);

  const handleViewUser = (userId: number) => {
    router.push(`/dashboard/admin/usuarios/${userId}`);
  };

  const handleEditUser = (userId: number) => {
    router.push(`/dashboard/admin/usuarios/${userId}/editar`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'USER':
        return 'Usuário';
      case 'VETERINARIAN':
        return 'Veterinário';
      case 'ADMIN':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      case 'VETERINARIAN':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'Masculino';
      case 'F':
        return 'Feminino';
      case 'O':
        return 'Outro';
      default:
        return gender;
    }
  };

  return (
    <LoadingInline id="admin-users-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="mt-2 text-gray-600">Gerencie todos os usuários do sistema</p>
          </div>
          <UIButton className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </UIButton>
        </div>

        {/* Filtros e Controles */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Busca */}
            <div className="flex-1">
              <SearchField
                name="search"
                placeholder="Buscar por nome, email ou CPF..."
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
                  label="Tipo de Usuário"
                  name="role"
                  value={filterRole}
                  options={[
                    { value: '', label: 'Todos os tipos' },
                    { value: 'USER', label: 'Usuários' },
                    { value: 'VETERINARIAN', label: 'Veterinários' },
                    { value: 'ADMIN', label: 'Administradores' },
                  ]}
                  onChange={(value) => setFilterRole(value)}
                />
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
                  label="Gênero"
                  name="gender"
                  value={filterGender}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'M', label: 'Masculino' },
                    { value: 'F', label: 'Feminino' },
                    { value: 'O', label: 'Outro' },
                  ]}
                  onChange={(value) => setFilterGender(value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Lista de Usuários */}
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            {users.length === 0 ? (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum usuário encontrado</h3>
                <p className="mb-6 text-gray-500">
                  Não há usuários cadastrados no sistema. Clique em &quot;Novo Usuário&quot; para começar.
                </p>
                <UIButton className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Usuário
                </UIButton>
              </div>
            ) : (
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum usuário encontrado</h3>
                <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
                <UIButton
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRole('');
                    setFilterStatus('');
                    setFilterGender('');
                  }}>
                  Limpar Filtros
                </UIButton>
              </div>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md ${
                  !user.isActive ? 'opacity-60' : ''
                }`}>
                {/* Header do Card */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                      {!user.isActive && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UIButton variant="ghost" size="sm" onClick={() => handleViewUser(user.id)} className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </UIButton>
                    <UIButton variant="ghost" size="sm" onClick={() => handleEditUser(user.id)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </UIButton>
                  </div>
                </div>

                {/* Informações do Usuário */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>{formatCPF(user.cpf)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Nasc: {formatDate(user.birthDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{getGenderLabel(user.gender)}</span>
                  </div>
                </div>

                {/* Estatísticas */}
                {user.role === 'USER' && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Pets</p>
                        <p className="font-semibold text-gray-900">{user.totalPets}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Consultas</p>
                        <p className="font-semibold text-gray-900">{user.totalAppointments}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Último Login */}
                {user.lastLogin && (
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500">Último login: {formatDate(user.lastLogin)}</p>
                  </div>
                )}

                {/* Newsletter */}
                {user.wantsNewsletter && (
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Newsletter
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resultados */}
        {filteredUsers.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Mostrando {filteredUsers.length} de {users.length} usuário{users.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </LoadingInline>
  );
}
