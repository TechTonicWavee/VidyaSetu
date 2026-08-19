'use client';

import type { ReactNode } from 'react';
import { DeanProvider } from './_context/DeanContext';
import AppShell from '@/components/ui/AppShell';
import { DEAN_NAV } from '@/lib/nav/dean';

export default function DeanLayout({ children }: { children: ReactNode }) {
  return (
    <DeanProvider>
      <AppShell navGroups={[{ items: DEAN_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </DeanProvider>
  );
}
