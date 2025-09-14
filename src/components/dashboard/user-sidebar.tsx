'use client';

import { useDashboard } from '@/lib/contexts/dashboard-context';
import { User } from '@/lib/types/api';
import { LayoutDashboard, PawPrint, Settings, Shield, User as UserIcon, Calendar } from 'lucide-react';
import DashboardSidebar from './sidebar';

interface UserDashboardSidebarProps {
  user?: User;
}

export default function UserDashboardSidebar({ user: userProp }: UserDashboardSidebarProps) {
  // Usa o usuário do contexto se não foi passado via props
  const { user: userContext } = useDashboard();
  const user = userProp || userContext;
  const navigation = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard', href: '/dashboard/usuario', icon: LayoutDashboard, description: 'Visão geral' },
        { name: 'Agendamento', href: '/dashboard/usuario/agendamento', icon: Calendar, description: 'Buscar veterinários' },
        { name: 'Meus Pets', href: '/dashboard/usuario/pets', icon: PawPrint, description: 'Cadastro e histórico' },
      ],
    },
    {
      title: 'Perfil',
      items: [
        { name: 'Meus Dados', href: '/dashboard/usuario/perfil', icon: UserIcon, description: 'Informações pessoais' },
      ],
    },
    {
      title: 'Conta',
      items: [
        {
          name: 'Configurações',
          href: '/dashboard/usuario/configuracoes',
          icon: Settings,
          description: 'Preferências',
        },
        { name: 'Segurança', href: '/dashboard/usuario/seguranca', icon: Shield, description: 'Senha e privacidade' },
      ],
    },
  ];

  return <DashboardSidebar navigation={navigation} user={user} roleLabel="Tutor" />;
}
