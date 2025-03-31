'use client';
import React from 'react';
import PageContainer from '@/components/ui/page-container';
import { SidebarNav } from '@/components/sidebar-nav/sidebar-nav';
import { Breadcrumbs } from '@/components/breadcrumbs/breadcrumbs';
import { useTranslations } from 'use-intl';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('dashboard.settings');

  const sidebarNavItems = [
    {
      title: t('menu.profile'),
      href: '/dashboard/settings/profile',
    },
    {
      title: t('menu.security'),
      href: '/dashboard/settings/security',
    },
  ];

  const breadcrumbItems = [
    { title: t('breadcrumbs.dashboard'), link: '/dashboard' },
    { title: t('breadcrumbs.settings'), link: '/dashboard/settings' },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className={``}>
        <Breadcrumbs items={breadcrumbItems} />
        <br />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="max-w-2xl flex-1">{children}</div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsLayout;
