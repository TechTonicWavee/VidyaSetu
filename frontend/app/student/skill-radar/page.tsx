'use client';

import { Activity } from 'lucide-react';
import { ComingSoon } from '@/components/shared/ui';

export default function SkillRadarPage() {
  return (
    <ComingSoon
      title="Skill Radar"
      pageDescription="A multi-dimensional view of your strengths and growth areas."
      icon={<Activity size={22} />}
    />
  );
}
