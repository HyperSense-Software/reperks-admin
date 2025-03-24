'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
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
  const { state } = useSidebar();
  const isMinimized = state === 'collapsed';
  return (
    <SidebarGroup>
      <SidebarMenu className={'gap-2'}>
        {items.map((item) => {
          const iconKey = (item.icon || 'arrowRight') as IconKeys;
          const Icon = Icons[iconKey];
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className={'group/collapsible p-0'}
            >
              <SidebarMenuItem
                className={
                  'gap-2 overflow-hidden rounded-md opacity-100 group-data-[state=open]/collapsible:bg-transparent ' +
                  (isMinimized ? ' group-data-[collapsible=icon]:size10!' : '')
                }
              >
                {item.items ? (
                  //have subitems
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={
                          'hover:text-accent-foreground flex h-auto cursor-pointer items-center overflow-hidden ' +
                          'rounded-md p-3 py-2 text-sm font-medium opacity-100 group-data-[collapsible=icon]:size-10! [&>svg]:size-6' +
                          ' group-data-[collapsible=icon]:px-3!'
                        }
                      >
                        {item.icon && (
                          <Icon className={'flex-none stroke-slate-500'} />
                        )}
                        {!isMinimized ? (
                          <span className="mr-2 truncate text-slate-500">
                            {item.title}
                          </span>
                        ) : (
                          ''
                        )}
                        <ChevronRight className="ml-auto stroke-slate-500 transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className={'mx-9 mt-2'}>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={'text-xs font-medium text-slate-500'}
                            >
                              <Link href={subItem.url}>
                                <span className="">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : (
                  //don't have subitems
                  <>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={
                        'hover:text-accent-foreground flex h-auto cursor-pointer items-center overflow-hidden ' +
                        'rounded-md p-3 py-2 text-sm font-medium opacity-100 group-data-[collapsible=icon]:size-10! [&>svg]:size-6' +
                        ' group-data-[collapsible=icon]:px-3!'
                      }
                    >
                      <Link
                        href={item.url!}
                        className="flex items-center gap-3 [&>svg]:size-6"
                      >
                        {item.icon && (
                          <Icon className={'flex-none stroke-slate-500'} />
                        )}
                        {!isMinimized ? (
                          <span className="mr-2 truncate text-slate-500">
                            {item.title}
                          </span>
                        ) : (
                          ''
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
