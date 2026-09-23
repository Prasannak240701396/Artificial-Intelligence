import React, { useState, useEffect } from 'react';
import { ReactEChart } from './ReactEChart';
import { EChartsOption } from 'echarts';
import { mockTickService, MarketTick } from '../services/mockTickService';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';

interface MarketChartProps {
  selectedSymbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

export const MarketChart: React.FC<MarketChartProps> = ({
  selectedSymbol = 'NIFTY 50',
  onSymbolChange,
}) => {
  const [activeSymbol, setActiveSymbol] = useState<string>(selectedSymbol);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [tickData, setTickData] = useState<Record<string, MarketTick>>({});

  const symbols = [
    'NIFTY 50', 'S&P 500', 'BANK NIFTY', 'NASDAQ', 'DOW JONES',
    'SENSEX', 'FTSE 100', 'NIKKEI 225', 'GOLD RESERVE', 'CRUDE OIL'
  ];

  useEffect(() => {
    setActiveSymbol(selectedSymbol);
  }, [selectedSymbol]);

  useEffect(() => {
    const unsubscribe = mockTickService.subscribeTicks((ticks) => {
      setTickData(ticks);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectSymbol = (sym: string) => {
    setActiveSymbol(sym);
    if (onSymbolChange) onSymbolChange(sym);
  };

  const currentTick = tickData[activeSymbol] || {
    symbol: activeSymbol,
    name: activeSymbol,
    price: 24580.45,
    change: 142.30,
    changePct: 0.58,
    high: 24650.00,
    low: 24410.20,
    prevClose: 24438.15,
    currency: activeSymbol.includes('NIFTY') ? '₹' : '$',
    lastUpdated: '18:30:00',
    history: [],
  };

  const isPositive = currentTick.change >= 0;

  // Multipliers for time range simulation
  const multiplierMap = {
    '1D': 1,
    '1W': 1.02,
    '1M': 1.05,
    '1Y': 1.15,
  };

  const currentMultiplier = multiplierMap[timeRange];

  // EChart Option configuration
  const chartOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'line', lineStyle: { color: '#3b82f6', width: 1, type: 'dashed' } },
      backgroundColor: '#111622',
      borderColor: '#232d42',
      textStyle: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="font-mono text-xs">
          <div class="text-slate-400 border-b border-[#232d42] pb-1 mb-1">${item.name}</div>
          <div class="font-bold text-white">${currentTick.currency}${item.value.toLocaleString()}</div>
        </div>`;
      },
    },
    grid: { top: 25, right: 15, bottom: 25, left: 65 },
    xAxis: {
      type: 'category',
      data: currentTick.history.map((h) => h.time),
      axisLine: { lineStyle: { color: '#232d42' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: {
        color: '#64748b',
        fontSize: 10,
        fontFamily: 'monospace',
        formatter: (val: number) => `${currentTick.currency}${(val * currentMultiplier).toLocaleString()}`,
      },
    },
    series: [
      {
        name: activeSymbol,
        type: 'line',
        smooth: true,
        data: currentTick.history.map((h) => Number((h.value * currentMultiplier).toFixed(2))),
        lineStyle: { width: 2.5, color: isPositive ? '#10b981' : '#ef4444' },
        showSymbol: false,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: isPositive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)' },
              { offset: 1, color: isPositive ? 'rgba(16, 185, 129, 0.0)' : 'rgba(239, 68, 68, 0.0)' },
            ],
          },
        },
      },
    ],
  };

  return (
    <div className="finos-card bg-[#111622] border border-[#232d42] rounded-md p-4 space-y-4">
      {/* Header: Instrument Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232d42]">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-xs uppercase tracking-wider font-mono text-white">
            Market / Financial Chart Terminal
          </span>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20 font-mono flex items-center">
            <span className="status-dot-live mr-1.5" /> SIMULATED LIVE TICKS
          </span>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42] font-mono text-xs">
          {(['1D', '1W', '1M', '1Y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Selectable Instrument Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 font-mono">
        {symbols.map((sym) => {
          const tick = tickData[sym] || { price: 0, changePct: 0 };
          const isSel = sym === activeSymbol;
          const pos = tick.changePct >= 0;

          return (
            <button
              key={sym}
              onClick={() => handleSelectSymbol(sym)}
              className={`p-2 rounded text-left transition-all border ${
                isSel
                  ? 'bg-[#182338] border-blue-500 shadow-lg shadow-blue-500/10'
                  : 'bg-[#151c2c] border-[#232d42] hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-200 truncate">{sym}</span>
                <span className={pos ? 'text-emerald-400 text-[10px]' : 'text-red-400 text-[10px]'}>
                  {pos ? '+' : ''}{tick.changePct}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Market Price & Summary Telemetry */}
      <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[10px] uppercase block">{activeSymbol} Current Price</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-white">
              {currentTick.currency}{currentTick.price.toLocaleString()}
            </span>
            <span
              className={`font-semibold flex items-center text-xs ${
                isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPositive ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
              {isPositive ? '+' : ''}{currentTick.change} ({isPositive ? '+' : ''}{currentTick.changePct}%)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-[11px] text-slate-400">
          <div>
            <span className="text-slate-500 block text-[9px]">PREV CLOSE</span>
            <span className="text-slate-200 font-semibold">{currentTick.currency}{currentTick.prevClose.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">INTRADAY HIGH</span>
            <span className="text-emerald-400 font-semibold">{currentTick.currency}{currentTick.high.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">INTRADAY LOW</span>
            <span className="text-red-400 font-semibold">{currentTick.currency}{currentTick.low.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">LAST UPDATED</span>
            <span className="text-cyan-400 font-semibold flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {currentTick.lastUpdated}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive EChart Container */}
      <div className="w-full min-h-[300px]">
        <ReactEChart option={chartOption} height="300px" />
      </div>
    </div>
  );
};
