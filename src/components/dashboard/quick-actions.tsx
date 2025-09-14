import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  hoverBgColor: string;
  title: string;
  description: string;
  external?: boolean;
}

export function QuickAction({ 
  href, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  hoverBgColor, 
  title, 
  description,
  external = false 
}: QuickActionProps) {
  const content = (
    <div className={`flex items-center rounded-lg p-4 transition-colors ${bgColor} ${hoverBgColor}`}>
      <Icon className={`mr-3 h-8 w-8 ${iconColor}`} />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  );
}

interface QuickActionsProps {
  title?: string;
  actions: {
    href: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    hoverBgColor: string;
    title: string;
    description: string;
    external?: boolean;
  }[];
  columns?: 2 | 3 | 4;
}

export function QuickActions({ title = "Ações Rápidas", actions, columns = 3 }: QuickActionsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className={`grid grid-cols-1 gap-4 ${gridCols[columns]}`}>
        {actions.map((action, index) => (
          <QuickAction key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
