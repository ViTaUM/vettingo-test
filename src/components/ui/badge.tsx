import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-blue-100 text-blue-800',
        variant === 'secondary' && 'bg-gray-100 text-gray-800',
        variant === 'outline' && 'border border-gray-300 bg-white text-gray-700',
        className,
      )}>
      {children}
    </span>
  );
}
