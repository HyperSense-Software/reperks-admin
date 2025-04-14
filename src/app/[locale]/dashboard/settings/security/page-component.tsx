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
import { fetchUserAttributes } from '@aws-amplify/auth';
import { Badge } from '@/components/ui/badge';

export type AuthMFAType = 'SMS' | 'TOTP' | 'EMAIL' | null;

const ProfileSecurityComponent = () => {
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const [mfaPreferred, setMfaPreferred] = useState<AuthMFAType>(null);
  const [mfaEnabledType, setMfaEnabledType] = useState<AuthMFAType[]>([]);

  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [verifyPhone, setVerifyPhone] = useState<boolean>(false);

  const t = useTranslations('dashboard.settings.security');

  const setAsPreferredMFA = async (preferred: string) => {
    dispatch(TOGGLE_LOADER(true));
    try {
      switch (preferred) {
        case 'SMS':
          await updateMFAPreference({ sms: 'PREFERRED' });
          setMfaPreferred('SMS');
          getUserSettingMFA();
          toast.success(t('sms.success'));
          break;
        case 'TOTP':
          await updateMFAPreference({ totp: 'PREFERRED' });
          setMfaPreferred('TOTP');
          getUserSettingMFA();
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
          getUserSettingMFA();
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
          getUserSettingMFA();
          break;
        default:
          await updateMFAPreference({ sms: 'DISABLED', totp: 'DISABLED' });
          setMfaEnabledType([]);
          getUserSettingMFA();
          toast.success(t('default.disabled'));
          break;
      }
    } catch (err: unknown) {
      toast.error(JSON.stringify(err));
    } finally {
      dispatch(TOGGLE_LOADER(false));
    }
  };
  const getUserSettingMFA = async () => {
    dispatch(TOGGLE_LOADER(true));
    fetchMFAPreference()
      .then(({ enabled, preferred }: FetchMFAPreferenceOutput) => {
        console.log('enabled', enabled);
        console.log('preferred', preferred);
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
  };
  const getUserAttributes = async () => {
    try {
      dispatch(TOGGLE_LOADER(true));
      const userAttributes = await fetchUserAttributes();

      console.log('userAttributes', userAttributes);
      if (userAttributes.phone_number) {
        setUserPhone(userAttributes.phone_number);
        setVerifyPhone(userAttributes.phone_number_verified === 'true');
      }
      dispatch(TOGGLE_LOADER(false));
      // setIsLoadingPhone(false);
    } catch (error) {
      console.error('Error fetching user attributes:', error);
      dispatch(TOGGLE_LOADER(false));
      // setIsLoadingPhone(false);
    }
  };

  useEffect(() => {
    getUserSettingMFA();
    getUserAttributes();
  }, []);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className={`flex w-full flex-col gap-6`}>
        <Card>
          <CardHeader className="gap-2">
            <CardTitle>{t('sms.title')}</CardTitle>
            <CardDescription>{t('sms.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`flex w-full gap-2`}>
              {mfaEnabledType.includes('SMS') ? (
                <Badge variant={'default'}>{t('sms.enabled')}</Badge>
              ) : null}
              {mfaPreferred === 'SMS' ? (
                <Badge variant={'outline'}>{t('sms.default')}</Badge>
              ) : null}
            </div>
          </CardContent>
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
                {userPhone && verifyPhone ? (
                  mfaEnabledType.includes('SMS') ? (
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={() => {
                        setAsPreferredMFA('SMS');
                      }}
                    >
                      {t('sms.set-preferred')}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={() => {
                        setAsPreferredMFA('SMS');
                      }}
                    >
                      {t('sms.enabled')}
                    </Button>
                  )
                ) : (
                  <Link href={`/${locale}/dashboard/2FA/sms/addPhone`}>
                    {t('sms.add-phone-txt')}
                  </Link>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('totp.title')}</CardTitle>
            <CardDescription>{t('totp.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            <div className={`flex w-full gap-2`}>
              {mfaEnabledType.includes('TOTP') ? (
                <Badge variant={'default'}>{t('totp.enabled')}</Badge>
              ) : null}

              {mfaPreferred === 'TOTP' ? (
                <Badge variant={'outline'}>{t('totp.default')}</Badge>
              ) : null}
            </div>
          </CardContent>

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
