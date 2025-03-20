import { Metadata } from 'next';
import { InvalidParams } from '@/app/[locale]/(auth)/reset-password/InvalidParams';
// import ResetPasswordForm from './resetPasswordForm';
import { getTranslations } from 'next-intl/server';

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
  return <InvalidParams />;
  // }

  // return <ResetPasswordForm email={email} code={code} />;
}
