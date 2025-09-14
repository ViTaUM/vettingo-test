'use client';

import VeterinarianRouteGuard from '@/components/dashboard/veterinarian-route-guard';
import { PetLoading } from '@/components/ui/pet-loading';
import { useDashboard } from '@/lib/contexts/dashboard-context';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

export default function VeterinarioDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    // O usuário já foi validado no layout pai, só verificamos o role
    if (user.role === 'USER') {
      router.replace('/dashboard/usuario');
    } else if (user.role === 'ADMIN') {
      router.replace('/dashboard/admin');
    }
  }, [user.role, router]);

  // Se chegou até aqui e o role é VETERINARIAN, pode renderizar
  if (user.role !== 'VETERINARIAN') {
    return <PetLoading message="Redirecionando para área do veterinário..." petType="dog" />;
  }

  return (
    <VeterinarianRouteGuard>
      {children}
    </VeterinarianRouteGuard>
  );
}
