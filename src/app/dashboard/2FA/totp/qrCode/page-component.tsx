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

const TOTPQRCodeComponent = () => {
  const dispatch = useAppDispatch();
  const [uri, setURI] = useState<URL>();

  useEffect(() => {
    dispatch(TOGGLE_LOADER(true));
    setUpTOTP()
      .then((totpSetupDetails) => {
        const appName = 'HSS-next-admin';
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
      <div className={`flex w-dvw max-w-[744px] flex-col content-center justify-center gap-6`}>
        <p className={`self-center font-medium text-gray-500`}>Step 1 of 2</p>
        <Progress value={50} className={`bg-white`} />
      </div>
      <Card className={`w-dvw max-w-sm`}>
        <CardHeader>
          <CardTitle>Register HSS Admin</CardTitle>
          <CardDescription>
            Open the Google Authenticator app and scan this QR code.
          </CardDescription>
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

          <div>
            <p className={`font-normal text-gray-500`}>Or enter the following code manually:</p>
            {uri ? (
              <p className={`font-semibold text-gray-500`}>
                {JSON.stringify(uri).split('"')[2].replaceAll('-', '').replaceAll('\\', '')}
              </p>
            ) : null}
          </div>

          <Alert
            className={`flex w-full flex-row content-center justify-center gap-3 rounded-md border border-gray-200 bg-white p-4 align-middle`}
          >
            <InfoCircledIcon className="h-4 w-4" />
            <AlertTitle className="font-medium">
              Once HSS Admin is registered you’ll start seeing 6-digit verification codes in the
              app.
            </AlertTitle>
          </Alert>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-row justify-end gap-6 py-6">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/dashboard/settings/security`}>
              <p className={`font-medium`}>Cancel</p>
            </Link>
          </Button>
          <Button asChild type="button">
            <Link href={`/dashboard/2FA/confirmCode?confirm=totp`}>Continue</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TOTPQRCodeComponent;
