import { Metadata } from 'next';
import ForgotPasswordForm from './forgotPasswordForm';

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: 'Forgot password',
    template: '%s | Turo',
  },
  description: 'Forgot password',
};

export default function RecoverPassword() {
  return <ForgotPasswordForm />;
}
