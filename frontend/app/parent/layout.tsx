'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/shared/ui/AppShell';
import { PARENT_NAV } from '@/lib/shared/nav/parent';

import { AuthProvider } from '@/lib/shared/auth/AuthProvider';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell navGroups={[{ items: PARENT_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
