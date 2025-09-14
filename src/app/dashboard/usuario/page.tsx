'use client';

import PetCard from '@/components/dashboard/pets/pet-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatGrid } from '@/components/dashboard/stats';
import { getUserPets } from '@/lib/api/pets';
import { useDashboard } from '@/lib/contexts/dashboard-context';
import { Pet } from '@/lib/types/api';
import { Bell, PawPrint, Plus, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalPets: number;
  totalEmails: number;
  totalPhones: number;
}

export default function UsuarioDashboardPage() {
  const { user } = useDashboard();
  const [pets, setPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petsResult = await getUserPets();
        if (petsResult.success && petsResult.pets) {
          setPets(petsResult.pets);
        }

        setStats({
          totalPets: petsResult.pets?.length || 0,
          totalEmails: 0,
          totalPhones: 0,
        });
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
            ))}
          </div>
          <div className="h-64 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user.firstName || 'Tutor'}! 🐾</h1>
        <p className="text-gray-600">Gerencie seus pets e informações pessoais.</p>
      </div>

      <QuickActions
        title="Ações Rápidas"
        actions={[
          {
            href: '/dashboard/usuario/pets/novo',
            icon: PawPrint,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverBgColor: 'hover:bg-green-100',
            title: 'Cadastrar Pet',
            description: 'Adicionar novo pet',
          },
          {
            href: '/dashboard/usuario/perfil',
            icon: User,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBgColor: 'hover:bg-blue-100',
            title: 'Meu Perfil',
            description: 'Atualizar dados',
          },
          {
            href: '/dashboard/usuario/configuracoes',
            icon: Bell,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverBgColor: 'hover:bg-purple-100',
            title: 'Configurações',
            description: 'Preferências',
          },
        ]}
        columns={3}
      />

      <StatGrid
        stats={[
          {
            icon: PawPrint,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
            label: 'Meus Pets',
            value: stats?.totalPets || 0,
          },
          {
            icon: User,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
            label: 'E-mails Cadastrados',
            value: stats?.totalEmails || 0,
          },
          {
            icon: Bell,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
            label: 'Telefones Cadastrados',
            value: stats?.totalPhones || 0,
          },
        ]}
        columns={3}
      />

      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Meus Pets</h2>
          <Link
            href="/dashboard/usuario/pets/novo"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Pet
          </Link>
        </div>

        <div className="p-6">
          {pets.length === 0 ? (
            <div className="py-8 text-center">
              <PawPrint className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum pet cadastrado</h3>
              <p className="mb-4 text-gray-500">Cadastre seu primeiro pet para começar a usar o Vettingo.</p>
              <Link
                href="/dashboard/usuario/pets/novo"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Cadastrar Primeiro Pet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
          <Link href="/dashboard/usuario/perfil" className="text-sm text-blue-600 hover:text-blue-500">
            Editar perfil
          </Link>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">CPF</p>
                  <p className="text-lg font-semibold text-gray-900">{user.cpf || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
