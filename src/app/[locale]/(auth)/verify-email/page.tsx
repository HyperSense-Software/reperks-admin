'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmSignUp } from 'aws-amplify/auth';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { toast } from 'sonner';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/components/common/aws-exports';

// Configure Amplify globally
Amplify.configure(awsconfig, { ssr: true });

export default function ConfirmCode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    'success' | 'error' | null
  >(null);

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
        toast.success('Email verified successfully');
      } catch (error) {
        console.error('Error confirming sign up', error);
        setVerificationResult('error');
        setIsVerifying(false);
        toast.error('Failed to verify email');
      }
    };

    verifyEmail();
  }, [code, email, router]);

  if (!code || !email) {
    return <InvalidParams />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="mb-4 text-2xl font-semibold">Email Verification</h1>

      {isVerifying && (
        <p className="text-gray-600">Verifying your email address...</p>
      )}

      {verificationResult === 'success' && !isVerifying && (
        <div className="text-center">
          <p className="mb-2 font-medium text-green-600">
            Your email has been verified successfully!
          </p>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      )}

      {verificationResult === 'error' && !isVerifying && (
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
