'use client';

import type { ReactNode } from 'react';
import { DeanProvider } from './_context/DeanContext';
import AppShell from '@/components/ui/AppShell';
import { DEAN_NAV } from '@/lib/nav/dean';

import { AuthProvider } from '@/lib/auth/AuthProvider';

export default function DeanLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DeanProvider>
        <AppShell navGroups={[{ items: DEAN_NAV }]} showSidebar={true}>
          {children}
        </AppShell>
      </DeanProvider>
    </AuthProvider>
  );
}
