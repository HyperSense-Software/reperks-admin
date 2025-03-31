'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import React from 'react';
import { useLocale } from 'next-intl';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0',
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const href = `/${locale}${item.href}`;
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              isActive
                ? 'bg-slate-100 font-medium text-slate-900'
                : 'bg-white text-slate-600 hover:bg-[#F1F5F9]',
              'justify-start',
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
