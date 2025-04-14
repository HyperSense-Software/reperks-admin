'use client';

import { useTranslations } from 'next-intl';

export const dynamic = 'force-dynamic';
import React from 'react';
import PageContainer from '@/components/ui/page-container';

export default function DashboardView() {
  // const dispatch = useAppDispatch();
  const t = useTranslations('dashboard');

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
        </div>
      </div>
    </PageContainer>
  );
}
