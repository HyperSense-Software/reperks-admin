'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

import { cn } from '@udecode/cn';
import { SidebarProps } from '@/components/layout/sidebar/sidebar.props';
import { useSidebar } from '@/hooks/useSidebar';
import { navItems } from '@/constants/navigation.constants';
import { DashboardNav } from '@/components/dashboard-nav';
import Logo from '@/public/assets/images/logo.svg';
import LogoSmall from '@/public/assets/images/logo-small.svg';

export default function Sidebar({ className }: SidebarProps) {
  const locale = useLocale();
  const { isMinimized, toggle } = useSidebar();

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `bg-card border-border relative hidden h-screen flex-none border-r transition-[width] duration-500 lg:block`,
        !isMinimized ? 'w-64' : 'w-[72px]',
        className,
      )}
    >
      <div className="border-border hidden border-b px-6 py-3 lg:block">
        <Link
          href={`/${locale}/`}
          target="_blank"
          className={'m-auto overflow-hidden'}
        >
          {!isMinimized ? <Logo /> : <LogoSmall />}
        </Link>
      </div>

      <ChevronLeft
        className={cn(
          'bg-background text-foreground absolute top-12 -right-3 z-50 -mt-1 cursor-pointer rounded-full border text-3xl',
          isMinimized && 'rotate-180',
        )}
        onClick={handleToggle}
      />

      <div className="px-4 py-6">
        <div className="">
          <div className="">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  );
}
