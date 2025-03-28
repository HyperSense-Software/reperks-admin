// src/app/[locale]/(auth)/verify-email/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmSignUp } from 'aws-amplify/auth';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';

export default function ConfirmCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    'success' | 'error' | null
  >(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!code || !email) return;

      try {
        await confirmSignUp({
          username: email,
          confirmationCode: code,
        });

        setVerificationResult('success');
        toast.success('Email verified successfully');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 3000);
      } catch (error) {
        console.error('Error confirming sign up', error);
        setVerificationResult('error');
        toast.error('Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [code, email, router, locale]);

  if (!code || !email) {
    return <InvalidParams />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Email Verification</h1>

      {isVerifying && (
        <p className="text-gray-600">Verifying your email address...</p>
      )}

      {verificationResult === 'success' && (
        <div className="text-center">
          <p className="mb-2 font-medium text-green-600">
            Your email has been verified successfully!
          </p>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      )}

      {verificationResult === 'error' && (
        <div className="text-center">
          <p className="mb-2 font-medium text-red-600">
            Failed to verify your email.
          </p>
          <p className="text-gray-600">Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}
