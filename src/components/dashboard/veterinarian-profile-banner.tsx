'use client';

import UIButton from '@/components/ui/button';
import { Veterinarian } from '@/lib/types/api';
import { AlertTriangle, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface VeterinarianProfileBannerProps {
  veterinarian: Veterinarian | null;
}

export default function VeterinarianProfileBanner({ veterinarian }: VeterinarianProfileBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  const hasProfile = veterinarian !== null && veterinarian.id > 0;

  if (hasProfile || dismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Perfil Incompleto
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Complete seu perfil de veterinário para acessar todas as funcionalidades.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <UIButton
                onClick={() => router.push('/dashboard/veterinario/perfil')}
                variant="solid"
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-white">
                <UserPlus className="mr-1 h-3 w-3" />
                Completar Perfil
              </UIButton>
              <UIButton
                onClick={() => setDismissed(true)}
                variant="ghost"
                size="sm"
                className="text-yellow-600 hover:text-yellow-800">
                <X className="h-3 w-3" />
              </UIButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 