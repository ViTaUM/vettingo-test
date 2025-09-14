'use client';

import { useDashboard } from '@/lib/contexts/dashboard-context';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { PetLoading } from '@/components/ui/pet-loading';

export default function AdminDashboardLayout({
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
    } else if (user.role === 'VETERINARIAN') {
      router.replace('/dashboard/veterinario');
    }
  }, [user.role, router]);

  // Se chegou até aqui e o role é ADMIN, pode renderizar
  if (user.role !== 'ADMIN') {
    return <PetLoading message="Redirecionando para área administrativa..." petType="random" />;
  }

  return <>{children}</>;
}
