import Login from '@/app/[locale]/(auth)/login/page';
import { ResponsiveImage } from '@/components/images/ResponsiveImage';
import LoginLeftSideImg from '@/public/assets/images/login-left-side.jpg';
import React from 'react';

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid min-h-svh w-full md:grid-rows-2 lg:grid-cols-2 lg:grid-rows-1">
        <div className="bg-muted relative hidden md:block">
          <ResponsiveImage
            imageUrl={LoginLeftSideImg}
            priority={true}
            name="login-left-side"
            width={0}
            height={0}
            className={
              'absolute inset-0 aspect-[192/152] h-full w-full object-cover sm:aspect-[376/137] lg:aspect-[47/33] dark:brightness-[0.2] dark:grayscale'
            }
          />
        </div>

        <div className="bg-surface-base flex flex-col gap-4 p-6 md:p-10">
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm text-center">
              <Login />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
