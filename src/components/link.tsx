import { cn } from '@/utils/cn';
import Link from 'next/link';

export default function MyLink({
  href,
  children,
  className = '',
  size,
}: Readonly<{
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}>) {
  return (
    <Link
      href={href}
      className={cn(
        'hover:text-primary font-medium text-gray-700 transition duration-300',
        className,
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-base',
        size === 'lg' && 'text-lg',
      )}>
      {children}
    </Link>
  );
}
