'use client';
import React from 'react';
import PageContainer from '@/components/ui/page-container';
import { SidebarNav } from '@/components/sidebar-nav/sidebar-nav';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';

const sidebarNavItems = [
  {
    title: 'Security',
    href: '/dashboard/settings/security',
  },
];

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User Settings', link: '/dashboard/settings' },
];

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageContainer scrollable={true}>
      <div className={``}>
        <Breadcrumbs items={breadcrumbItems} />
        <br />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsLayout;
