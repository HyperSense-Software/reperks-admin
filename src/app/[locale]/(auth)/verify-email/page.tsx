'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { confirmSignUp } from 'aws-amplify/auth';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { toast } from 'sonner';

export default function ConfirmCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<
    'success' | 'error' | null
  >(null);

  useEffect(() => {
    if (email && code) {
      console.log('email', email);
      confirmSignUp({
        username: email,
        confirmationCode: code,
      })
        .then((data) => {
          setVerificationResult('success');
          setIsVerifying(true);
          console.log(data);
          toast.success('Email verified successfully');
        })
        .catch((error) => {
          console.error('Error confirming sign up', error);
          setIsVerifying(true);
          setVerificationResult('error');
        });
    } else {
      setVerificationResult('error');
      setIsVerifying(true);
    }
  }, []);

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
