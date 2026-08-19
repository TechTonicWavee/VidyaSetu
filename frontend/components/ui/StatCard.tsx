'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Tone = 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'info' | 'success' | 'warning' | 'danger';

const ICON_TONES: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  green: 'bg-success-soft text-success',
  success: 'bg-success-soft text-success',
  red: 'bg-danger-soft text-danger',
  danger: 'bg-danger-soft text-danger',
  amber: 'bg-warning-soft text-warning',
  warning: 'bg-warning-soft text-warning',
  blue: 'bg-info-soft text-info',
  info: 'bg-info-soft text-info',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'brand',
  delta,
  deltaDir,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: Tone;
  delta?: string;
  deltaDir?: 'up' | 'down';
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-line p-5', className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted">{label}</p>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', ICON_TONES[tone])}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-2xl font-bold tracking-tight text-content tabular-nums">{value}</span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-xs font-semibold mb-1',
              deltaDir === 'down' ? 'text-danger' : 'text-success',
            )}
          >
            {deltaDir === 'down' ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-muted mt-1">{hint}</p>}
    </div>
  );
}

export default StatCard;
