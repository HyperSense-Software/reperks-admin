'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  fetchMFAPreference,
  FetchMFAPreferenceOutput,
  updateMFAPreference,
} from 'aws-amplify/auth';
import { useLocale, useTranslations } from 'next-intl';

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

  const t = useTranslations('dashboard.settings.security');

  const setAsPreferredMFA = async (preferred: string) => {
    dispatch(TOGGLE_LOADER(true));
    try {
      switch (preferred) {
        case 'SMS':
          await updateMFAPreference({ sms: 'PREFERRED' });
          setMfaPreferred('SMS');
          toast.success(t('sms.success'));
          break;
        case 'TOTP':
          await updateMFAPreference({ totp: 'PREFERRED' });
          setMfaPreferred('TOTP');
          toast.success(t('totp.success'));
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
          toast.success(t('sms.disabled'));
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
          toast.success(t('totp.disabled'));
          break;
        default:
          await updateMFAPreference({ sms: 'DISABLED', totp: 'DISABLED' });
          setMfaEnabledType([]);
          toast.success(t('default.disabled'));
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
            <CardTitle>{t('sms.title')}</CardTitle>
            <CardDescription>{t('sms.description')}</CardDescription>
          </CardHeader>
          {mfaPreferred === 'SMS' ? (
            <CardContent className="flex w-full flex-row items-center">
              <div className={`rounded-full bg-emerald-700 px-2.5 py-0.5`}>
                <p className={`font-semibold text-white`}>{t('sms.enabled')}</p>
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
                  {t('sms.set-preferred')}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => {
                  turnOffMFA('SMS');
                }}
              >
                {t('sms.turn-off')}
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex flex-row justify-end">
              <Button asChild type="button">
                <Link href={`/${locale}/dashboard/2FA/sms/addPhone`}>
                  {t('sms.submit-txt')}
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('totp.title')}</CardTitle>
            <CardDescription>{t('totp.description')}</CardDescription>
          </CardHeader>

          {mfaPreferred === 'TOTP' ? (
            <CardContent className="flex w-full flex-row items-center">
              <div className={`rounded-full bg-emerald-700 px-2.5 py-0.5`}>
                <p className={`font-semibold text-white`}>
                  {t('totp.enabled')}
                </p>
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
                  {t('totp.set-preferred')}
                </Button>
              ) : null}

              <Button
                type="button"
                onClick={() => {
                  turnOffMFA('TOTP');
                }}
              >
                {t('totp.turn-off')}
              </Button>
            </CardFooter>
          ) : (
            <CardFooter className="flex flex-row justify-end">
              <Button asChild type="button">
                <Link href={`/${locale}/dashboard/2FA/totp/qrCode`}>
                  {t('totp.submit-txt')}
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
