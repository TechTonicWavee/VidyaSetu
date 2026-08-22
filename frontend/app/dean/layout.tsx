'use client';

import type { ReactNode } from 'react';
import { DeanProvider } from './_context/DeanContext';
import AppShell from '@/components/shared/ui/AppShell';
import { DEAN_NAV } from '@/lib/dean/nav';

import { AuthProvider } from '@/lib/shared/auth/AuthProvider';

export default function DeanLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider demoMode={true}>
      <DeanProvider>
        <AppShell navGroups={[{ items: DEAN_NAV }]} showSidebar={true}>
          {children}
        </AppShell>
      </DeanProvider>
    </AuthProvider>
  );
}
