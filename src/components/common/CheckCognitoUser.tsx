'use client';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { ReactNode, useEffect } from 'react';
import { fetchUserAttributes, signOut } from '@aws-amplify/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

Amplify.configure(awsconfig, { ssr: true });

export default function CheckCognitoUser({
  children,
}: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserAttributes();
      } catch (error) {
        // logout user
        console.log(error);
        await signOut().then(() => {
          toast.success('Logged out');
          router.push(`/`);
        });
      }
    };

    fetchData();
  });

  return children;
}
