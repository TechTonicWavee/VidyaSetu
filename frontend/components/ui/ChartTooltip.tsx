'use client';

interface TooltipEntry {
  color?: string;
  name?: string | number;
  value?: string | number;
}
interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

/** Theme-aware Recharts tooltip that uses surface tokens (works in dark mode). */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-line bg-surface shadow-card-hover px-3 py-2 text-xs">
      {label !== undefined && <p className="font-semibold text-content mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-content-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color || 'var(--brand)' }} />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold text-content tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default ChartTooltip;

// Common token-driven chart colors.
export const CHART = {
  brand: 'var(--brand)',
  blue: '#3b82f6',
  teal: '#14b8a6',
  amber: '#f59e0b',
  green: '#22c55e',
  purple: '#8b5cf6',
  red: '#ef4444',
  grid: 'var(--line)',
  axis: 'var(--muted)',
};
