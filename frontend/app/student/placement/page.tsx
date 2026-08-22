'use client';

import { Target } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function PlacementPage() {
  return (
    <ComingSoon
      title="Placement Readiness"
      pageDescription="Company tiers, skill gaps and a 6-month prep roadmap."
      icon={<Target size={22} />}
    />
  );
}
