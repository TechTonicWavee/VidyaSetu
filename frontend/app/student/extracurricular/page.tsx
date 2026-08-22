'use client';

import { Trophy } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function ExtracurricularPage() {
  return (
    <ComingSoon
      title="Extracurriculars"
      pageDescription="Clubs, sports, leadership and community involvement."
      icon={<Trophy size={22} />}
    />
  );
}
