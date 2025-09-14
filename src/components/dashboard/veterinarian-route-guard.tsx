'use client';

import UIButton from '@/components/ui/button';
import { PetLoading } from '@/components/ui/pet-loading';
import { useVeterinarianProfile } from '@/hooks/use-veterinarian-profile';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

interface VeterinarianRouteGuardProps {
  children: ReactNode;
}

const ALLOWED_ROUTES_WITHOUT_PROFILE = [
  '/dashboard/veterinario/perfil',
  '/dashboard/veterinario/configuracoes',
  '/dashboard/veterinario/seguranca'
];

export default function VeterinarianRouteGuard({ children }: VeterinarianRouteGuardProps) {
  const { loading, hasProfile } = useVeterinarianProfile();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !hasProfile) {
      const isAllowedRoute = ALLOWED_ROUTES_WITHOUT_PROFILE.some(route => 
        pathname.startsWith(route)
      );
      
      if (!isAllowedRoute) {
        router.replace('/dashboard/veterinario/perfil');
      }
    }
  }, [loading, hasProfile, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PetLoading message="Verificando perfil do veterinário..." petType="dog" />
      </div>
    );
  }

  if (!hasProfile) {
    const isAllowedRoute = ALLOWED_ROUTES_WITHOUT_PROFILE.some(route => 
      pathname.startsWith(route)
    );

    if (!isAllowedRoute) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Perfil Incompleto
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                Para acessar esta área, você precisa completar seu perfil de veterinário primeiro.
              </p>
              
              <div className="space-y-3">
                <UIButton
                  onClick={() => router.push('/dashboard/veterinario/perfil')}
                  variant="solid"
                  size="md"
                  className="w-full bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Completar Perfil
                </UIButton>
                
                <UIButton
                  onClick={() => router.push('/dashboard/veterinario')}
                  variant="outline"
                  size="md"
                  className="w-full">
                  Voltar ao Dashboard
                </UIButton>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
} 