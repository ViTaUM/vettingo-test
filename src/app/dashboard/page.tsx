'use client';

import { useDashboard } from '@/lib/contexts/dashboard-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PetLoading } from '@/components/ui/pet-loading';

export default function DashboardPage() {
  const { user } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o dashboard específico do role do usuário
    switch (user.role) {
      case 'VETERINARIAN':
        router.replace('/dashboard/veterinario');
        break;
      case 'ADMIN':
        router.replace('/dashboard/admin');
        break;
      case 'USER':
      default:
        router.replace('/dashboard/usuario');
        break;
    }
  }, [user.role, router]);

  // Este componente só redireciona, então mostra um loading
  return <PetLoading message="Carregando seu dashboard..." petType="random" />;
}
