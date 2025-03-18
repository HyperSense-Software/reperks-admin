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

const LoginMFASelection = () => {
  const locale = useLocale();
  const [twoFactorAuth, setTwoFactorAuth] = useState('');

  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      <Card className={`w-dvw max-w-sm`}>
        <CardHeader>
          <CardTitle>Choose verification method</CardTitle>
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
                <Label htmlFor="totp">Google Authenticator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="sms"
                  id="sms"
                  onClick={() => {
                    setTwoFactorAuth('sms');
                  }}
                />
                <Label htmlFor="sms">SMS</Label>
              </div>
            </RadioGroup>
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-between">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/${locale}/dashboard`}>Cancel</Link>
          </Button>

          <Button
            asChild
            type="button"
            className={twoFactorAuth !== '' ? `` : `bg-gray-200`}
          >
            <Link
              href={
                twoFactorAuth === 'sms'
                  ? `/confirm-code?verify=sms`
                  : twoFactorAuth === 'totp'
                    ? `/confirm-code?verify=totp`
                    : '/login'
              }
            >
              Continue
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginMFASelection;
