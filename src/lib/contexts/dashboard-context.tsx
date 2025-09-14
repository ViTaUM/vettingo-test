'use client';

import { User } from '@/lib/types/api';
import { createContext, useContext } from 'react';

interface DashboardContextType {
  user: User;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children, user }: { children: React.ReactNode; user: User }) {
  return <DashboardContext.Provider value={{ user }}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
