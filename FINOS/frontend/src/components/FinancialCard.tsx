import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface FinancialCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  trend?: 'UP' | 'DOWN' | 'STABLE';
  currencySymbol?: string;
  onClick?: () => void;
  className?: string;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  changeLabel = 'from last month',
  subtitle,
  trend,
  currencySymbol = '',
  onClick,
  className = '',
}) => {
  const isPositive = change !== undefined ? change >= 0 : trend === 'UP';

  // Format financial value if numeric
  const displayValue = typeof value === 'number'
    ? `${currencySymbol}${value.toLocaleString()}`
    : value;

  return (
    <div
      onClick={onClick}
      className={`finos-card bg-[#111622] border border-[#232d42] rounded-md p-3.5 transition-all duration-200 hover:border-blue-500/40 min-w-0 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:bg-[#151c2c]' : ''
      } ${className}`}
    >
      {/* Header: Title + Icon */}
      <div className="flex items-center justify-between gap-2 mb-2 min-w-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono truncate min-w-0">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex-shrink-0">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main Value Display */}
      <div className="my-1 min-w-0">
        <div
          className="text-base sm:text-lg lg:text-xl font-bold font-mono text-white tracking-tight truncate max-w-full block leading-tight"
          title={String(displayValue)}
        >
          {displayValue}
        </div>
      </div>

      {/* Footer: Trend Change / Subtitle */}
      <div className="mt-2 pt-2 border-t border-[#1c2638] flex items-center justify-between min-w-0 text-[10px] font-mono">
        {change !== undefined ? (
          <span
            className={`font-semibold flex items-center gap-1 truncate ${
              isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3 flex-shrink-0" /> : <TrendingDown className="h-3 w-3 flex-shrink-0" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
            {changeLabel && <span className="text-slate-500 font-normal truncate">({changeLabel})</span>}
          </span>
        ) : subtitle ? (
          <span className="text-slate-400 truncate">{subtitle}</span>
        ) : (
          <span className="text-slate-500 truncate">Stable Allocation</span>
        )}
      </div>
    </div>
  );
};
