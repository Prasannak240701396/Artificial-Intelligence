import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  sparkline?: number[];
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  prefix = '$',
  suffix = '',
  trend = 'UP',
  sparkline = [10, 15, 13, 18, 22],
  subtitle,
}) => {
  const isPositive = change !== undefined ? change >= 0 : trend === 'UP';

  // SVG Sparkline path generation
  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline);
  const range = max - min || 1;
  const points = sparkline
    .map((val, idx) => {
      const x = (idx / (sparkline.length - 1)) * 80;
      const y = 24 - ((val - min) / range) * 20;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="finos-card-compact bg-[#111622] border border-[#232d42] rounded-md p-3 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider font-mono">{title}</span>
        {change !== undefined && (
          <span
            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded flex items-center ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3 mr-1 inline" /> : <TrendingDown className="h-3 w-3 mr-1 inline" />}
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div>
          <span className="text-lg font-bold font-mono text-white tracking-tight">
            {typeof value === 'number' ? `${prefix}${value.toLocaleString()}${suffix}` : value}
          </span>
          {subtitle && <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{subtitle}</span>}
        </div>

        {/* Mini Sparkline SVG */}
        <div className="w-20 h-6">
          <svg className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
