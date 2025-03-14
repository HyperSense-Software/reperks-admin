'use server';
import React, { ReactNode } from 'react';
import { AuthGetCurrentUserServer } from '@/utils/amplify-utils';
import { redirect } from 'next/navigation';

const VerifyUserAuth = async ({
  children,
  role,
}: Readonly<{ children: ReactNode; role: string[] }>) => {
  const authSession = await AuthGetCurrentUserServer();

  const UserGroups = authSession && authSession?.tokens?.idToken?.payload['cognito:groups'];
  const UserGroupsStringArray: string[] =
    UserGroups && Array.isArray(UserGroups)
      ? (UserGroups.filter((item) => typeof item === 'string') as string[])
      : [];

  if (
    !(
      UserGroups &&
      Array.isArray(UserGroups) &&
      UserGroupsStringArray.some((element) => role.includes(element))
    )
  ) {
    redirect('/login');
  } else {
    return <>{children}</>;
  }
};

export default VerifyUserAuth;
