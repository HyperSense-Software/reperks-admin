import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { getLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

import './globals.css';
import { StoreProvider } from '@/components/StoreProvider/StoreProvider';
import ConfigureAmplifyClientSide from '@/components/common/ConfigureAmplifyClientSide';
import { Toaster } from '@/components/ui/sonner';
import Favicon from './favicon.ico';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard App',
  description: 'Dashboard App',
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href={Favicon.src} sizes="any" />
        <title></title>
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <NextTopLoader showSpinner={false} />
          <ConfigureAmplifyClientSide>
            <ConfigureAmplifyClientSide>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </ConfigureAmplifyClientSide>
            <Toaster richColors />
          </ConfigureAmplifyClientSide>
        </StoreProvider>
      </body>
    </html>
  );
}
