import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

export function InvalidParams() {
  const locale = useLocale();
  const t = useTranslations('auth.reset-password.invalidLink');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className={'text-center'}>
        <Button>
          <Link href={`/${locale}`}>{t('cta')}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
