'use client';

import { ListChecks } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function ActionPlanPage() {
  return (
    <ComingSoon
      title="Action Plan"
      pageDescription="Your personalised weekly plan to move the needle on your SPI."
      icon={<ListChecks size={22} />}
    />
  );
}
