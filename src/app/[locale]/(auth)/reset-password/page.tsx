import { Metadata } from 'next';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import ResetPasswordForm from './resetPasswordForm';
import { useSearchParams } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'auth.reset-password',
  });

  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
  };
}

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') as string;
  const code = searchParams.get('code') as string;

  if (!code || !email) {
    return <InvalidParams />;
  }

  return <ResetPasswordForm email={email} code={code} />;
}
