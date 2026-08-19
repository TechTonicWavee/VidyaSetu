'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/ui/AppShell';
import { FACULTY_NAV } from '@/lib/nav/faculty';
import { Home, BookOpen, Brain, AlertCircle, Activity, Users, CheckCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

import { AuthProvider } from '@/lib/auth/AuthProvider';

export default function FacultyLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppShell navGroups={[{ items: FACULTY_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}

