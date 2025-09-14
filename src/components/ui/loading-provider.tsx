'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLoading, LoadingState, LoadingConfig } from '@/hooks/use-loading';
import { PetLoading } from './pet-loading';
import { PetDataLoading } from './pet-data-loading';

interface LoadingContextType {
  startLoading: (id: string, config?: LoadingConfig) => void;
  stopLoading: (id: string) => void;
  updateLoading: (id: string, updates: Partial<LoadingState>) => void;
  getLoadingState: (id: string) => LoadingState | undefined;
  isLoading: (id: string) => boolean;
  clearAll: () => void;
  states: Map<string, LoadingState>;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const loadingUtils = useLoading();

  return (
    <LoadingContext.Provider value={loadingUtils}>
      {children}
      <LoadingOverlay />
    </LoadingContext.Provider>
  );
}

// Componente que renderiza os loading states ativos
function LoadingOverlay() {
  const { states } = useLoadingContext();

  // Filtrar apenas loading states que devem ser exibidos
  const activeStates = Array.from(states.values()).filter(
    (state) => state.isLoading && (state.fullScreen || !state.inline),
  );

  if (activeStates.length === 0) {
    return null;
  }

  // Renderizar o loading state mais prioritário
  const primaryState = activeStates[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <LoadingComponent state={primaryState} />
    </div>
  );
}

// Componente que renderiza o loading baseado no tipo
function LoadingComponent({ state }: { state: LoadingState }) {
  const { type = 'spinner', size = 'md', message, inline } = state;

  switch (type) {
    case 'pet':
      return <PetLoading message={message} petType="random" size={size} fullScreen={!inline} />;

    case 'data':
      return <PetDataLoading message={message} type="general" size={size} inline={inline} />;

    case 'skeleton':
      return <SkeletonLoading size={size} message={message} />;

    case 'spinner':
    default:
      return <SpinnerLoading size={size} message={message} />;
  }
}

// Componente de loading com spinner
function SpinnerLoading({ size, message }: { size: string; message?: string }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg">
      <div
        className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizeClasses[size as keyof typeof sizeClasses]}`}
      />
      {message && <p className="text-sm font-medium text-gray-700">{message}</p>}
    </div>
  );
}

// Componente de loading com skeleton
function SkeletonLoading({ size, message }: { size: string; message?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-6 shadow-lg">
      <div className={`animate-pulse rounded bg-gray-200 ${sizeClasses[size as keyof typeof sizeClasses]}`} />
      {message && <p className="text-sm font-medium text-gray-700">{message}</p>}
    </div>
  );
}
