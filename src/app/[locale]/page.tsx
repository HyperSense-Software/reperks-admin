import { LoginForm } from '@/app/[locale]/(auth)/login/loginForm';

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
