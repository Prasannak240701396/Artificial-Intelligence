import React, { useState, useEffect } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { MarketChart } from '../components/MarketChart';
import { mockTickService, LiveFinancialEvent } from '../services/mockTickService';
import {
  Wallet, DollarSign, PieChart, ShieldAlert, ArrowUpRight,
  TrendingUp, AlertTriangle, Activity, Calendar, ArrowRight,
  CheckCircle2, Clock, Layers, BarChart2
} from 'lucide-react';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { useNavigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState<string>('NIFTY 50');
  const [liveEvents, setLiveEvents] = useState<LiveFinancialEvent[]>([]);

  useEffect(() => {
    const unsubEvents = mockTickService.subscribeEvents((evt) => {
      setLiveEvents((prev) => [evt, ...prev.slice(0, 7)]);
    });
    return () => unsubEvents();
  }, []);

  // 1. Department Expenditure Stacked Bar Option
  const deptChartOption: EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 25, right: 15, bottom: 25, left: 100 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace', formatter: (v: number) => `₹${v}L` },
    },
    yAxis: {
      type: 'category',
      data: ['Public Works', 'Health', 'Education', 'Transport', 'Energy', 'IT'],
      axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      { name: 'Spent (₹L)', type: 'bar', stack: 'total', data: [235.5, 298.0, 142.0, 261.0, 125.0, 98.0], itemStyle: { color: '#3b82f6' } },
      { name: 'Remaining Pool (₹L)', type: 'bar', stack: 'total', data: [14.5, 52.0, 58.0, 39.0, 55.0, 22.0], itemStyle: { color: '#1e293b' } },
    ],
  };

  // 2. Cash Flow Trend Area EChart Option
  const cashFlowMiniOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 15, bottom: 25, left: 45 },
    xAxis: {
      type: 'category',
      data: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace', formatter: (v: number) => `₹${v}Cr` },
    },
    series: [
      {
        name: 'Net Surplus (₹Cr)',
        type: 'line',
        smooth: true,
        data: [1.24, 1.42, 1.38, 1.56, 1.71, 1.85],
        lineStyle: { width: 2.5, color: '#10b981' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 185, 129, 0.35)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
            ],
          },
        },
      },
    ],
  };

  // 3. Risk Exposure Gauge / Pie Breakdown
  const riskPieOption: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#111622', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 18.4, name: 'Liquidity Exposure', itemStyle: { color: '#3b82f6' } },
          { value: 34.2, name: 'Vendor Payment Risk', itemStyle: { color: '#f59e0b' } },
          { value: 42.0, name: 'Budget Overrun Risk', itemStyle: { color: '#ef4444' } },
          { value: 5.4, name: 'System Security Baseline', itemStyle: { color: '#10b981' } },
        ],
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Page Title & Status Banner */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" /> Executive Financial Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Agentic municipal treasury monitoring, live market ticks & risk exposure
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-[#151c2c] px-3 py-1.5 rounded border border-[#232d42] text-right">
            <span className="text-[10px] text-slate-500 block">SYSTEM HEALTH</span>
            <span className="font-bold text-emerald-400 flex items-center">
              <span className="status-dot-live mr-1.5" /> 99.8% SOLVENT
            </span>
          </div>
        </div>
      </div>

      {/* 1. FINANCIAL SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Assets"
          value="₹12.48 Cr"
          icon={Wallet}
          change={4.8}
          changeLabel="from last month"
          onClick={() => navigate('/financial-overview')}
        />
        <FinancialCard
          title="Available Balance"
          value="₹8.72 Cr"
          icon={DollarSign}
          change={2.1}
          changeLabel="from last month"
          onClick={() => navigate('/financial-overview')}
        />
        <FinancialCard
          title="Total Expenditure"
          value="₹3.42 Cr"
          icon={PieChart}
          change={-1.5}
          changeLabel="under ceiling"
          onClick={() => navigate('/budgets')}
        />
        <FinancialCard
          title="Risk Exposure"
          value="18.4 / 100"
          icon={ShieldAlert}
          change={-0.8}
          changeLabel="LOW RISK"
          onClick={() => navigate('/risk-analytics')}
        />
      </div>

      {/* 2. MARKET / FINANCIAL CHART SECTION */}
      <div>
        <MarketChart
          selectedSymbol={selectedSymbol}
          onSymbolChange={(sym) => setSelectedSymbol(sym)}
        />
      </div>

      {/* 3. CONTINUOUS GRAPHS GRID (Expenditure Bar Chart, Cash Flow Area Chart, Risk Pie Chart) */}
      <div className="grid grid-cols-12 gap-4">
        {/* Department Expenditure Stacked Bar (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-4 w-4 text-blue-400" />
              <span className="font-bold text-slate-200 uppercase">Department Expenditure vs Ceiling</span>
            </div>
            <span className="text-[10px] text-slate-400">FY 2026</span>
          </div>
          <ReactEChart option={deptChartOption} height="260px" />
        </div>

        {/* Cash Flow Trend Area Chart (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="font-bold text-slate-200 uppercase">Cash Flow Net Surplus Trend (₹Cr)</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              SURPLUS GROWING
            </span>
          </div>
          <ReactEChart option={cashFlowMiniOption} height="260px" />
        </div>
      </div>

      {/* 4. THIRD GRAPH ROW: Risk Exposure Distribution Pie Chart & Upcoming Obligations */}
      <div className="grid grid-cols-12 gap-4">
        {/* Risk Exposure Donut Chart (5 cols) */}
        <div className="col-span-12 lg:col-span-5 finos-card">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span className="font-bold text-slate-200 uppercase">System Risk Factor Distribution</span>
            </div>
          </div>
          <ReactEChart option={riskPieOption} height="220px" />
        </div>

        {/* Upcoming Scheduled Obligations Table (7 cols) */}
        <div className="col-span-12 lg:col-span-7 finos-card">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <span className="font-bold text-slate-200 uppercase">Upcoming Scheduled Obligations</span>
            </div>
            <button
              onClick={() => navigate('/payments')}
              className="text-[10px] text-blue-400 hover:underline flex items-center"
            >
              View Queue <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center">
              <div>
                <span className="font-bold text-white text-xs block">Apex Infrastructure Corp</span>
                <span className="text-[10px] text-slate-400">Public Works • Bridge Maintenance</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-xs block">₹45.00 L</span>
                <span className="text-[9px] text-amber-400 font-semibold">Due in 2 days</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center">
              <div>
                <span className="font-bold text-white text-xs block">BioHealth MedTech Ltd</span>
                <span className="text-[10px] text-slate-400">Health Dept • Medical Equipment</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-xs block">₹1.25 Cr</span>
                <span className="text-[9px] text-slate-400">Due in 5 days</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center">
              <div>
                <span className="font-bold text-white text-xs block">CloudScale Networks Inc</span>
                <span className="text-[10px] text-slate-400">IT & Infrastructure • Cloud Hosting</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-white text-xs block">₹8.80 L</span>
                <span className="text-[9px] text-slate-400">Due in 8 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Financial Ticks & Autonomous Stream */}
      <div className="finos-card">
        <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="font-bold text-slate-200 uppercase">Live Simulated Financial Ticks & Agent Stream</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Auto-syncing every 2.5s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {liveEvents.slice(0, 4).map((evt) => (
            <div key={evt.id} className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] text-[11px] space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-cyan-400">{evt.title}</span>
                <span className="text-slate-500">{evt.timestamp}</span>
              </div>
              <p className="text-slate-300 text-[10px] leading-tight">{evt.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
