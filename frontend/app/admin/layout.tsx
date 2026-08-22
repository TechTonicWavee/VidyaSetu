'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/shared/ui/AppShell';
import { ADMIN_NAV } from '@/lib/admin/nav';

import { AuthProvider } from '@/lib/shared/auth/AuthProvider';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider demoMode={true}>
      <AppShell navGroups={[{ items: ADMIN_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
