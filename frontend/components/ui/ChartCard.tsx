'use client';

import type { ReactNode } from 'react';
import { Card } from './Card';

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  height = 300,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  height?: number;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-content">{title}</h3>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ width: '100%', height }}>{children}</div>
    </Card>
  );
}

export default ChartCard;
