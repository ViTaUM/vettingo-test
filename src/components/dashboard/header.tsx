import type { ReactNode } from 'react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}
