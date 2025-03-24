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
import { useNavigationTranslation } from '@/hooks/use-navigation-translation';

export default function SidebarWithDropdownView({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();

  const { state } = useSidebar();
  const isMinimized = state === 'collapsed';

  const translatedItems = useNavigationTranslation(navItems);

  return (
    <aside
      className={cn(
        `border-border relative hidden h-screen flex-none border-r lg:block`,
        props.className,
      )}
    >
      <Sidebar
        collapsible="icon"
        className={'bg-transparent duration-0'}
        {...props}
      >
        <SidebarHeader className="border-border hidden border-b p-6 py-[12px] lg:block">
          <Link
            href={`/${locale}/`}
            target="_blank"
            className={'m-auto overflow-hidden'}
          >
            {!isMinimized ? <Logo /> : <LogoSmall />}
          </Link>
        </SidebarHeader>

        <SidebarTrigger
          className={cn(
            'bg-background absolute top-12 -right-[14px] z-50 -mt-1 cursor-pointer rounded-full border',
            'transition-transform duration-200',
            isMinimized && 'rotate-180',
          )}
        ></SidebarTrigger>
        <div data-slot="sidebar-navigation">
          <SidebarContent className="px-2 py-4">
            <NavigationMenu items={translatedItems} />
          </SidebarContent>
        </div>
      </Sidebar>
    </aside>
  );
}
