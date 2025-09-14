'use client';

import AnimatedList from '@/components/ui/animated-list';
import { logoutAction } from '@/lib/api/auth';
import { cn } from '@/utils/cn';
import { LifeBuoy, LogOut, LucideIcon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  isSection?: boolean;
  sectionTitle?: string;
  disabled?: boolean;
  badge?: {
    text: string;
    variant: 'warning' | 'error' | 'success' | 'info';
  };
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  navigation: NavSection[];
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  roleLabel: string;
}

const flattenNavigation = (navigation: NavSection[]): NavItem[] => {
  const items: NavItem[] = [];

  navigation.forEach((section) => {
    items.push({
      name: section.title,
      href: '',
      icon: LifeBuoy,
      isSection: true,
      sectionTitle: section.title,
    });

    section.items.forEach((item) => {
      items.push({
        ...item,
        isSection: false,
        sectionTitle: section.title,
      });
    });
  });

  return items;
};

export default function DashboardSidebar({ navigation, user, roleLabel }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const flatItems = useMemo(() => flattenNavigation(navigation), [navigation]);

  const handleItemSelect = (item: NavItem) => {
    if (item && !item.isSection && item.href && !item.disabled) {
      router.push(item.href);
      setIsOpen(false);
    }
  };

  const getBadgeClasses = (variant: string) => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderNavItem = (item: NavItem, index: number, isSelected: boolean) => {
    if (item.isSection) {
      return (
        <div className="mt-4 px-3 py-2 first:mt-0">
          <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">{item.sectionTitle}</h3>
        </div>
      );
    }

    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
    const Icon = item.icon;

    return (
      <div className="mb-1">
        <div
          className={cn(
            'group flex cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
            isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
            isSelected && !isActive && 'bg-gray-100',
            item.disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-700'
          )}>
          <Icon
            className={cn(
              'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200',
              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600',
              item.disabled && 'text-gray-300'
            )}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{item.name}</div>
              {item.badge && (
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  getBadgeClasses(item.badge.variant)
                )}>
                  {item.badge.text}
                </span>
              )}
            </div>
            {item.description && (
              <div className={cn(
                "text-xs text-gray-500 group-hover:text-gray-600",
                item.disabled && "text-gray-400"
              )}>
                {item.description}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="fixed top-4 right-4 z-50 rounded-lg bg-blue-600 p-2.5 text-white shadow-lg transition-all hover:bg-blue-700 md:hidden"
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-10 w-72 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}>
        <div className="flex h-full flex-col overflow-hidden">
          <div className="border-b border-gray-200 p-6">
            <Link href="/dashboard" className="block">
              <Image src="/logo.svg" alt="Vettingo" width={80} height={40} priority className="mb-8" />
            </Link>
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-emerald-50 p-3">
              <p className="truncate text-sm font-medium text-gray-900">
                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuário'}
              </p>
              <p className="text-xs text-gray-600">{roleLabel}</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-4 py-4">
            <AnimatedList
              items={flatItems}
              onItemSelect={handleItemSelect}
              renderItem={renderNavItem}
              showGradients={false}
              displayScrollbar={true}
              className="h-full w-full"
            />
          </div>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="group flex w-full cursor-pointer items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-red-50 hover:text-red-700">
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
              <div>
                <div className="font-medium">Sair da conta</div>
                <div className="text-xs text-gray-500 group-hover:text-red-600">Encerrar sessão</div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
