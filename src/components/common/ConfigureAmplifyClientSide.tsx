'use client';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { ReactNode } from 'react';

Amplify.configure(awsconfig, { ssr: true });

export default function ConfigureAmplifyClientSide({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
