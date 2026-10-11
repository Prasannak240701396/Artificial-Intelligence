import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { Wallet, PieChart, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { generate75Budgets, DeptBudgetItem } from '../utils/dummyGenerator';

export const Budgets: React.FC = () => {
  const [budgets] = useState<DeptBudgetItem[]>(() => generate75Budgets());
  const [filterType, setFilterType] = useState<'ALL' | 'WARNING' | 'HEALTHY'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBudgets = budgets.filter((b) => {
    const matchesSearch =
      b.department_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.department_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'WARNING') return matchesSearch && b.utilization_pct >= 80;
    if (filterType === 'HEALTHY') return matchesSearch && b.utilization_pct < 80;
    return matchesSearch;
  });

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated_budget, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent_budget, 0);
  const totalRemaining = budgets.reduce((acc, b) => acc + b.remaining_budget, 0);
  const avgUtilization = (totalSpent / totalAllocated) * 100;

  // Department Spent vs Allocated Bar Chart Option
  const budgetChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Allocated Budget', 'Spent Budget'], textStyle: { color: '#94a3b8', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 25, left: 110 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: {
        color: '#64748b',
        fontSize: 10,
        fontFamily: 'monospace',
        formatter: (val: number) => `₹${(val / 10000000).toFixed(1)}Cr`,
      },
    },
    yAxis: {
      type: 'category',
      data: budgets.slice(0, 6).map((b) => b.department_code),
      axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Allocated Budget',
        type: 'bar',
        data: budgets.slice(0, 6).map((b) => b.allocated_budget),
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: 'Spent Budget',
        type: 'bar',
        data: budgets.slice(0, 6).map((b) => b.spent_budget),
        itemStyle: { color: '#06b6d4' },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" /> Departmental Budget Allocation & Utilization Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            80+ Municipal Department Budgets • Ceiling limits, spent ratio analysis, and officer authorization tracking
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard title="Total Municipal Budget" value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`} icon={Wallet} change={8.4} changeLabel="FY 2026 Pool" />
        <FinancialCard title="Total Spent Expenditure" value={`₹${(totalSpent / 10000000).toFixed(2)} Cr`} icon={PieChart} change={12.1} changeLabel="Committed" />
        <FinancialCard title="Unencumbered Reserves" value={`₹${(totalRemaining / 10000000).toFixed(2)} Cr`} icon={CheckCircle2} change={-2.4} changeLabel="Available" />
        <FinancialCard title="Avg Ceiling Utilization" value={`${avgUtilization.toFixed(1)}%`} icon={AlertCircle} change={avgUtilization > 85 ? 4.2 : -1.1} changeLabel="Utilization Rate" />
      </div>

      {/* Bar Chart Visualization */}
      <div className="finos-card bg-[#151c2c] border border-[#232d42] p-4 rounded-md">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Departmental Expenditure vs Allocated Ceiling (Top Divisions)</span>
          <span className="text-[10px] text-cyan-400 font-mono">Live Audited Ledger</span>
        </div>
        <ReactEChart option={budgetChartOption} height="240px" />
      </div>

      {/* Toolbar & Filter Options */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111622] p-3.5 rounded border border-[#232d42]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 80+ Department Budgets by code, division, or officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

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
                {ft === 'WARNING' ? 'High Utilization (≥80%)' : ft === 'HEALTHY' ? 'Healthy (<80%)' : 'All Divisions'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Showing <strong className="text-white">{filteredBudgets.length}</strong> of <strong className="text-white">{budgets.length}</strong> Department Budgets</span>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((b) => (
            <div key={b.department_id} className="finos-card bg-[#111622] border border-[#232d42] p-4 rounded-md space-y-3 hover:border-blue-500/40 transition-all font-mono">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold block">{b.department_code} • {b.category}</span>
                  <h3 className="font-bold text-xs text-white mt-0.5 line-clamp-1">{b.department_name}</h3>
                  <span className="text-[10px] text-slate-400 block mt-1">Officer: {b.manager}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  b.utilization_pct >= 85
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : b.utilization_pct >= 75
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}>
                  {b.utilization_pct}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>Spent: ₹{(b.spent_budget / 100000).toFixed(1)}L</span>
                  <span>Ceiling: ₹{(b.allocated_budget / 100000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-[#0d121d] h-2 rounded-full overflow-hidden border border-[#232d42]">
                  <div
                    className={`h-full transition-all ${
                      b.utilization_pct >= 85 ? 'bg-red-500' : b.utilization_pct >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, b.utilization_pct)}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0d121d] p-2 rounded border border-[#232d42] text-[10px] text-slate-300 flex justify-between">
                <span>Remaining: <strong className="text-emerald-400">₹{(b.remaining_budget / 100000).toFixed(1)}L</strong></span>
                <span className="text-slate-400 truncate max-w-[150px]">{b.lastActivity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
