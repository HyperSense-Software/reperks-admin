import { cookies } from 'next/headers';

import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { fetchAuthSession } from 'aws-amplify/auth/server';
import awsconfig from '@/components/common/aws-exports';
import { AuthSession } from '@aws-amplify/core';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: awsconfig,
});

export async function AuthGetCurrentUserServer(): Promise<
  AuthSession | undefined
> {
  try {
    return await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });
  } catch (error) {
    console.error(error);
  }
}
