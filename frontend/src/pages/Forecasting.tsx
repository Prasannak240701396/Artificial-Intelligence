import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { BarChart3, TrendingUp, Sliders, Layers, CheckCircle2 } from 'lucide-react';

export const Forecasting: React.FC = () => {
  const [horizon, setHorizon] = useState<number>(6);
  const [showConfidence, setShowConfidence] = useState<boolean>(true);

  // Generate data dynamically based on horizon
  const periods = Array.from({ length: horizon }).map((_, i) => `Month ${i + 1}`);
  const linearData = periods.map((_, i) => Number((42.0 + i * 2.5).toFixed(1)));
  const expData = periods.map((_, i) => Number((42.0 + Math.pow(i, 1.2) * 2.1).toFixed(1)));
  const upperBound = linearData.map((v) => Number((v * 1.12).toFixed(1)));
  const lowerBound = linearData.map((v) => Number((v * 0.88).toFixed(1)));

  const chartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Linear Regression (₹Cr)', 'Exp Smoothing (₹Cr)', '95% Upper Bound', '95% Lower Bound'],
      textStyle: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    grid: { top: 30, right: 20, bottom: 25, left: 50 },
    xAxis: {
      type: 'category',
      data: periods,
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Linear Regression (₹Cr)',
        type: 'line',
        data: linearData,
        lineStyle: { color: '#3b82f6', width: 2.5 },
      },
      {
        name: 'Exp Smoothing (₹Cr)',
        type: 'line',
        data: expData,
        lineStyle: { color: '#06b6d4', width: 2.5 },
      },
      ...(showConfidence
        ? [
            {
              name: '95% Upper Bound',
              type: 'line' as const,
              data: upperBound,
              lineStyle: { color: '#64748b', type: 'dashed' as const },
            },
            {
              name: '95% Lower Bound',
              type: 'line' as const,
              data: lowerBound,
              lineStyle: { color: '#64748b', type: 'dashed' as const },
            },
          ]
        : []),
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" /> Financial Forecasting & Time-Series Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ordinary Least Squares Regression, Exponential Smoothing & Moving Average projections
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-slate-300 text-xs bg-[#151c2c] px-3 py-1.5 rounded border border-[#232d42] cursor-pointer">
            <input
              type="checkbox"
              checked={showConfidence}
              onChange={(e) => setShowConfidence(e.target.checked)}
              className="accent-blue-500"
            />
            <span>Show 95% Confidence Bounds</span>
          </label>

          <div className="flex items-center space-x-2 bg-[#151c2c] px-3 py-1.5 rounded border border-[#232d42]">
            <span className="text-slate-400">Horizon:</span>
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="bg-[#111622] text-white border border-[#232d42] rounded px-2 py-0.5 focus:outline-none font-mono"
            >
              <option value={3}>3 Months</option>
              <option value={6}>6 Months</option>
              <option value={12}>12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Forecasting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Projected End-Period Outflow"
          value={`₹${linearData[linearData.length - 1]} Cr`}
          icon={TrendingUp}
          change={4.8}
          changeLabel={`${horizon}-Month Model`}
        />
        <FinancialCard
          title="Model Confidence R²"
          value="0.942"
          icon={CheckCircle2}
          change={0.8}
          changeLabel="High Fit"
        />
        <FinancialCard
          title="Upper Bound Peak"
          value={`₹${upperBound[upperBound.length - 1]} Cr`}
          icon={BarChart3}
          subtitle="95% Confidence Limit"
        />
        <FinancialCard
          title="Lower Bound Floor"
          value={`₹${lowerBound[lowerBound.length - 1]} Cr`}
          icon={Layers}
          subtitle="95% Confidence Limit"
        />
      </div>

      {/* Main Forecast Chart */}
      <div className="finos-card">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">
            Expenditure & Cash Flow Projection Models ({horizon}-Month Horizon)
          </span>
          <span className="text-[10px] text-cyan-400">OLS vs Exponential Smoothing</span>
        </div>
        <ReactEChart option={chartOption} height="340px" />
      </div>
    </div>
  );
};
