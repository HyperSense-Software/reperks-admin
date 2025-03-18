'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { languageNames, languages } from '@/utils/dictionaries';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLang: string) => {
    // Get the current path without the language prefix
    const pathWithoutLang = pathname.replace(`/${currentLang}`, '') || '/';

    // Navigate to the same page but with the new language
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {languageNames[currentLang as keyof typeof languageNames] || 'Language'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className={lang === currentLang ? 'font-bold' : ''}
          >
            {languageNames[lang as keyof typeof languageNames]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
