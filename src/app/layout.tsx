import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React, { ReactNode } from 'react';

import './globals.css';
import { StoreProvider } from '@/components/StoreProvider/StoreProvider';
import ConfigureAmplifyClientSide from '@/components/common/ConfigureAmplifyClientSide';
import { Toaster } from '@/components/ui/sonner';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard App',
  description: 'Dashboard App',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <NextTopLoader showSpinner={false} />
          <ConfigureAmplifyClientSide>
            {children}
            <Toaster richColors />
          </ConfigureAmplifyClientSide>
        </StoreProvider>
      </body>
    </html>
  );
}
