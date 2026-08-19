'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { FACULTY_NAV } from '@/lib/nav/faculty';
import { Home, BookOpen, Brain, AlertCircle, Activity, Users, CheckCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

export default function FacultyLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell navGroups={[{ items: FACULTY_NAV }]} showSidebar={true}>
      {children}
    </AppShell>
  );
}

