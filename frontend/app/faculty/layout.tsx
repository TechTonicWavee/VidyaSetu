'use client';

import type { ReactNode } from 'react';
import AppShell from '@/components/shared/ui/AppShell';
import { FACULTY_NAV } from '@/lib/faculty/nav';
import { Home, BookOpen, Brain, AlertCircle, Activity, Users, CheckCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

import { AuthProvider } from '@/lib/shared/auth/AuthProvider';

export default function FacultyLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider demoMode={true}>
      <AppShell navGroups={[{ items: FACULTY_NAV }]} showSidebar={true}>
        {children}
      </AppShell>
    </AuthProvider>
  );
}

