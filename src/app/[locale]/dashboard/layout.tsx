'use server';
import React from 'react';
import VerifyUserAuth from '@/components/core/verifyAuth/verify-auth-user';
import DashboardLayoutView from '@/app/[locale]/dashboard/layout.view';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VerifyUserAuth role={['admin', 'super_admin', 'landlord']}>
      <DashboardLayoutView>{children}</DashboardLayoutView>
    </VerifyUserAuth>
  );
}
