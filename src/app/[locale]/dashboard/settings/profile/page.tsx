'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PersonalInfoForm from '@/app/[locale]/dashboard/settings/profile/personal-info-form';
import { AxiosResponse } from 'axios';
import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';
import { IUser } from '@/models/user.interface';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import BillingInfoForm from '@/app/[locale]/dashboard/settings/profile/billing-info-form';
import { fetchUserAttributes } from '@aws-amplify/auth';
import PhoneChangeForm from '@/app/[locale]/dashboard/settings/profile/phone-change-form';
import PhoneConfirmCodeComponent from '@/app/[locale]/dashboard/settings/profile/phone-confirm-form';

export const dynamic = 'force-dynamic';

const EditProfile = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPhone, setIsLoadingPhone] = useState(true);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [verifyPhone, setVerifyPhone] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching user profile...');
      try {
        setIsLoading(true);
        const apiPath =
          process.env.NEXT_PUBLIC_API_BASE_URL + 'v1/landlord/users/getProfile';
        const response: AxiosResponse<Response<IUser>> =
          await axiosInstance.get(apiPath);

        if (
          response.data.error_code.code === 0 &&
          response.data.error_code.message === 'Success'
        ) {
          setUser(response.data.response);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function loadUserAttributes() {
      try {
        const userAttributes = await fetchUserAttributes();
        if (userAttributes.phone_number) {
          setUserPhone(userAttributes.phone_number);
          setVerifyPhone(userAttributes.phone_number_verified !== 'true');
        }
        setIsLoadingPhone(false);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
        setIsLoadingPhone(false);
      }
    }

    loadUserAttributes();
  }, [verifyPhone]);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-[20px] w-[250px] rounded-full" />
      <Skeleton className="h-[20px] w-full rounded-full" />
      <Skeleton className="h-[20px] w-full rounded-full" />
      <Skeleton className="h-[20px] w-3/4 rounded-full" />
      <Skeleton className="mt-6 h-[40px] w-1/2 rounded-md" />
    </div>
  );

  return (
    <main className="">
      <Card className="w-full max-w-2xl">
        <CardHeader className={'m-0 gap-0 border-b-1 pb-4'}>
          <CardTitle className={'text-xl'}>Personal info</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : user ? (
            <PersonalInfoForm initialData={user} />
          ) : (
            <p>Failed to load user information.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 w-full max-w-2xl">
        <CardHeader className={'m-0 gap-0 border-b-1 pb-4'}>
          <CardTitle className={'text-xl'}>Phone number</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPhone ? (
            <LoadingSkeleton />
          ) : (
            <>
              {!verifyPhone ? (
                <PhoneChangeForm
                  phone={userPhone}
                  setVerifyPhone={setVerifyPhone}
                />
              ) : (
                <PhoneConfirmCodeComponent
                  phone={userPhone}
                  setVerifyPhone={setVerifyPhone}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4 w-full max-w-2xl">
        <CardHeader className={'m-0 gap-0 border-b-1 pb-4'}>
          <CardTitle className={'text-xl'}>Billing information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : user ? (
            <BillingInfoForm initialData={user} />
          ) : (
            <p>Failed to load user information.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default EditProfile;
