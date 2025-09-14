import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string | number;
  description?: string;
}

export function StatCard({ icon: Icon, iconColor, iconBgColor, label, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center">
        <div className={`rounded-lg p-2 ${iconBgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
        </div>
      </div>
    </div>
  );
}

interface StatGridProps {
  stats: {
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
    label: string;
    value: string | number;
    description?: string;
  }[];
  columns?: 2 | 3 | 4;
}

export function StatGrid({ stats, columns = 4 }: StatGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 gap-6 ${gridCols[columns]}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
