'use client';
import { AppStore, makeStore } from '@/store';
import { Provider } from 'react-redux';
import { StoreProviderProps } from '@/components/StoreProvider/StoreProvider.props';
import { useRef } from 'react';

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
