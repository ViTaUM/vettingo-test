import { getCurrentUser } from '@/lib/api/users';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function UserBanner() {
  try {
    // Primeiro verificar se existe token de autenticação
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');

    // Se não há token, não fazer requisição desnecessária
    if (!authToken?.value) {
      return null;
    }

    // Só fazer requisição se há token
    const userResult = await getCurrentUser();

    if (!userResult.success || !userResult.user) {
      return null;
    }

    const { user } = userResult;
    const dashboardPath = user.role === 'VETERINARIAN' ? '/dashboard/veterinario' : '/dashboard/usuario';

    return (
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <p className="text-sm">
                  Olá, <span className="font-semibold">{user.firstName || 'Usuário'}</span>! 👋
                </p>
              </div>
              <div className="sm:hidden">
                <p className="text-sm font-semibold">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center">
              <Link
                href={dashboardPath}
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/30">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Ir para Dashboard</span>
                <span className="sm:hidden">Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    return null;
  }
}
