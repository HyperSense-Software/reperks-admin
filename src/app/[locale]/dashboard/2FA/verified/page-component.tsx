'use client';
import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

const Verified2FAComponent = () => {
  const locale = useLocale();
  const params = useSearchParams();
  const verified2FAType = params.get('verified') || '';
  const t = useTranslations('dashboard.mfa.verified');

  return (
    <Card className={`w-dvw max-w-[744px]`}>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {['sms', 'totp'].indexOf(verified2FAType) > -1
            ? t('description.' + verified2FAType)
            : null}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardFooter className="flex flex-row justify-end py-6">
        <Button asChild type="button">
          <Link href={`/${locale}/dashboard/settings/security`}>Done</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Verified2FAComponent;
