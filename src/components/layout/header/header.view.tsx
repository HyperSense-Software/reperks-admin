'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileSidebar } from '@/components/layout/mobile-sidebar/mobile-sidebar';
import { cn } from '@udecode/cn';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import { signOut } from '@aws-amplify/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher.view';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('sidebar-top');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(TOGGLE_LOADER(true));
    try {
      await signOut();
      toast.success('Logged out');
      router.push(`/${locale}/login`);
      dispatch(TOGGLE_LOADER(false));
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
      dispatch(TOGGLE_LOADER(false));
    }
  };

  return (
    <header className="sticky inset-x-0 top-0 w-full shadow-sm">
      <nav className="border-border flex items-center justify-between border-b px-6 py-[10px] lg:justify-end">
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full p-[10px]"
              >
                <User className="overflow-hidden rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('title')}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/settings/security`}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t('settings')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t('logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
