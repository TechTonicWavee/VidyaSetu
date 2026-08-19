'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { ADMIN_NAV } from '@/lib/nav/admin';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell navGroups={[{ items: ADMIN_NAV }]} showSidebar={true}>
      {children}
    </AppShell>
  );
}
