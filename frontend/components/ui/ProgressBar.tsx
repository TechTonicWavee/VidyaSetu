'use client';

import { cn } from '@/lib/utils/cn';

type Tone = 'brand' | 'green' | 'red' | 'amber' | 'blue' | 'gray';

const FILL: Record<Tone, string> = {
  brand: 'bg-brand',
  green: 'bg-success',
  red: 'bg-danger',
  amber: 'bg-warning',
  blue: 'bg-info',
  gray: 'bg-line-strong',
};

export function ProgressBar({
  value,
  tone = 'brand',
  className,
  showLabel = false,
  height = 8,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  showLabel?: boolean;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 rounded-full bg-surface-3 overflow-hidden" style={{ height }}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', FILL[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-semibold text-content-2 tabular-nums w-9 text-right">{Math.round(clamped)}%</span>}
    </div>
  );
}

export default ProgressBar;
