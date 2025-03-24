'use client';
import { Label } from '@/components/ui/label';
import React from 'react';
import { useTranslations } from 'next-intl';

const Layout2FASettings = (props: { children: React.ReactNode }) => {
  const t = useTranslations('dashboard.mfa');
  return (
    <div className="flex h-full min-h-full w-full flex-col gap-8 bg-gray-50 px-10 py-10">
      <Label className="flex w-full content-center justify-center text-3xl">
        {t('layout-title')}
      </Label>
      <div className="flex w-full flex-col content-center justify-center">
        {props.children}
      </div>
    </div>
  );
};

export default Layout2FASettings;
