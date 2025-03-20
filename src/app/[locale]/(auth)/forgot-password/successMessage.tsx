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

export function SuccessMessage() {
  const locale = useLocale();
  // const t = useTranslations('auth.forgot-password');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Request submitted
        </CardTitle>
        <CardDescription className="text-center">
          The request has been submitted successfully. <br />
          Please check your email for further instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className={'text-center'}>
        <Button>
          <Link href={`/${locale}`}>Go back to homepage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
