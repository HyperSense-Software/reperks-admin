import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

export function InvalidParams() {
  const locale = useLocale();
  const t = useTranslations('auth.reset-password.invalidLink');

  return (
    <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
      <CardHeader className={'gap-2 px-0'}>
        <CardTitle className="text-left text-2xl text-zinc-950">
          {t('title')}
        </CardTitle>
        <div className="text-left text-sm text-zinc-500">
          {t('description')}
        </div>
      </CardHeader>
      <CardFooter className={'flex-col px-0'}>
        <Button className="w-full cursor-pointer bg-zinc-900 font-medium text-zinc-50 hover:bg-zinc-700">
          <Link href={`/${locale}`}>{t('cta')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
