'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  fetchMFAPreference,
  FetchMFAPreferenceOutput,
  updateMFAPreference,
} from 'aws-amplify/auth';
import { useLocale } from 'next-intl';

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
import { useAppDispatch } from '@/store';
import { TOGGLE_LOADER } from '@/store/app/app.actions';

export type AuthMFAType = 'SMS' | 'TOTP' | 'EMAIL' | null;

const ProfileSecurityComponent = () => {
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const [mfaPreferred, setMfaPreferred] = useState<AuthMFAType>(null);
  const [mfaEnabledType, setMfaEnabledType] = useState<AuthMFAType[]>([]);

  const setAsPreferredMFA = async (preferred: string) => {
    dispatch(TOGGLE_LOADER(true));
    try {
      switch (preferred) {
        case 'SMS':
          await updateMFAPreference({ sms: 'PREFERRED' });
          setMfaPreferred('SMS');
          toast.success('SMS set at preferred 2FA');
          break;
        case 'TOTP':
          await updateMFAPreference({ totp: 'PREFERRED' });
          setMfaPreferred('TOTP');
          toast.success('TOTP set at preferred 2FA');
          break;
      }
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      dispatch(TOGGLE_LOADER(false));
    }
  };
  const turnOffMFA = async (type?: string) => {
    dispatch(TOGGLE_LOADER(true));
    try {
      switch (type) {
        case 'SMS':
          if (mfaEnabledType.includes('TOTP')) {
            await updateMFAPreference({ sms: 'DISABLED', totp: 'PREFERRED' });
          } else {
            await updateMFAPreference({ sms: 'DISABLED' });
          }
          setMfaEnabledType(
            mfaEnabledType.filter((AuthMFAType) => AuthMFAType !== 'SMS'),
          );
          toast.success('Disabled SMS 2FA');
          break;
        case 'TOTP':
          if (mfaEnabledType.includes('SMS')) {
            await updateMFAPreference({ totp: 'DISABLED', sms: 'PREFERRED' });
          } else {
            await updateMFAPreference({ totp: 'DISABLED' });
          }
          setMfaEnabledType(
            mfaEnabledType.filter((AuthMFAType) => AuthMFAType !== 'TOTP'),
          );
          toast.success('Disabled TOTP 2FA');
          break;
        default:
          await updateMFAPreference({ sms: 'DISABLED', totp: 'DISABLED' });
          setMfaEnabledType([]);
          toast.success('Disabled MFA');
          break;
      }
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      dispatch(TOGGLE_LOADER(false));
    }
  };
  useEffect(() => {
    dispatch(TOGGLE_LOADER(true));

    fetchMFAPreference()
      .then(({ enabled, preferred }: FetchMFAPreferenceOutput) => {
        if (enabled) {
          setMfaEnabledType(enabled);
          if (preferred) {
            setMfaPreferred(preferred);
          }
        }
      })
      .catch((err: unknown) => {
        toast.error(JSON.stringify(err));
      })
      .finally(() => {
        dispatch(TOGGLE_LOADER(false));
      });
  }, [dispatch]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className={`flex w-full flex-col gap-6`}>
        <Card>
          <CardHeader className="gap-2">
            <CardTitle>SMS 2FA</CardTitle>
            <CardDescription>
              By enabling this feature you will have to register your phone and
              verify it with the code received vis SMS. Later on, every time you
              login into the app you will have to additionally very yourself by
              submitting a code that you will receive via SMS.
            </CardDescription>
          </CardHeader>
          {mfaPreferred === 'SMS' ? (
            <CardContent className="flex w-full flex-row items-center">
              <div className={`rounded-full bg-emerald-700 px-2.5 py-0.5`}>
                <p className={`font-semibold text-white`}>Enabled</p>
              </div>
            </CardContent>
          ) : null}
          <Separator />
          {mfaEnabledType && mfaEnabledType.includes('SMS') ? (
            <CardFooter className="flex flex-row justify-end gap-6">
              {mfaPreferred !== 'SMS' ? (
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setAsPreferredMFA('SMS');
                  }}
                >
                  Set as preferred 2FA
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => {
                  turnOffMFA('SMS');
                }}
              >
                Turn off
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex flex-row justify-end">
              <Button asChild type="button">
                <Link href={`/${locale}/dashboard/2FA/sms/addPhone`}>
                  Set up 2FA with SMS
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TOTP 2FA</CardTitle>
            <CardDescription>
              By enabling this feature you will have to scan a QR code with your
              phone in order to add the TOTP to an authenticator app like Google
              Authenticator.
            </CardDescription>
          </CardHeader>

          {mfaPreferred === 'TOTP' ? (
            <CardContent className="flex w-full flex-row items-center">
              <div className={`rounded-full bg-emerald-700 px-2.5 py-0.5`}>
                <p className={`font-semibold text-white`}>Enabled</p>
              </div>
            </CardContent>
          ) : null}

          <Separator />
          {mfaEnabledType && mfaEnabledType.includes('TOTP') ? (
            <CardFooter className="flex flex-row justify-end gap-6">
              {mfaPreferred !== 'TOTP' ? (
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => {
                    setAsPreferredMFA('TOTP');
                  }}
                >
                  Set as preferred 2FA
                </Button>
              ) : null}

              <Button
                type="button"
                onClick={() => {
                  turnOffMFA('TOTP');
                }}
              >
                Turn off
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex flex-row justify-end">
              <Button asChild type="button">
                <Link href={`/${locale}/dashboard/2FA/totp/qrCode`}>
                  Set up 2FA with TOTP
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfileSecurityComponent;
