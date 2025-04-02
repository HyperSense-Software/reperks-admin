'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import QRCode from 'react-qr-code';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useAppDispatch } from '@/store';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import { setUpTOTP } from '@aws-amplify/auth';
import { useLocale, useTranslations } from 'next-intl';

const TOTPQRCodeComponent = () => {
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const [uri, setURI] = useState<URL>();
  const t = useTranslations('dashboard.mfa.totp.qrCode');

  useEffect(() => {
    dispatch(TOGGLE_LOADER(true));
    setUpTOTP()
      .then((totpSetupDetails) => {
        const appName = 'reperks';
        const setupUri = totpSetupDetails.getSetupUri(appName);
        setURI(setupUri);
      })
      .catch((err) => {
        toast.error(JSON.stringify(err));
      })
      .finally(() => {
        dispatch(TOGGLE_LOADER(false));
      });
  }, [dispatch]);

  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      <div
        className={`flex w-dvw max-w-[744px] flex-col content-center justify-center gap-6`}
      >
        <p className={`self-center font-medium text-gray-500`}>{t('title')}</p>
        <Progress value={50} className={`bg-white`} />
      </div>
      <Card className={`mx-auto w-dvw max-w-sm`}>
        <CardHeader>
          <CardTitle>{t('card.title')}</CardTitle>
          <CardDescription>{t('card.description')}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 px-6 pb-6">
          {uri ? (
            <div className="flex w-full flex-col content-center justify-center">
              <QRCode
                className=""
                size={256}
                style={{ height: 'auto', width: 224, alignSelf: 'center' }}
                value={uri.toString()}
              />
            </div>
          ) : null}

          <Alert
            className={`flex w-full flex-row content-center justify-center gap-3 rounded-md border border-gray-200 bg-white p-4 align-middle`}
          >
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle className="font-medium">{t('card.alert')}</AlertTitle>
          </Alert>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-row justify-end gap-6 py-6">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/${locale}/dashboard/settings/security`}>
              <p className={`font-medium`}>{t('cancel')}</p>
            </Link>
          </Button>
          <Button asChild type="button">
            <Link href={`/${locale}/dashboard/2FA/confirm-code?confirm=totp`}>
              {t('continue')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TOTPQRCodeComponent;
