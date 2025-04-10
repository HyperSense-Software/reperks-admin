'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import { useAppDispatch } from '@/store';

const ConfirmTOTPCodeForm = () => {
  const locale = useLocale();
  const t = useTranslations('auth.confirm-code');
  const params = useSearchParams();
  const verify2FAType = params.get('verify');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);

  const fetchCurrentUser = async () => {
    fetchAuthSession()
      .then((session) => {
        if (session.tokens) {
          dispatch(TOGGLE_LOADER(false));
          toast.success(t('submit.success'));
          router.push(`/${locale}/dashboard`);
        }
      })
      .catch((error: Error) => {
        dispatch(TOGGLE_LOADER(false));
        toast.error(JSON.stringify(error.message));
      });
  };

  const onSubmit = async () => {
    setSendingCode(true);
    dispatch(TOGGLE_LOADER(true));
    try {
      const response = await confirmSignIn({
        challengeResponse: code,
      });

      if (response.isSignedIn) {
        await fetchCurrentUser();
      } else {
        switch (response.nextStep.signInStep) {
          case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
            router.push(`/${locale}/change-password`);
            break;
          case 'RESET_PASSWORD':
            router.push(`/${locale}/forgot-password`);
            break;
          case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            router.push(`/${locale}/auth/confirm-code`);
            break;
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
            break;
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            router.push(`/${locale}/auth/confirm-code`);
            break;
          case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
            router.push(`/${locale}/auth/selectionMFA`);
            break;
          case 'CONFIRM_SIGN_UP':
          case 'DONE':
            // code block
            break;
          default:
          // code block
        }
        dispatch(TOGGLE_LOADER(false));
        toast.error(
          `${t('submit.next')} ${JSON.stringify(response.nextStep.signInStep)}`,
        );
      }
    } catch (err: unknown) {
      dispatch(TOGGLE_LOADER(false));
      toast.error(JSON.stringify(err));
    } finally {
      setSendingCode(false);
    }
  };

  return (
    <div className="flex flex-col content-center justify-center gap-8 self-center">
      <Card className="w-full max-w-sm border-none bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-left text-2xl text-zinc-950">
            {verify2FAType === 'sms'
              ? t('sms.title')
              : verify2FAType === 'totp'
                ? t('totp.title')
                : ''}
          </CardTitle>
          <CardDescription className="text-left text-sm text-zinc-500">
            {verify2FAType === 'sms'
              ? t('sms.description')
              : verify2FAType === 'totp'
                ? t('totp.description')
                : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className={'mx-auto'}>
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
        </CardContent>
        <CardFooter className="justify-between">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/${locale}`}>{t('form.cancel')}</Link>
          </Button>
          <Button
            type="button"
            disabled={sendingCode}
            onClick={() => {
              onSubmit();
            }}
          >
            {t('form.submit')}
            {sendingCode ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              ''
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmTOTPCodeForm;
