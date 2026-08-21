'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { ADMIN_NAV } from '@/lib/nav/admin';

import { AuthProvider } from '@/lib/auth/AuthProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell navGroups={[{ items: ADMIN_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
