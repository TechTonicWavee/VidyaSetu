'use client';

import { PageHeader } from './PageHeader';
import { EmptyState } from '../EmptyState';

// Full-page placeholder for a feature that isn't backed by real data yet.
// Used instead of ever showing fabricated numbers as if they were real —
// see refactor/FINDINGS.md and ARCHITECTURE.md for which pages this applies to
// and why.
export function ComingSoon({
  title,
  pageDescription,
  icon,
  message = "We're building this out with real data. Check back soon.",
}: {
  title: string;
  pageDescription: string;
  icon: React.ReactNode;
  message?: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={pageDescription} icon={icon} />
      <EmptyState iconName="Rocket" title="Coming soon" description={message} />
    </div>
  );
}

export default ComingSoon;
