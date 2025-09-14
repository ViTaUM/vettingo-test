'use client';

import { useEffect, useState } from 'react';

interface PetLoadingProps {
  message?: string;
  petType?: 'dog' | 'cat' | 'random';
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

// Estilos CSS customizados para animação de carregamento
const loadingStyles = `
  @keyframes pawLoading {
    0% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0.3; transform: scale(0.8); }
  }
  
  .paw-loading-1 { animation: pawLoading 1.5s ease-in-out infinite; }
  .paw-loading-2 { animation: pawLoading 1.5s ease-in-out infinite 0.5s; }
  .paw-loading-3 { animation: pawLoading 1.5s ease-in-out infinite 1s; }
`;

export function PetLoading({
  message = 'Redirecionando...',
  petType = 'random',
  size = 'md',
  fullScreen = true,
}: PetLoadingProps) {
  const [currentPet, setCurrentPet] = useState<'dog' | 'cat'>(petType === 'random' ? 'dog' : petType);

  useEffect(() => {
    if (petType === 'random') {
      setCurrentPet(Math.random() > 0.5 ? 'dog' : 'cat');
    }
  }, [petType]);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const containerClass = fullScreen
    ? 'flex h-screen items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: loadingStyles }} />
      <div className={containerClass}>
        <div className="text-center">
          <div className="relative">
            {/* Pata girando */}
            <div className={`${sizeClasses[size]} mx-auto flex animate-spin items-center justify-center`}>
              <span className="text-3xl">🐾</span>
            </div>
          </div>

          {/* Patinhas como carregador progressivo */}
          <div className="mt-2 flex justify-center space-x-1">
            <span className="paw-loading-1 text-gray-400">🐾</span>
            <span className="paw-loading-2 text-gray-500">🐾</span>
            <span className="paw-loading-3 text-gray-600">🐾</span>
          </div>

          <p className={`mt-2 ${textSizeClasses[size]} font-medium text-gray-600`}>{message}</p>

          {/* Texto adicional divertido */}
          <p className="mt-1 text-xs text-gray-400">
            {currentPet === 'dog' ? 'Preparando sua experiência... 🦴' : 'Organizando as coisas... 🧶'}
          </p>
        </div>
      </div>
    </>
  );
}
