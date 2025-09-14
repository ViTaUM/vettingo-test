import { cn } from '@/utils/cn';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type UIBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export default function UIBreadcrumb({ items, className }: UIBreadcrumbProps) {
  return (
    <nav className={cn('flex pl-8', className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />}

            {item.href && index !== items.length - 1 ? (
              <Link href={item.href} className="hover:text-primary text-sm text-gray-700 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn('text-sm', index === items.length - 1 ? 'text-gray-500' : 'text-gray-700')}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
