'use client';

import { User } from '@/lib/types/api';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { setUser } from '../lib/slices/user-slice';
import { AppStore, makeStore } from '../lib/store';

type StoreProviderProps = {
  children: React.ReactNode;
  user: User | null;
};

export default function StoreProvider({ children, user }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (user) {
      storeRef.current?.dispatch(setUser(user));
    }
  }, [user]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
