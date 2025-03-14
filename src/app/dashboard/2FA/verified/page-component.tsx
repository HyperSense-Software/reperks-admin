'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardFooter, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Verified2FAComponent = () => {
  const params = useSearchParams();
  const verified2FAType = params.get('verified');
  return (
    <Card className={`w-dvw max-w-[744px]`}>
      <CardHeader>
        <CardTitle>Verified</CardTitle>
        <CardDescription>
          {verified2FAType === 'sms'
            ? 'From now on, you’ll use verification via SMS to sign in to HSS Admin.'
            : verified2FAType === 'totp'
              ? 'From now on, you’ll use Google Authenticator to sign in to HSS Admin.'
              : null}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardFooter className="flex flex-row justify-end py-6">
        <Button asChild type="button">
          <Link href={`/dashboard/settings/security`}>Done</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Verified2FAComponent;
