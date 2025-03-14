'use client';
import { LoadingOverlay } from '@/components/loadingOverlay/loadingOverlay';
import { useAppSelector } from '@/store';
import { appLoadingSelector } from '@/store/app/app.selector';
import { ReactNode, Suspense } from 'react';

export default function AuthAdminLayout(props: { children: ReactNode }) {
  const isLoading = useAppSelector(appLoadingSelector);

  return (
    <div className="flex h-screen items-center justify-center">
      <Suspense>
        {props.children}
        <LoadingOverlay loading={isLoading} />
      </Suspense>
    </div>
  );
}
