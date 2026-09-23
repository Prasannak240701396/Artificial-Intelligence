import React, { useState, useEffect } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { PieChart, DollarSign, Wallet, ShieldCheck, Activity, ArrowRight, X, Clock, Layers, BarChart2, TrendingUp } from 'lucide-react';
import { mockTickService, LiveFinancialEvent } from '../services/mockTickService';

export const FinancialOverview: React.FC = () => {
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveFinancialEvent[]>([]);

  useEffect(() => {
    const unsub = mockTickService.subscribeEvents((evt) => {
      setLiveEvents((prev) => [evt, ...prev.slice(0, 5)]);
    });
    return () => unsub();
  }, []);

  // 1. Asset Allocation Donut Chart Option
  const assetAllocationOption: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: ₹{c} Cr ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center', textStyle: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' } },
    series: [
      {
        name: 'Asset Allocation',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#111622', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 5.24, name: 'Sovereign Treasuries', itemStyle: { color: '#3b82f6' } },
          { value: 3.41, name: 'Municipal Escrow Reserves', itemStyle: { color: '#06b6d4' } },
          { value: 2.25, name: 'Money Market Liquid Funds', itemStyle: { color: '#10b981' } },
          { value: 1.58, name: 'Bullion ETF Reserves', itemStyle: { color: '#f59e0b' } },
        ],
      },
    ],
  };

  // 2. Income vs Expenditure Stacked Bar Option
  const incomeVsExpOption: EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 25, right: 15, bottom: 25, left: 45 },
    xAxis: {
      type: 'category',
      data: ['Q1', 'Q2', 'Q3', 'Q4 (F)'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      { name: 'Revenue Inflow (₹Cr)', type: 'bar', data: [3.8, 4.2, 4.5, 4.9], itemStyle: { color: '#10b981' } },
      { name: 'Expenditure (₹Cr)', type: 'bar', data: [2.9, 3.1, 3.4, 3.6], itemStyle: { color: '#ef4444' } },
    ],
  };

  // 3. Monthly Liquidity Trend Area Line Chart Option
  const liquidityTrendOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 25, right: 15, bottom: 25, left: 45 },
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
        name: 'Unencumbered Liquidity (₹Cr)',
        type: 'line',
        smooth: true,
        data: [7.8, 8.1, 8.0, 8.4, 8.5, 8.72],
        lineStyle: { width: 2.5, color: '#06b6d4' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(6, 182, 212, 0.3)' },
              { offset: 1, color: 'rgba(6, 182, 212, 0.0)' },
            ],
          },
        },
      },
    ],
  };

  // Card detail configurations for drawer
  const cardDetails: Record<string, any> = {
    assets: {
      title: 'Total Operational Assets — Detailed Breakdown',
      total: '₹12.48 Cr ($150M Equiv.)',
      items: [
        { label: 'Sovereign Treasuries (RBI Bonds)', val: '₹5.24 Cr', status: 'AAA Rated' },
        { label: 'Municipal Escrow Reserves', val: '₹3.41 Cr', status: 'Encumbered' },
        { label: 'AAA Liquid Money Market', val: '₹2.25 Cr', status: 'Instant Liquid' },
        { label: 'Gold Bullion Reserves', val: '₹1.58 Cr', status: 'Hedge Pool' },
      ],
    },
    balance: {
      title: 'Available Balance & Treasury Reserves',
      total: '₹8.72 Cr Unencumbered',
      items: [
        { label: 'Main Municipal Operating Account', val: '₹5.10 Cr', status: 'Active' },
        { label: 'Capital Project Disbursement Escrow', val: '₹2.42 Cr', status: 'Reserved' },
        { label: 'Emergency Contingency Fund', val: '₹1.20 Cr', status: 'Locked' },
      ],
    },
    reserved: {
      title: 'Reserved Amount & Committed Liabilities',
      total: '₹2.18 Cr Locked',
      items: [
        { label: 'Approved Public Works Contracts', val: '₹1.45 Cr', status: 'Encumbered' },
        { label: 'Healthcare Equipment Purchase Orders', val: '₹0.73 Cr', status: 'Pending Delivery' },
      ],
    },
    obligations: {
      title: 'Pending Obligations & Vendor Disbursement Queue',
      total: '₹1.58 Cr Pending Audit',
      items: [
        { label: 'Apex Infrastructure Corp (Bridge Repair)', val: '₹0.45 Cr', status: 'Audit Screened' },
        { label: 'BioHealth MedTech Ltd (MRI Scanner)', val: '₹1.25 Cr', status: 'Policy Check' },
      ],
    },
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-400" /> Financial Position & Balance Sheet Overview
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional capital holdings, reserve allocations & account liquidity positions
          </p>
        </div>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded border border-emerald-500/30 font-bold">
          SOLVENCY RATING: AAA
        </span>
      </div>

      {/* 1. FINANCIAL OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Operational Assets"
          value="₹12.48 Cr"
          icon={Wallet}
          change={4.2}
          changeLabel="Solvent"
          subtitle="Click to view portfolio breakdown"
          onClick={() => setSelectedDetail(cardDetails.assets)}
        />
        <FinancialCard
          title="Available Balance"
          value="₹8.72 Cr"
          icon={DollarSign}
          change={1.8}
          changeLabel="Unencumbered"
          subtitle="Click to view treasury accounts"
          onClick={() => setSelectedDetail(cardDetails.balance)}
        />
        <FinancialCard
          title="Reserved Amount"
          value="₹2.18 Cr"
          icon={ShieldCheck}
          change={0.5}
          changeLabel="Encumbered Pool"
          subtitle="Click to view escrow commitments"
          onClick={() => setSelectedDetail(cardDetails.reserved)}
        />
        <FinancialCard
          title="Pending Obligations"
          value="₹1.58 Cr"
          icon={Layers}
          change={-2.4}
          changeLabel="4 Payouts"
          subtitle="Click to view disbursement queue"
          onClick={() => setSelectedDetail(cardDetails.obligations)}
        />
      </div>

      {/* 2. CHARTS GRID 1: Asset Allocation Donut + Income vs Expenditure Bar */}
      <div className="grid grid-cols-12 gap-4">
        {/* Asset Portfolio Composition Donut Chart (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Asset Portfolio Composition (₹12.48 Cr Total)</span>
            <span className="text-[10px] text-slate-400">FY 2026</span>
          </div>
          <ReactEChart option={assetAllocationOption} height="280px" />
        </div>

        {/* Income vs Expenditure Stacked Bar Chart (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Quarterly Revenue Inflow vs Expenditure</span>
            <span className="text-[10px] text-emerald-400">Target Net Margin +24%</span>
          </div>
          <ReactEChart option={incomeVsExpOption} height="280px" />
        </div>
      </div>

      {/* 3. CHARTS GRID 2: Unencumbered Liquidity Trend Area Chart + Live Ticks */}
      <div className="grid grid-cols-12 gap-4">
        {/* Liquidity Trend Area Line Chart (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-slate-200 uppercase">Monthly Unencumbered Liquidity Trend (₹Cr)</span>
            </div>
          </div>
          <ReactEChart option={liquidityTrendOption} height="240px" />
        </div>

        {/* Live Financial Ticks Feed (6 cols) */}
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42] mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-slate-200 uppercase">Live Financial Ticks Feed</span>
            </div>
            <span className="text-[10px] text-cyan-400 flex items-center">
              <span className="status-dot-live mr-1.5" /> Simulated Real-Time Stream
            </span>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {liveEvents.map((evt) => (
              <div key={evt.id} className="p-2.5 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-400">{evt.title}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{evt.message}</p>
                </div>
                <span className="text-slate-500 text-[10px] whitespace-nowrap ml-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-slate-600" /> {evt.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL DRAWER */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg bg-[#0d121d] border border-[#232d42] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <h3 className="font-bold text-sm text-white">{selectedDetail.title}</h3>
                <span className="text-xs text-cyan-400 font-bold">{selectedDetail.total}</span>
              </div>
              <button onClick={() => setSelectedDetail(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedDetail.items.map((item: any, i: number) => (
                <div key={i} className="p-3 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200 block text-xs">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.status}</span>
                  </div>
                  <span className="font-bold text-emerald-400 text-xs">{item.val}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setSelectedDetail(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
