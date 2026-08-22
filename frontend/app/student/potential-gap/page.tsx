'use client';

import { Lightbulb } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function PotentialGapPage() {
  return (
    <ComingSoon
      title="Potential Gap"
      pageDescription="The distance between where you are and where you could be."
      icon={<Lightbulb size={22} />}
    />
  );
}
