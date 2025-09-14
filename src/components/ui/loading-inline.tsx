'use client';

import { useLoadingContext } from './loading-provider';
import { PetLoading } from './pet-loading';
import { PetDataLoading } from './pet-data-loading';
import { LoadingState } from '@/hooks/use-loading';

interface LoadingInlineProps {
  id: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export function LoadingInline({ id, fallback, children }: LoadingInlineProps) {
  const { getLoadingState } = useLoadingContext();
  const state = getLoadingState(id);

  if (!state?.isLoading) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <LoadingComponent state={state} />;
}

// Componente que renderiza o loading baseado no tipo
function LoadingComponent({ state }: { state: LoadingState }) {
  const { type = 'spinner', size = 'md', message } = state;

  switch (type) {
    case 'pet':
      return <PetLoading message={message} petType="random" size={size} fullScreen={false} />;

    case 'data':
      return <PetDataLoading message={message} type="general" size={size} inline={true} />;

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
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 py-8">
      <div
        className={`animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 ${sizeClasses[size as keyof typeof sizeClasses]}`}
      />
      {message && <p className="text-sm text-gray-500">{message}</p>}
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
    <div className="flex flex-col items-center justify-center space-y-2 py-8">
      <div className={`animate-pulse rounded bg-gray-200 ${sizeClasses[size as keyof typeof sizeClasses]}`} />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
