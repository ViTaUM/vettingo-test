import AdminDashboardSidebar from '@/components/dashboard/admin-sidebar';
import UserDashboardSidebar from '@/components/dashboard/user-sidebar';
import VetDashboardSidebar from '@/components/dashboard/vet-sidebar';
import { getCurrentUser } from '@/lib/api/users';
import { DashboardProvider } from '@/lib/contexts/dashboard-context';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import StoreProvider from '../store-provider';
import BillingProvider from '@/providers/billing-provider';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Primeiro verificar se há token
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  if (!token?.value) {
    // Se não há token, redirecionar diretamente
    redirect('/login');
  }

  // Tentar obter usuário atual
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    // Se falhou ao obter usuário, limpar token e redirecionar
    console.log('Dashboard: Falha ao obter usuário:', userResult.error);
    
    // Se é erro de autenticação ou não há usuário, limpar token
    if (userResult.isAuthError || !userResult.user) {
      console.log('Dashboard: Limpando token e redirecionando para login');
      cookieStore.delete('auth-token');
    }
    
    redirect('/login');
  }

  const user = userResult.user;

  const renderSidebar = () => {
    switch (user.role) {
      case 'VETERINARIAN':
        return <VetDashboardSidebar />;
      case 'ADMIN':
        return <AdminDashboardSidebar />;
      case 'USER':
      default:
        return <UserDashboardSidebar />;
    }
  };

  return (
    <StoreProvider user={user}>
      <DashboardProvider user={user}>
        <BillingProvider>
          <div className="flex min-h-screen bg-gray-50">
            {renderSidebar()}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </BillingProvider>
      </DashboardProvider>
    </StoreProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const userResult = await getCurrentUser();

  if (!userResult.success || !userResult.user) {
    redirect('/login');
  }

  const user = userResult.user;
  const dashboardType = user.role === 'VETERINARIAN' ? 'Veterinário' : user.role === 'USER' ? 'Tutor' : 'Administrador';
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuário';

  return {
    title: `${fullName} - Dashboard do ${dashboardType} | Vettingo`,
  };
}
