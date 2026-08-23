'use client';

import { useMemo, useState } from 'react';
import { useTheme } from '@/components/shared/ThemeProvider';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface SpiHistoryPoint {
  date: string;
  spi: number;
}

interface SpiProgressionChartProps {
  history: SpiHistoryPoint[];
  /** Current SPI score, used to fill in a sensible point when history is empty or has just one entry. */
  currentSpi?: number | null;
  /** Show 1M/3M/6M/1Y/ALL range buttons above the chart (stock-chart style). */
  showRangeFilter?: boolean;
  height?: number;
}

type Range = '1M' | '3M' | '6M' | '1Y' | 'ALL';
const RANGES: { id: Range; label: string; days: number | null }[] = [
  { id: '1M', label: '1M', days: 30 },
  { id: '3M', label: '3M', days: 90 },
  { id: '6M', label: '6M', days: 182 },
  { id: '1Y', label: '1Y', days: 365 },
  { id: 'ALL', label: 'All', days: null },
];

export function SpiProgressionChart({ history, currentSpi, showRangeFilter = false, height }: SpiProgressionChartProps) {
  const { theme } = useTheme();
  const [range, setRange] = useState<Range>(showRangeFilter ? '6M' : 'ALL');

  const strokeColor = theme === 'dark' ? '#5a9bd8' : '#3b6cb9';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#8a93a6' : '#6b7280';
  const tooltipBg = theme === 'dark' ? '#121a2e' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // Real history first; when there's too little of it to draw a line, anchor
  // a flat one to the current score instead of blocking on an empty state —
  // a graph with one visible value beats no graph at all.
  const sorted = useMemo(() => {
    const points = [...history]
      .filter((h) => h?.date && typeof h.spi === 'number')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (points.length >= 2) return points;

    const now = new Date().toISOString();
    if (points.length === 1) {
      return points[0].date === now ? points : [points[0], { date: now, spi: points[0].spi }];
    }
    if (typeof currentSpi === 'number') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      return [{ date: monthAgo, spi: currentSpi }, { date: now, spi: currentSpi }];
    }
    return points;
  }, [history, currentSpi]);

  const filtered = useMemo(() => {
    const days = RANGES.find((r) => r.id === range)?.days ?? null;
    if (days == null) return sorted;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const inRange = sorted.filter((h) => new Date(h.date).getTime() >= cutoff);
    // A narrow range can filter a 2-point flat/anchor line down to nothing —
    // fall back to the full (still small) series rather than going blank.
    return inRange.length >= 2 ? inRange : sorted;
  }, [sorted, range]);

  const chartData = useMemo(
    () =>
      filtered.map((h) => ({
        label: new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        fullDate: new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }),
        spi: Number(h.spi.toFixed(1)),
      })),
    [filtered],
  );

  if (sorted.length < 2) {
    return (
      <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center text-center gap-1">
        <p className="text-sm font-semibold text-content">Not enough history yet</p>
        <p className="text-xs text-muted max-w-xs">Your SPI journey will populate here as your score is recalculated over time.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[160px] flex flex-col">
      {showRangeFilter && (
        <div className="flex items-center gap-1 mb-3 self-end">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                range === r.id ? 'bg-brand text-brand-fg' : 'text-muted hover:bg-surface-2'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
        <div className="flex-1" style={height ? { height } : undefined}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
                dy={10}
                minTickGap={24}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: textColor, fontSize: 12 }}
                domain={[
                  (dataMin: number) => Math.max(0, Math.floor(dataMin - 5)),
                  (dataMax: number) => Math.min(100, Math.ceil(dataMax + 5)),
                ]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: '12px',
                  border: `1px solid ${tooltipBorder}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  color: theme === 'dark' ? '#e6eaf2' : '#0d1b2a',
                  fontWeight: 600,
                }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate ?? ''}
                itemStyle={{ color: strokeColor }}
              />
              <Area
                type="monotone"
                dataKey="spi"
                name="SPI"
                stroke={strokeColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSpi)"
                activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}
