import { Suspense } from 'react';
import ChangePasswordForm from './changePasswordForm';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'auth.change-password',
  });

  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
  };
}

export default function ChangePassword() {
  return (
    <Suspense>
      <ChangePasswordForm />
    </Suspense>
  );
}
