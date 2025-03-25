import { Metadata } from 'next';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
import { getTranslations } from 'next-intl/server';
import React from 'react';

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
  // const email = searchParams.email as string;
  // const code = searchParams.code as string;

  // if (!code || !email) {
  {
    /*<ResetPasswordForm email={'ady2test.com'} code={'1234'} />*/
  }
  return;
  <InvalidParams />;
}
