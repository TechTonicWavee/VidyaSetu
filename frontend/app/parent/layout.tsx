'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { PARENT_NAV } from '@/lib/nav/parent';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell navGroups={[{ items: PARENT_NAV }]} showSidebar={true}>
      {children}
    </AppShell>
  );
}
