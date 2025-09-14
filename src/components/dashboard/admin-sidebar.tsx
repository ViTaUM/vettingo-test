'use client';

import { User } from '@/lib/types/api';
import { useDashboard } from '@/lib/contexts/dashboard-context';
import DashboardSidebar from './sidebar';
import { LayoutDashboard, Settings, Shield, Users, Stethoscope, FileText } from 'lucide-react';

interface AdminDashboardSidebarProps {
  user?: User;
}

export default function AdminDashboardSidebar({ user: userProp }: AdminDashboardSidebarProps) {
  // Usa o usuário do contexto se não foi passado via props
  const { user: userContext } = useDashboard();
  const user = userProp || userContext;
  const navigation = [
    {
      title: 'Administração',
      items: [
        { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard, description: 'Visão geral' },
        { name: 'Usuários', href: '/dashboard/admin/usuarios', icon: Users, description: 'Gerenciar usuários' },
        {
          name: 'Veterinários',
          href: '/dashboard/admin/veterinarios',
          icon: Stethoscope,
          description: 'Gerenciar profissionais',
        },
        { name: 'Relatórios', href: '/dashboard/admin/relatorios', icon: FileText, description: 'Analytics e dados' },
      ],
    },
    {
      title: 'Sistema',
      items: [
        {
          name: 'Configurações',
          href: '/dashboard/admin/configuracoes',
          icon: Settings,
          description: 'Configurações gerais',
        },
        { name: 'Segurança', href: '/dashboard/admin/seguranca', icon: Shield, description: 'Logs e segurança' },
      ],
    },
  ];

  return <DashboardSidebar navigation={navigation} user={user} roleLabel="Administrador" />;
}
