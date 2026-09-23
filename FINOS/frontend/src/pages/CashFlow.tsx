import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { DollarSign, ArrowUpRight, ArrowDownRight, Layers, AlertCircle, CheckCircle2, ShieldAlert, Calendar, X } from 'lucide-react';

export const CashFlow: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('6M');
  const [selectedPeriod, setSelectedPeriod] = useState<any | null>(null);

  // Time range multiplier for chart series
  const filterMultipliers: Record<string, number> = {
    '7D': 0.25,
    '30D': 0.5,
    '3M': 0.75,
    '6M': 1.0,
    '1Y': 1.8,
  };

  const m = filterMultipliers[timeFilter];

  const cashFlowOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#111622',
      borderColor: '#232d42',
      textStyle: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' },
    },
    legend: {
      data: ['Inflow (₹Cr)', 'Outflow (₹Cr)', 'Net Liquidity (₹Cr)'],
      textStyle: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    grid: { top: 30, right: 20, bottom: 25, left: 50 },
    xAxis: {
      type: 'category',
      data: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (F)', 'Nov (F)'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Inflow (₹Cr)',
        type: 'bar',
        data: [4.2, 4.5, 4.1, 4.8, 5.2, 4.9, 5.5, 5.8].map((v) => Number((v * m).toFixed(2))),
        itemStyle: { color: '#10b981' },
      },
      {
        name: 'Outflow (₹Cr)',
        type: 'bar',
        data: [3.8, 3.9, 4.2, 4.0, 4.4, 4.6, 4.8, 5.0].map((v) => Number((v * m).toFixed(2))),
        itemStyle: { color: '#ef4444' },
      },
      {
        name: 'Net Liquidity (₹Cr)',
        type: 'line',
        smooth: true,
        data: [11.0, 11.5, 11.4, 12.3, 13.0, 13.4, 14.1, 14.8].map((v) => Number((v * m).toFixed(2))),
        lineStyle: { width: 2.5, color: '#06b6d4' },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header & Time Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" /> Cash Flow Analytics & Projected Liquidity
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical cash inflow vs outflow tracking with 3-month forecast model
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
          {(['7D', '30D', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-3 py-1 rounded font-bold transition-colors ${
                timeFilter === tf
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {tf === '7D' ? '7 Days' : tf === '30D' ? '30 Days' : tf === '3M' ? '3 Months' : tf === '6M' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Monthly Cash Inflow"
          value={`₹${(4.9 * m).toFixed(2)} Cr`}
          icon={ArrowUpRight}
          change={6.4}
          changeLabel="Surplus"
          subtitle="Tax collections & State grants"
        />
        <FinancialCard
          title="Monthly Cash Outflow"
          value={`₹${(4.6 * m).toFixed(2)} Cr`}
          icon={ArrowDownRight}
          change={-1.2}
          changeLabel="Under Control"
          subtitle="Vendor payouts & Operational exp"
        />
        <FinancialCard
          title="Net Cash Flow"
          value={`+₹${((4.9 - 4.6) * m).toFixed(2)} Cr`}
          icon={DollarSign}
          change={8.8}
          changeLabel="Net Addition"
          subtitle="Positive monthly reserve growth"
        />
        <FinancialCard
          title="Available Liquidity"
          value={`₹${(13.4 * m).toFixed(2)} Cr`}
          icon={Layers}
          change={4.5}
          changeLabel="LCR 2.45x"
          subtitle="Unencumbered cash pool"
        />
      </div>

      {/* Main Cash Flow Chart + Status Explanation Panel */}
      <div className="grid grid-cols-12 gap-4">
        {/* Main 12-Month Inflow/Outflow/Net Trend (8 cols) */}
        <div className="col-span-12 lg:col-span-8 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Inflow, Outflow & Projected Net Liquidity Trend</span>
            <span className="text-[10px] text-cyan-400">Filter: {timeFilter} Horizon</span>
          </div>
          <ReactEChart option={cashFlowOption} height="320px" />
        </div>

        {/* Cash Flow Status Explanation Panel (4 cols) */}
        <div className="col-span-12 lg:col-span-4 finos-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Cash Flow Status</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded font-bold">
              HEALTHY
            </span>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 space-y-1">
            <span className="font-bold text-xs flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" /> Optimal Liquidity Position
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-200">
              Net cash inflows exceed scheduled vendor disbursements by +₹0.30 Cr per month. Zero cash shortage projected over the next 90 days.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-300 text-xs block">Key Financial Indicators</span>
            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between">
              <span className="text-slate-400">Days Cash on Hand</span>
              <span className="font-bold text-white">88 Days (Min Target: 60)</span>
            </div>
            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between">
              <span className="text-slate-400">Expected Receipts (Next 30D)</span>
              <span className="font-bold text-emerald-400">+₹5.20 Cr</span>
            </div>
            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between">
              <span className="text-slate-400">Upcoming Payments (Next 30D)</span>
              <span className="font-bold text-amber-400">₹4.80 Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
