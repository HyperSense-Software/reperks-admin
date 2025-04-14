'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { DetailedHTMLProps, HTMLAttributes } from 'react';
import axiosInstance from '@/instance/axiosInstance';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

export const LanguageSwitcher = ({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('LanguageSwitcher');

  const handleLanguageChange = async (newLocale: string) => {
    if (locale === newLocale) return;

    const pathParts = pathname.split('/');
    pathParts[1] = newLocale;
    const newPath = pathParts.join('/');

    try {
      await axiosInstance.put(
        process.env.NEXT_PUBLIC_API_BASE_URL + 'v1/common/users/updateLang',
        {
          lang: newLocale,
        },
      );
      router.push(newPath);
    } catch (error) {
      console.error('Error updating language', error);
    }

    router.push(newPath);
  };

  return (
    <div {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t('switchLanguage')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between"
            >
              {language.name}
              {locale === language.code && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
