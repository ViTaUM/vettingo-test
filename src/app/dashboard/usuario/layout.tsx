'use client';

import { useDashboard } from '@/lib/contexts/dashboard-context';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { PetLoading } from '@/components/ui/pet-loading';

export default function UsuarioDashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = useDashboard();
  const router = useRouter();

  useEffect(() => {
    // O usuário já foi validado no layout pai, só verificamos o role
    if (user.role === 'VETERINARIAN') {
      router.replace('/dashboard/veterinario');
    } else if (user.role === 'ADMIN') {
      router.replace('/dashboard/admin');
    }
  }, [user.role, router]);

  // Se chegou até aqui e o role é USER, pode renderizar
  if (user.role !== 'USER') {
    return <PetLoading message="Redirecionando para área do usuário..." petType="cat" />;
  }

  return <>{children}</>;
}
