'use client';

import { CalendarCheck } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function AttendancePage() {
  return (
    <ComingSoon
      title="Attendance"
      pageDescription="Overall and subject-wise attendance with monthly trends."
      icon={<CalendarCheck size={22} />}
    />
  );
}
