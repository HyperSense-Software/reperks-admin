'use client';
import React from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { cn } from '@udecode/cn';
import { navItems } from '@/constants/navigation.constants';

import { SidebarTrigger } from './sidebar-class';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  useSidebar,
} from '@/components/ui/sidebar';

import { NavigationMenu } from '@/components/layout/sidebar-with-dropdown/navigation-menu';
import Logo from '@/public/assets/images/logo.svg';
import LogoSmall from '@/public/assets/images/logo-small.svg';

export default function SidebarWithDropdownView({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();

  const { state } = useSidebar();
  const isMinimized = state === 'collapsed';
  console.log(props);

  return (
    <aside
      className={cn(
        `border-border relative hidden h-screen flex-none border-r transition-[width] duration-500 lg:block`,
        props.className,
      )}
    >
      <Sidebar collapsible="icon" className={'bg-transparent'} {...props}>
        <SidebarHeader className="border-border hidden border-b p-6 py-[14px] lg:block">
          <Link
            href={`/${locale}/`}
            target="_blank"
            className={'m-auto overflow-hidden'}
          >
            {!isMinimized ? <Logo /> : <LogoSmall />}
          </Link>
        </SidebarHeader>

        <div className="px-2 py-4">
          <SidebarTrigger
            className={cn(
              'bg-background text-foreground absolute top-12 -right-3 z-50 -mt-1 cursor-pointer rounded-full border text-3xl',
              isMinimized && 'rotate-180',
            )}
          ></SidebarTrigger>
          <SidebarContent>
            <NavigationMenu items={navItems} />
          </SidebarContent>
        </div>
      </Sidebar>

      {/*<div className="px-4 py-6">*/}
      {/*  <div className="">*/}
      {/*    <div className="">*/}
      {/*      <DashboardNav items={navItems} />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </aside>
  );
}
