'use client';
import { makeStore } from '@/store';
import { Provider } from 'react-redux';
import { StoreProviderProps } from '@/components/StoreProvider/StoreProvider.props';

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return <Provider store={makeStore()}>{children}</Provider>;
};
