'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { PARENT_NAV } from '@/lib/nav/parent';

import { AuthProvider } from '@/lib/auth/AuthProvider';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell navGroups={[{ items: PARENT_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
