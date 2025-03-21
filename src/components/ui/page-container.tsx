import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-57px)]">
          <div className="h-full bg-white p-6 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className="h-full bg-white p-6 md:px-8">{children}</div>
      )}
    </>
  );
}
