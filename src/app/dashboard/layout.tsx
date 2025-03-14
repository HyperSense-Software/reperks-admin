'use server';
import React from 'react';
import VerifyUserAuth from '@/components/core/verifyAuth/verify-auth-user';
import DashboardLayoutView from '@/app/dashboard/layout.view';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <VerifyUserAuth role={['Admins']}>
      <DashboardLayoutView>{children}</DashboardLayoutView>
    </VerifyUserAuth>
  );
}
