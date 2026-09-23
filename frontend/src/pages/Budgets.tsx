import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { Wallet, AlertTriangle, CheckCircle, TrendingUp, Filter, Search, X, Layers, Activity } from 'lucide-react';

interface DeptBudget {
  department_id: string;
  department_code: string;
  department_name: string;
  allocated_budget: number;
  spent_budget: number;
  remaining_budget: number;
  utilization_pct: number;
  manager: string;
  category: string;
  lastActivity: string;
}

export const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<DeptBudget[]>([
    { department_id: '1', department_code: 'DEPT-PUB', department_name: 'Public Works', allocated_budget: 25000000, spent_budget: 23550000, remaining_budget: 1450000, utilization_pct: 94.2, manager: 'Dr. R. Sharma', category: 'Infrastructure', lastActivity: '₹14.2L road paving payout' },
    { department_id: '2', department_code: 'DEPT-HLT', department_name: 'Healthcare & Sanitation', allocated_budget: 35000000, spent_budget: 29800000, remaining_budget: 5200000, utilization_pct: 85.1, manager: 'Anita Verma', category: 'Medical Supplies', lastActivity: '₹28.0L hospital equipment PO' },
    { department_id: '3', department_code: 'DEPT-EDU', department_name: 'Education & Youth', allocated_budget: 20000000, spent_budget: 14200000, remaining_budget: 5800000, utilization_pct: 71.0, manager: 'S. K. Gupta', category: 'Scholarships', lastActivity: '₹5.5L school lab renovation' },
    { department_id: '4', department_code: 'DEPT-TRN', department_name: 'Public Transport', allocated_budget: 30000000, spent_budget: 26100000, remaining_budget: 3900000, utilization_pct: 87.0, manager: 'Vikram Singh', category: 'Fleet Upgrade', lastActivity: '₹12.0L EV bus charging installation' },
    { department_id: '5', department_code: 'DEPT-NRG', department_name: 'Energy & Utilities', allocated_budget: 18000000, spent_budget: 12500000, remaining_budget: 5500000, utilization_pct: 69.4, manager: 'Priya Nair', category: 'Renewables', lastActivity: '₹8.4L solar grid maintenance' },
    { department_id: '6', department_code: 'DEPT-ITC', department_name: 'IT & Digital Governance', allocated_budget: 12000000, spent_budget: 9800000, remaining_budget: 2200000, utilization_pct: 81.7, manager: 'Amitabh Sen', category: 'Cloud & Cyber', lastActivity: '₹2.1L server bandwidth upgrade' },
  ]);

  const [filterType, setFilterType] = useState<'ALL' | 'WARNING' | 'HEALTHY'>('ALL');
  const [selectedBudget, setSelectedBudget] = useState<DeptBudget | null>(null);

  const filteredBudgets = budgets.filter((b) => {
    if (filterType === 'WARNING') return b.utilization_pct >= 85;
    if (filterType === 'HEALTHY') return b.utilization_pct < 85;
    return true;
  });

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated_budget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent_budget, 0);
  const totalRemaining = budgets.reduce((acc, b) => acc + b.remaining_budget, 0);
  const avgUtilization = (totalSpent / totalAllocated) * 100;

  // Department Spent vs Allocated Bar Chart Option
  const budgetChartOption: EChartsOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 25, right: 15, bottom: 25, left: 100 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace', formatter: (v: number) => `₹${(v / 100000).toFixed(0)}L` },
    },
    yAxis: {
      type: 'category',
      data: budgets.map((b) => b.department_name),
      axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Spent (₹)',
        type: 'bar',
        stack: 'total',
        data: budgets.map((b) => b.spent_budget),
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Remaining Pool (₹)',
        type: 'bar',
        stack: 'total',
        data: budgets.map((b) => b.remaining_budget),
        itemStyle: { color: '#1e293b' },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" /> Departmental Budget Management & Ceiling Monitoring
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time expenditure tracking, allocation variance & statutory threshold alerts
          </p>
        </div>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded border border-blue-500/30 font-bold">
          FY 2026 ACTIVE FISCAL YEAR
        </span>
      </div>

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Allocated Ceiling"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          icon={Wallet}
          change={5.0}
          changeLabel="FY 2026 Pool"
        />
        <FinancialCard
          title="Total Committed Spent"
          value={`₹${(totalSpent / 10000000).toFixed(2)} Cr`}
          icon={TrendingUp}
          change={avgUtilization}
          changeLabel="Utilization Rate"
        />
        <FinancialCard
          title="Unencumbered Remaining"
          value={`₹${(totalRemaining / 10000000).toFixed(2)} Cr`}
          icon={CheckCircle}
          change={100 - avgUtilization}
          changeLabel="Headroom"
        />
        <FinancialCard
          title="High Utilization Alerts"
          value={`${budgets.filter((b) => b.utilization_pct >= 85).length} Departments`}
          icon={AlertTriangle}
          change={-2.0}
          changeLabel="Requires Review"
        />
      </div>

      {/* 2. TREND CHART & CATEGORY BREAKDOWN */}
      <div className="finos-card">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Department Expenditure vs Allocated Ceiling</span>
          <span className="text-[10px] text-cyan-400">Stack Breakdown</span>
        </div>
        <ReactEChart option={budgetChartOption} height="260px" />
      </div>

      {/* 3. INTERACTIVE FILTERS & DEPARTMENT CARDS GRID */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111622] p-3 rounded border border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Departmental Allocation Cards</span>

          <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
            {(['ALL', 'WARNING', 'HEALTHY'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setFilterType(ft)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                  filterType === ft
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                {ft === 'ALL' ? 'All Depts' : ft === 'WARNING' ? 'High Utilization (>85%)' : 'Healthy (<85%)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((b) => {
            const isWarning = b.utilization_pct >= 85;
            const isExceeded = b.utilization_pct >= 94;

            return (
              <div
                key={b.department_id}
                onClick={() => setSelectedBudget(b)}
                className="finos-card bg-[#111622] border border-[#232d42] p-4 rounded-md space-y-3 cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <div className="flex justify-between items-start border-b border-[#232d42] pb-2">
                  <div>
                    <span className="text-[10px] text-cyan-400 block font-mono">{b.department_code}</span>
                    <h3 className="font-bold text-sm text-white">{b.department_name}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isExceeded
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {b.utilization_pct.toFixed(1)}% Spent
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Spent: ₹{(b.spent_budget / 100000).toFixed(1)}L</span>
                    <span>Cap: ₹{(b.allocated_budget / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="h-2.5 w-full bg-[#1e293b] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isExceeded ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, b.utilization_pct)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-[#151c2c] p-2 rounded border border-[#232d42]">
                    <span className="text-[10px] text-slate-500 block">Remaining Pool</span>
                    <span className="font-bold text-emerald-400">₹{(b.remaining_budget / 100000).toFixed(1)}L</span>
                  </div>
                  <div className="bg-[#151c2c] p-2 rounded border border-[#232d42]">
                    <span className="text-[10px] text-slate-500 block">Dept Head</span>
                    <span className="font-semibold text-slate-300 truncate block">{b.manager}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEPARTMENT DETAIL MODAL */}
      {selectedBudget && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-lg bg-[#0d121d] border border-[#232d42] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <span className="text-xs text-cyan-400 font-bold block">{selectedBudget.department_code}</span>
                <h3 className="font-bold text-base text-white">{selectedBudget.department_name}</h3>
              </div>
              <button onClick={() => setSelectedBudget(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-500 text-[10px] block">Allocated Ceiling</span>
                  <span className="text-base font-bold text-white">₹{(selectedBudget.allocated_budget / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-500 text-[10px] block">Committed Spent</span>
                  <span className="text-base font-bold text-blue-400">₹{(selectedBudget.spent_budget / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>

              <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] space-y-1">
                <span className="text-slate-400 text-[10px] block">Recent Departmental Activity</span>
                <p className="text-slate-200 text-[11px]">{selectedBudget.lastActivity}</p>
              </div>

              <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] flex justify-between">
                <span className="text-slate-400">Department Manager:</span>
                <span className="font-bold text-white">{selectedBudget.manager}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setSelectedBudget(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
