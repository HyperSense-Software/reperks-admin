import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ConfirmTOTPCodeForm from '@/app/[locale]/(auth)/confirm-code/confirmCodeForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await params).locale,
    namespace: 'auth.confirm-code',
  });

  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
  };
}

export default function ConfirmCode() {
  return <ConfirmTOTPCodeForm />;
}
