'use client';

import { useTheme } from '@/components/ThemeProvider';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';


export function SpiProgressionChart({ data }: { data?: any[] }) {
  const { theme } = useTheme();
  
  // Theme-aware colors
  const strokeColor = theme === 'dark' ? '#5a9bd8' : '#3b6cb9';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const textColor = theme === 'dark' ? '#8a93a6' : '#6b7280';
  const tooltipBg = theme === 'dark' ? '#121a2e' : '#ffffff';
  const tooltipBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const chartData = (data || []).map(d => {
    let month = '';
    if (d.date) {
      const dt = new Date(d.date);
      if (!isNaN(dt.getTime())) {
        month = dt.toLocaleDateString(undefined, { month: 'short' });
      } else {
        month = String(d.date);
      }
    }
    return { month, spi: d.spi };
  });

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSpi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }}
            domain={[40, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: '12px',
              border: `1px solid ${tooltipBorder}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              color: theme === 'dark' ? '#e6eaf2' : '#0d1b2a',
              fontWeight: 600
            }}
            itemStyle={{ color: strokeColor }}
          />
          <Area
            type="monotone"
            dataKey="spi"
            stroke={strokeColor}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSpi)"
            activeDot={{ r: 6, strokeWidth: 0, fill: strokeColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
