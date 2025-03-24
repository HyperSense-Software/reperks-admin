import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useTranslations } from 'use-intl';

export function SuccessMessage() {
  const locale = useLocale();
  const t = useTranslations('auth.forgot-password.request-submitted');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        <CardDescription className="text-center">
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className={'text-center'}>
        <Button>
          <Link href={`/${locale}`}>{t('link-text')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
