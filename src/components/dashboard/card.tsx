import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
}

export default function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  percentage,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className="mt-2 flex items-center text-sm">
        {trend === 'up' && percentage > 0 && <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />}
        {trend === 'down' && percentage > 0 && <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />}
        {trend === 'neutral' && <MinusIcon className="mr-1 h-4 w-4 text-gray-500" />}
        <span
          className={cn(
            'font-medium',
            trend === 'up' && 'text-green-500',
            trend === 'down' && 'text-red-500',
            trend === 'neutral' && 'text-gray-500',
          )}>
          {percentage > 0 ? `${percentage}%` : '0%'}
        </span>
        <span className="ml-2 text-gray-500">{description}</span>
      </div>
    </div>
  );
}
