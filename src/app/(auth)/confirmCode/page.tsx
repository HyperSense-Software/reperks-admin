'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { confirmSignIn, fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { TOGGLE_LOADER } from '@/store/app/app.actions';
import { useAppDispatch } from '@/store';
import { Loader2 } from 'lucide-react';

const ConfirmTOTPCode = () => {
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
          toast.success('Successfully logged in!');
          router.push('/dashboard');
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
            router.push(`/change-password`);
            break;
          case 'RESET_PASSWORD':
            router.push(`/forgot-password`);
            break;
          case 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE':
          case 'CONFIRM_SIGN_IN_WITH_TOTP_CODE':
            router.push('/auth/confirmCode');
            break;
          case 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP':
            break;
          case 'CONFIRM_SIGN_IN_WITH_SMS_CODE':
            router.push('/auth/confirmCode');
            break;
          case 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION':
            router.push('/auth/selectionMFA');
            break;
          case 'CONFIRM_SIGN_UP':
          case 'DONE':
            // code block
            break;
          default:
          // code block
        }
        dispatch(TOGGLE_LOADER(false));
        toast.error(`NEXT STEP: ${JSON.stringify(response.nextStep.signInStep)}`);
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
      <Card className={`w-dvw max-w-sm`}>
        <CardHeader>
          <CardTitle>
            {verify2FAType === 'sms'
              ? 'Verify code number'
              : verify2FAType === 'totp'
                ? 'Verify Google Authenticator'
                : ''}
          </CardTitle>
          <CardDescription>
            {verify2FAType === 'sms'
              ? 'Enter the code you received on your phone.'
              : verify2FAType === 'totp'
                ? 'Enter a code from Google Authenticator to make sure everything works.'
                : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter className="justify-between">
          <Button asChild type="button" variant={'outline'}>
            <Link href={`/`}>Cancel</Link>
          </Button>
          <Button
            type="button"
            disabled={sendingCode}
            onClick={() => {
              onSubmit();
            }}
          >
            Continue
            {sendingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ''}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmTOTPCode;
