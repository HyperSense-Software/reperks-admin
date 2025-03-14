import { Suspense } from 'react';
import ChangePasswordForm from './changePasswordForm';

export default function ChangePassword() {
  return (
    <Suspense>
      <ChangePasswordForm />
    </Suspense>
  );
}
