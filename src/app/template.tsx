'use client';

import UIToaster from '@/components/ui/toaster';

export default function RootTemplate({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <UIToaster />
    </>
  );
}
