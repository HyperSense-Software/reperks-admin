import { Metadata } from 'next';
import ResetPasswordForm from './resetPasswordForm';
import { InvalidParams } from '@/app/(auth)/reset-password/InvalidParams';

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Reset password',
    template: '%s | Turo',
  },
  description: 'Reset password',
};

export default function ResetPassword({
  searchParams,
}: {
  searchParams?: { code: string | undefined; email: string | undefined };
}) {
  const email = searchParams?.email;
  const code = searchParams?.code;

  if (!code || !email) {
    return <InvalidParams />;
  }

  return <ResetPasswordForm email={email} code={code} />;
}
