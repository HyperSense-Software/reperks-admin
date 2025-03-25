import { Metadata } from 'next';
import ForgotPasswordForm from './forgotPasswordForm';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'auth.forgot-password',
  });

  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
  };
}

export default function RecoverPassword() {
  return;
  <ForgotPasswordForm />;
}
