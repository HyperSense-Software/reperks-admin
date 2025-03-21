'use client';
import { ReactNode } from 'react';
import { LoadingOverlay } from '@/components/loadingOverlay/loadingOverlay';
import { useAppSelector } from '@/store';
import { appLoadingSelector } from '@/store/app/app.selector';
import Header from '@/components/layout/header/header.view';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import SidebarWithDropdownView from '@/components/layout/sidebar-with-dropdown/sidebar-with-dropdown.view';

export default function DashboardLayoutView({
  children,
}: {
  children: ReactNode;
}) {
  const isLoading = useAppSelector(appLoadingSelector);

  return (
    <div className="flex">
      <SidebarProvider>
        <SidebarWithDropdownView />
        <SidebarInset>
          <main className="w-full flex-1 overflow-hidden">
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <LoadingOverlay loading={isLoading} />
    </div>
  );
}
