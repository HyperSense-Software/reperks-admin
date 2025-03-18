'use client';
import { LoadingOverlay } from '@/components/loadingOverlay/loadingOverlay';
import { useAppSelector } from '@/store';
import { appLoadingSelector } from '@/store/app/app.selector';
import React, { ReactNode, Suspense } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher.view';

export default function AuthAdminLayout(props: { children: ReactNode }) {
  const isLoading = useAppSelector(appLoadingSelector);

  return (
    <div className={`h-screen`}>
      <LanguageSwitcher className="absolute top-4 right-4" />
      <div className="flex h-full items-center justify-center">
        <Suspense>
          {props.children}
          <LoadingOverlay loading={isLoading} />
        </Suspense>
      </div>
    </div>
  );
}
