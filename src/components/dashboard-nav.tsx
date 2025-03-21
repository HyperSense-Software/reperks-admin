'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/interfaces';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { useLocale, useTranslations } from 'next-intl';

type IconKeys = keyof typeof Icons;

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const locale = useLocale();
  const t = useTranslations('nav-items');

  const path = usePathname();
  const { isMinimized } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const iconKey = (item.icon || 'arrowRight') as IconKeys;
          const Icon = Icons[iconKey];
          return (
            item.url && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={
                      item.disabled ? `/${locale}` : `/${locale}${item.url}`
                    }
                    className={cn(
                      'hover:bg-accent hover:text-accent-foreground flex items-center gap-2 overflow-hidden rounded-md px-3 py-4 text-sm font-medium',
                      path === item.url ? 'bg-accent' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80',
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`size-6 flex-none stroke-slate-500`} />

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate text-slate-500">
                        {t(item.label.toLocaleLowerCase() + '.title')}
                      </span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
