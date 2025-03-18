'use client';
import { ReactNode } from 'react';
import { LoadingOverlay } from '@/components/loadingOverlay/loadingOverlay';
import { useAppSelector } from '@/store';
import { appLoadingSelector } from '@/store/app/app.selector';
import Sidebar from '@/components/layout/sidebar/sidebar.view';
import Header from '@/components/layout/header/header.view';

export default function DashboardLayoutView({ children }: { children: ReactNode }) {
  const isLoading = useAppSelector(appLoadingSelector);

  return (
    <div className="flex">
      <Sidebar />
      <main className="w-full flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
      <LoadingOverlay loading={isLoading} />
    </div>
  );
}
