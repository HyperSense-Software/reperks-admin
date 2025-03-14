'use client';
import React, { useState } from 'react';
import Link from 'next/link';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
  confirmUserAttribute,
  sendUserAttributeVerificationCode,
  updateMFAPreference,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const TOTPConfirmCodeComponent = () => {
  const params = useSearchParams();
  const confirm2FAType = params.get('confirm');
  const router = useRouter();
  const [resendCode, setResendCode] = useState(false);
  const [code, setCode] = useState('');
  const [verifyCode, setVerifyCode] = useState(false);

  const resentCode = async () => {
    setResendCode(true);
    try {
      await sendUserAttributeVerificationCode({
        userAttributeKey: 'phone_number',
      });
      toast.success(`SMS Code resent`);
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      setResendCode(false);
    }
  };
  const onSubmit = async () => {
    setVerifyCode(true);
    try {
      switch (confirm2FAType) {
        case 'totp':
          await verifyTOTPSetup({
            code: code,
          });
          await updateMFAPreference({ totp: 'PREFERRED' });
          break;
        case 'sms':
          await confirmUserAttribute({
            userAttributeKey: 'phone_number',
            confirmationCode: code,
          });
          await updateMFAPreference({ sms: 'PREFERRED' });
          break;
      }
      toast.success(`${confirm2FAType?.toUpperCase()} Code Confirmed`);
      router.push(`/dashboard/2FA/verified?verified=${confirm2FAType}`);
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      setVerifyCode(false);
    }
  };

  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      {confirm2FAType === 'totp' ? (
        <div className={`flex w-dvw max-w-[744px] flex-col content-center justify-center gap-6`}>
          <p className={`self-center font-medium text-gray-500`}>Step 2 of 2</p>
          <Progress value={100} className={`bg-white`} />
        </div>
      ) : null}

      <Card className={`w-dvw max-w-[744px]`}>
        <CardHeader>
          <CardTitle>
            {confirm2FAType === 'sms'
              ? 'Verify code number'
              : confirm2FAType === 'totp'
                ? 'Verify Google Authenticator'
                : ''}
          </CardTitle>
          <CardDescription>
            {confirm2FAType === 'sms'
              ? 'Enter the code you received on your phone.'
              : confirm2FAType === 'totp'
                ? 'Enter a code from Google Authenticator to make sure everything works.'
                : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-row content-center items-center justify-start gap-6">
          <InputOTP
            maxLength={6}
            onChange={(value: string) => {
              setCode(value);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {confirm2FAType === 'sms' ? (
            <Button
              className={resendCode ? 'w-36 justify-between gap-2' : 'w-36 justify-between gap-2'}
              type={'button'}
              variant={'outline'}
              disabled={resendCode}
              onClick={() => {
                resentCode();
              }}
            >
              Resent code
              {resendCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            </Button>
          ) : null}
        </CardContent>

        <Separator />
        <CardFooter className="flex flex-row items-center justify-end gap-6 py-6">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/dashboard/settings/security`}>Cancel</Link>
          </Button>

          <Button
            type="button"
            className={
              code.length < 6
                ? 'w-28 justify-between gap-2 bg-gray-400'
                : verifyCode
                  ? 'w-28 justify-between'
                  : `w-28 justify-center`
            }
            disabled={verifyCode}
            onClick={() => {
              onSubmit();
            }}
          >
            Continue
            {verifyCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TOTPConfirmCodeComponent;
