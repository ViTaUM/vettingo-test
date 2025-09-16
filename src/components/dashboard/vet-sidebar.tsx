'use client';

import { useVeterinarianProfile } from '@/hooks/use-veterinarian-profile';
import { useDashboard } from '@/lib/contexts/dashboard-context';
import { User } from '@/lib/types/api';
import { LayoutDashboard, MapPin, Settings, Shield, Star, Stethoscope, CreditCard } from 'lucide-react';
import DashboardSidebar from './sidebar';

interface VetDashboardSidebarProps {
  user?: User;
}

export default function VetDashboardSidebar({ user: userProp }: VetDashboardSidebarProps) {
  // Usa o usuário do contexto se não foi passado via props
  const { user: userContext } = useDashboard();
  const user = userProp || userContext;
  const { hasProfile, loading } = useVeterinarianProfile();

  const navigation = [
    {
      title: 'Principal',
      items: [
        {
          name: 'Dashboard',
          href: '/dashboard/veterinario',
          icon: LayoutDashboard,
          description: 'Visão geral',
          disabled: !hasProfile && !loading,
        },
      ],
    },
    {
      title: 'Perfil Profissional',
      items: [
        {
          name: 'Meu Perfil',
          href: '/dashboard/veterinario/perfil',
          icon: Stethoscope,
          description: 'Dados profissionais',
          badge: !hasProfile && !loading ? { text: 'Incompleto', variant: 'warning' as const } : undefined,
        },
        {
          name: 'Locais de Atendimento',
          href: '/dashboard/veterinario/locais',
          icon: MapPin,
          description: 'Clínicas e consultórios',
          disabled: !hasProfile && !loading,
        },
        {
          name: 'Reviews',
          href: '/dashboard/veterinario/reviews',
          icon: Star,
          description: 'Feedback dos tutores',
          disabled: !hasProfile && !loading,
        },
      ],
    },
    {
      title: 'Conta',
      items: [
        {
          name: 'Assinatura',
          href: '/dashboard/veterinario/assinatura',
          icon: CreditCard,
          description: 'Gerenciar assinatura',
          // Removido disabled: a assinatura deve estar sempre acessível
        },
        {
          name: 'Configurações',
          href: '/dashboard/veterinario/configuracoes',
          icon: Settings,
          description: 'Preferências',
        },
        {
          name: 'Segurança',
          href: '/dashboard/veterinario/seguranca',
          icon: Shield,
          description: 'Senha e privacidade',
        },
      ],
    },
  ];

  return <DashboardSidebar navigation={navigation} user={user} roleLabel="Veterinário" />;
}
