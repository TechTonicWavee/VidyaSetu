'use client';

import { cn } from '@/lib/utils/cn';

/**
 * SVG circular progress ring. `value` is 0–100.
 * `color` accepts any CSS color; defaults to the brand token.
 */
export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = 'var(--brand)',
  trackColor = 'var(--surface-3)',
  label,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label !== undefined ? (
          <span className="text-2xl font-bold text-content tabular-nums">{label}</span>
        ) : (
          <span className="text-2xl font-bold text-content tabular-nums">{Math.round(clamped)}</span>
        )}
        {sublabel && <span className="text-[11px] text-muted mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

export default ProgressRing;
