import DashboardView from '@/app/dashboard/dashboard.view';

export const dynamic = 'force-dynamic';
import React from 'react';
import PageContainer from '@/components/ui/page-container';

export default function Dashboard() {
  return (
    <PageContainer scrollable={true}>
      <DashboardView />
    </PageContainer>
  );
}
