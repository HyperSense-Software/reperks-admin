'use client';

import { ChevronRight } from 'lucide-react';

type IconKeys = keyof typeof Icons;

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { useLocale, useTranslations } from 'next-intl';

export function NavigationMenu({
  items,
}: {
  items: {
    title: string;
    label: string;
    url?: string;
    icon?: keyof typeof Icons | string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const t = useTranslations('nav-items');
  const { state } = useSidebar();
  const isMinimized = state === 'collapsed';
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const iconKey = (item.icon || 'arrowRight') as IconKeys;
          const Icon = Icons[iconKey];
          return (
            <Collapsible
              key={t(item.label.toLocaleLowerCase() + '.title')}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem
                className={
                  'hover:bg-accent hover:text-accent-foreground gap-2 opacity-100 ' +
                  'overflow-hidden rounded-md p-3 py-4'
                }
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={t(item.label.toLocaleLowerCase() + '.title')}
                    className={
                      'flex h-6 cursor-pointer items-center opacity-100 ' +
                      'overflow-hidden rounded-md p-0 text-sm font-medium'
                    }
                  >
                    {item.icon && (
                      <Icon className={`!size-6 flex-none stroke-slate-500`} />
                    )}
                    {!isMinimized ? (
                      <span className="mr-2 truncate text-slate-500">
                        {t(item.label.toLocaleLowerCase() + '.title')}
                      </span>
                    ) : (
                      ''
                    )}
                    <ChevronRight className="ml-auto stroke-slate-500 transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span className="text-xs text-slate-950">
                              {subItem.title}
                            </span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
