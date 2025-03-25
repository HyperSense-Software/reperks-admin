'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';

const LoginMFASelection = () => {
  const locale = useLocale();
  const [twoFactorAuth, setTwoFactorAuth] = useState('');
  const t = useTranslations('auth.mfa');
  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
        <CardHeader className={'gap gap-6 text-center'}>
          <CardTitle className="text-left text-2xl text-zinc-950">
            {t('title')}
          </CardTitle>
          <CardDescription>
            <RadioGroup defaultValue="" className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="totp"
                  id="totp"
                  onClick={() => {
                    setTwoFactorAuth('totp');
                  }}
                />
                <Label className={'text-sm text-zinc-500'} htmlFor="totp">
                  {t('methods.googleAuth.label')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="sms"
                  id="sms"
                  onClick={() => {
                    setTwoFactorAuth('sms');
                  }}
                />
                <Label className={'text-sm text-zinc-500'} htmlFor="sms">
                  {t('methods.sms.label')}
                </Label>
              </div>
            </RadioGroup>
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/${locale}/dashboard`}>{t('cancel')}</Link>
          </Button>

          <Button asChild type="button">
            <Link
              href={
                twoFactorAuth === 'sms'
                  ? `/confirm-code?verify=sms`
                  : twoFactorAuth === 'totp'
                    ? `/confirm-code?verify=totp`
                    : '/login'
              }
              className={
                twoFactorAuth !== ''
                  ? ``
                  : `bg-gray-200` +
                    ' !bg-zinc-900 font-medium text-zinc-50 hover:bg-zinc-700'
              }
            >
              {t('continue')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginMFASelection;
