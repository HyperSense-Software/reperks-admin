import { Metadata } from 'next';
import React from 'react';
import { LoginForm } from './loginForm';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'auth.login',
  });

  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
  };
}

export default function Login() {
  return <LoginForm></LoginForm>;
}
