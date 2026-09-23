import React from 'react';
import { MarketAsset } from '../types';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface GlobalPulseProps {
  assets: MarketAsset[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  lastUpdated?: string;
}

export const GlobalPulse: React.FC<GlobalPulseProps> = ({
  assets,
  selectedSymbol,
  onSelectSymbol,
  lastUpdated,
}) => {
  return (
    <div className="bg-[#0d121d] border-b border-[#232d42] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase font-mono flex items-center">
            <span className="h-2 w-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
            Global Financial Pulse
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Real-Time Market Data Matrix</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
          <RefreshCw className="h-3 w-3 text-cyan-400 animate-spin" />
          <span>Last Tick: {lastUpdated || '18:14:57'}</span>
        </div>
      </div>

      {/* Horizontal Matrix Carousel / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {assets.map((item) => {
          const isSelected = item.symbol === selectedSymbol;
          const isPositive = item.change_pct >= 0;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`p-2 rounded text-left transition-all border ${
                isSelected
                  ? 'bg-[#182338] border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-[#111622] border-[#232d42] hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-mono font-bold text-[11px] text-slate-200 truncate">{item.symbol}</span>
                <span
                  className={`text-[10px] font-mono font-semibold flex items-center ${
                    isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5 inline" /> : <TrendingDown className="h-3 w-3 mr-0.5 inline" />}
                  {isPositive ? '+' : ''}{item.change_pct.toFixed(2)}%
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-sm font-bold text-white tracking-tight">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: item.asset_type === 'FOREX' ? 4 : 2 })}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">H:{item.high_24h}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
