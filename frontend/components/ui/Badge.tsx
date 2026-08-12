'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'gray' | 'purple' | 'yellow';

const TONES: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  green: 'bg-success-soft text-success',
  red: 'bg-danger-soft text-danger',
  amber: 'bg-warning-soft text-warning',
  blue: 'bg-info-soft text-info',
  gray: 'bg-surface-3 text-muted',
  purple: 'bg-purple/10 text-purple',
  yellow: 'bg-amber/10 text-amber',
};

export function Badge({
  tone = 'gray',
  children,
  className,
  icon,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11.5px] font-semibold',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export default Badge;
