'use client';

import { BookOpen } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function AssignmentsPage() {
  return (
    <ComingSoon
      title="Assignments"
      pageDescription="Track submissions, deadlines and grades across subjects."
      icon={<BookOpen size={22} />}
    />
  );
}
