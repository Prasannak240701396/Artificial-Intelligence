import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { ShieldAlert, AlertTriangle, Activity, BarChart2, CheckCircle2, X } from 'lucide-react';

interface RiskModel {
  id: string;
  name: string;
  category: string;
  score: number;
  probability: string;
  financialImpact: string;
  factors: string[];
  historicalTrend: string;
  mitigation: string;
}

export const RiskAnalytics: React.FC = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskModel>({
    id: 'RISK-01',
    name: 'Liquidity Risk',
    category: 'Treasury & Reserve Solvency',
    score: 18.4,
    probability: '12% (Low)',
    financialImpact: '₹45.0 L potential reserve volatility',
    factors: ['Short-term treasury bill yield fluctuations', 'Municipal tax delay variance'],
    historicalTrend: '-2.4% over past 30 days (Improving)',
    mitigation: 'Maintain minimum 60-day cash buffer in AAA liquid money market reserves.',
  });

  const [detailDrawerOpen, setDetailDrawerOpen] = useState<boolean>(false);

  const riskModels: RiskModel[] = [
    {
      id: 'RISK-01',
      name: 'Liquidity Risk',
      category: 'Treasury & Reserve Solvency',
      score: 18.4,
      probability: '12% (Low)',
      financialImpact: '₹45.0 L potential reserve volatility',
      factors: ['Short-term treasury bill yield fluctuations', 'Municipal tax delay variance'],
      historicalTrend: '-2.4% over past 30 days (Improving)',
      mitigation: 'Maintain minimum 60-day cash buffer in AAA liquid money market reserves.',
    },
    {
      id: 'RISK-02',
      name: 'Payment Risk',
      category: 'Vendor Disbursement Fraud',
      score: 34.2,
      probability: '28% (Moderate)',
      financialImpact: '₹92.0 L unverified invoice submission',
      factors: ['Duplicate vendor invoice flags', 'Z-score deviation in vendor pricing baseline'],
      mitigation: 'Enforce two-factor policy screening by Policy Validation Agent prior to disbursement.',
      historicalTrend: '+1.5% due to fiscal quarter end',
    },
    {
      id: 'RISK-03',
      name: 'Budget Risk',
      category: 'Departmental Expenditure Overrun',
      score: 42.0,
      probability: '35% (Moderate)',
      financialImpact: '₹1.20 Cr potential departmental ceiling breach',
      factors: ['Public Works Department at 94.2% budget utilization cap', 'Emergency road maintenance requests'],
      mitigation: 'Trigger automated capital reallocation from unencumbered contingency pool.',
      historicalTrend: '+4.1% over past 15 days',
    },
    {
      id: 'RISK-04',
      name: 'Cash Shortage Risk',
      category: 'Macroeconomic Inflow Deficit',
      score: 12.0,
      probability: '8% (Very Low)',
      financialImpact: '₹15.0 L shortfall under severe stress scenario',
      factors: ['Delayed state government grant transfer'],
      mitigation: 'Activate short-term liquidity facility under RBI escrow agreement.',
      historicalTrend: 'Stable baseline',
    },
  ];

  const handleSelectRisk = (model: RiskModel) => {
    setSelectedRisk(model);
    setDetailDrawerOpen(true);
  };

  // Scatter Chart Option (Preserved)
  const anomalyScatterOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `Amount: ₹${params.value[0].toLocaleString()} <br/>Z-Score: ${params.value[1]}`,
      backgroundColor: '#111622',
      borderColor: '#232d42',
      textStyle: { color: '#f8fafc', fontSize: 11, fontFamily: 'monospace' },
    },
    grid: { top: 30, right: 20, bottom: 25, left: 50 },
    xAxis: {
      type: 'value',
      name: 'Amount (₹)',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      name: 'Z-Score Deviation',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: any) => Math.min(25, Math.max(8, data[1] * 4)),
        data: [
          [150000, 0.2], [220000, 0.4], [180000, 0.1], [450000, 1.2], [920000, 2.8],
          [1500000, 3.9], [3200000, 5.2], [140000, 0.1], [280000, 0.5], [640000, 1.8],
        ],
        itemStyle: {
          color: (params: any) => (params.value[1] > 2.5 ? '#ef4444' : '#3b82f6'),
        },
      },
    ],
  };

  // Risk Radar / Bar Chart
  const riskChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 20, bottom: 25, left: 110 },
    xAxis: {
      type: 'value',
      max: 100,
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'category',
      data: riskModels.map((r) => r.name),
      axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Risk Score (/100)',
        type: 'bar',
        data: riskModels.map((r) => r.score),
        itemStyle: {
          color: (params: any) => (params.value > 30 ? '#f59e0b' : '#3b82f6'),
        },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" /> Financial Risk Engine & Anomaly Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bayesian risk scoring, Isolation Forest statistical anomalies & vulnerability matrices
          </p>
        </div>
        <div className="bg-[#151c2c] px-3 py-1.5 rounded border border-[#232d42] text-right">
          <span className="text-[10px] text-slate-500 block">OVERALL SYSTEM RISK</span>
          <span className="font-bold text-amber-400 text-sm">18.4 / 100 (LOW EXPOSURE)</span>
        </div>
      </div>

      {/* Selectable Risk Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskModels.map((r) => (
          <div
            key={r.id}
            onClick={() => handleSelectRisk(r)}
            className={`finos-card bg-[#111622] border rounded-md p-4 cursor-pointer transition-all ${
              selectedRisk.id === r.id
                ? 'border-amber-500 bg-[#182338]'
                : 'border-[#232d42] hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-slate-400 font-bold block">{r.category}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                Score: {r.score}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{r.name}</h3>
            <span className="text-[10px] text-slate-500 block mt-1">Impact: {r.financialImpact}</span>
            <span className="text-[10px] text-blue-400 hover:underline block mt-3 font-bold">
              Click for Detailed Risk Analysis →
            </span>
          </div>
        ))}
      </div>

      {/* Scatter Chart & Risk Bar Comparison */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">
              Z-Score Statistical Deviation vs Transaction Amount Scatter Plot
            </span>
          </div>
          <ReactEChart option={anomalyScatterOption} height="300px" />
        </div>

        <div className="col-span-12 lg:col-span-5 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Risk Category Score Comparison</span>
          </div>
          <ReactEChart option={riskChartOption} height="300px" />
        </div>
      </div>

      {/* DETAILED RISK ANALYSIS DRAWER */}
      {detailDrawerOpen && selectedRisk && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-end p-4 font-mono">
          <div className="w-full max-w-lg h-full bg-[#0d121d] border-l border-[#232d42] shadow-2xl p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
                <div>
                  <span className="text-xs text-amber-400 font-bold block">{selectedRisk.id} • {selectedRisk.category}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedRisk.name}</h3>
                </div>
                <button onClick={() => setDetailDrawerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Risk Score</span>
                    <span className="text-lg font-bold text-amber-400">{selectedRisk.score} / 100</span>
                  </div>
                  <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Probability</span>
                    <span className="text-lg font-bold text-white">{selectedRisk.probability}</span>
                  </div>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-400 text-[10px] block">Estimated Financial Impact</span>
                  <span className="text-sm font-bold text-red-400">{selectedRisk.financialImpact}</span>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] space-y-1">
                  <span className="text-slate-400 text-[10px] block">Contributing Risk Factors</span>
                  <ul className="list-disc list-inside text-slate-200 text-[11px] space-y-1">
                    {selectedRisk.factors.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-400 text-[10px] block">Historical Risk Trend</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">{selectedRisk.historicalTrend}</span>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded space-y-1 text-blue-200">
                  <span className="font-bold text-xs flex items-center text-blue-400">
                    <CheckCircle2 className="h-4 w-4 mr-1.5 text-blue-400" /> Recommended Agent Mitigation
                  </span>
                  <p className="text-[11px] leading-relaxed">{selectedRisk.mitigation}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setDetailDrawerOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Risk Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
