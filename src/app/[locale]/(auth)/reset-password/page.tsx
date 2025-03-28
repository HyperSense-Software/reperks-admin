import { Metadata } from 'next';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import ResetPasswordForm from './resetPasswordForm';

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

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const email = (await searchParams).email as string;
  const code = (await searchParams).code as string;

  if (!code || !email) {
    return <InvalidParams />;
  }

  return <ResetPasswordForm email={email} code={code} />;
}
