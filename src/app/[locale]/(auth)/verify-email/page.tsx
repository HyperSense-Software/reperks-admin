'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmSignUp } from 'aws-amplify/auth';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

export default function ConfirmCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    'success' | 'error' | null
  >(null);
  const t = useTranslations('auth.verify-email');

  useEffect(() => {
    if (!email || !code) {
      setVerificationResult('error');
      setIsVerifying(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        await confirmSignUp({
          username: email,
          confirmationCode: code,
        });

        setVerificationResult('success');
        setIsVerifying(false);
        toast.success(t('toast.success'));
      } catch (error) {
        console.error('Error confirming sign up', error);
        setVerificationResult('error');
        setIsVerifying(false);
        toast.error(t('toast.error'));
      }
    };

    verifyEmail().then();
  }, [code, email, router, t]);

  if (!code || !email) {
    return <InvalidParams />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>

      {isVerifying && <p className="text-gray-600">{t('isVerifying')}</p>}

      {verificationResult === 'success' && !isVerifying && (
        <div className="text-center">
          <p className="mb-2 font-medium text-green-600">{t('success')}</p>
        </div>
      )}

      {verificationResult === 'error' && !isVerifying && (
        <div className="text-center">
          <p className="mb-2 font-medium text-red-600">{t('error')}</p>
          <p className="text-gray-600"> {t('error-message')}</p>
        </div>
      )}
    </div>
  );
}
