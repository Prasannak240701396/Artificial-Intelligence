import React, { useState, useEffect } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { TrendingUp, RefreshCw, Layers, DollarSign, Activity, PieChart, BarChart2 } from 'lucide-react';
import { mockTickService } from '../services/mockTickService';

export const MarketIntelligence: React.FC = () => {
  const [ticks, setTicks] = useState<any>({});

  useEffect(() => {
    const unsub = mockTickService.subscribeTicks((data) => setTicks(data));
    return () => unsub();
  }, []);

  // Correlation Matrix Heatmap Option (Preserved)
  const correlationOption: EChartsOption = {
    tooltip: { position: 'top' },
    grid: { top: 25, right: 20, bottom: 40, left: 70 },
    xAxis: { type: 'category', data: ['NIFTY 50', 'S&P 500', 'BANK NIFTY', 'GOLD', 'CRUDE', 'USD/INR'], axisLabel: { fontSize: 10, fontFamily: 'monospace' } },
    yAxis: { type: 'category', data: ['NIFTY 50', 'S&P 500', 'BANK NIFTY', 'GOLD', 'CRUDE', 'USD/INR'], axisLabel: { fontSize: 10, fontFamily: 'monospace' } },
    visualMap: { min: -1, max: 1, calculable: true, orient: 'horizontal', left: 'center', bottom: 0, textStyle: { color: '#94a3b8', fontSize: 10 } },
    series: [
      {
        type: 'heatmap',
        data: [
          [0,0,1.0],[0,1,0.85],[0,2,0.92],[0,3,0.12],[0,4,0.34],[0,5,-0.68],
          [1,0,0.85],[1,1,1.0],[1,2,0.78],[1,3,0.08],[1,4,0.28],[1,5,-0.75],
          [2,0,0.92],[2,1,0.78],[2,2,1.0],[2,3,0.15],[2,4,0.22],[2,5,-0.60],
          [3,0,0.12],[3,1,0.08],[3,2,0.15],[3,3,1.0],[3,4,-0.05],[3,5,0.25],
          [4,0,0.34],[4,1,0.28],[4,2,0.22],[4,3,-0.05],[4,4,1.0],[4,5,0.15],
          [5,0,-0.68],[5,1,-0.75],[5,2,-0.60],[5,3,0.25],[5,4,0.15],[5,5,1.0],
        ],
        label: { show: true, fontSize: 9 },
      },
    ],
  };

  // Asset Volatility Comparison Bar Chart
  const volatilityOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 25, right: 15, bottom: 25, left: 80 },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#182030' } }, axisLabel: { color: '#64748b', fontSize: 10 } },
    yAxis: {
      type: 'category',
      data: ['NIFTY 50', 'S&P 500', 'BANK NIFTY', 'NASDAQ', 'DOW JONES'],
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    series: [
      {
        name: '30D Implied Volatility (%)',
        type: 'bar',
        data: [12.4, 14.8, 18.2, 21.5, 11.2],
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
            <TrendingUp className="h-5 w-5 text-cyan-400" /> Global Market Intelligence Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Macroeconomic correlations, orderbook depth simulation & multi-asset surveillance
          </p>
        </div>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded border border-cyan-500/30 font-bold flex items-center">
          <span className="status-dot-live mr-1.5" /> LIVE TICKS STREAM
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="NIFTY 50 Index"
          value={ticks['NIFTY 50'] ? `₹${ticks['NIFTY 50'].price.toLocaleString()}` : '₹24,580.45'}
          icon={TrendingUp}
          change={ticks['NIFTY 50']?.changePct || 0.58}
          changeLabel="Intraday"
        />
        <FinancialCard
          title="S&P 500 Index"
          value={ticks['S&P 500'] ? `$${ticks['S&P 500'].price.toLocaleString()}` : '$5,620.10'}
          icon={Activity}
          change={ticks['S&P 500']?.changePct || 0.51}
          changeLabel="Intraday"
        />
        <FinancialCard
          title="BANK NIFTY Index"
          value={ticks['BANK NIFTY'] ? `₹${ticks['BANK NIFTY'].price.toLocaleString()}` : '₹52,340.80'}
          icon={BarChart2}
          change={ticks['BANK NIFTY']?.changePct || -0.34}
          changeLabel="Intraday"
        />
        <FinancialCard
          title="NASDAQ Composite"
          value={ticks['NASDAQ'] ? `$${ticks['NASDAQ'].price.toLocaleString()}` : '$17,890.25'}
          icon={TrendingUp}
          change={ticks['NASDAQ']?.changePct || 0.87}
          changeLabel="Intraday"
        />
      </div>

      {/* Charts Grid: Heatmap & Volatility */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Asset Class Cross-Correlation Heatmap Matrix</span>
          </div>
          <ReactEChart option={correlationOption} height="300px" />
        </div>

        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">30-Day Implied Volatility Comparison (%)</span>
          </div>
          <ReactEChart option={volatilityOption} height="300px" />
        </div>
      </div>

      {/* Orderbook Depth Simulation */}
      <div className="finos-card">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Simulated Institutional Order Book Depth</span>
          <span className="text-[10px] text-cyan-400 font-mono">Live L2 Tick Stream</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          <div>
            <span className="text-emerald-400 font-bold block mb-2">BIDS (BUY ORDERS)</span>
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-[#232d42]">
                  <th className="py-1">Price</th>
                  <th className="py-1">Quantity</th>
                  <th className="py-1">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2638]">
                <tr><td className="py-1.5 text-emerald-400">24,580.00</td><td>142</td><td>₹34.9 L</td></tr>
                <tr><td className="py-1.5 text-emerald-400">24,579.50</td><td>210</td><td>₹51.6 L</td></tr>
                <tr><td className="py-1.5 text-emerald-400">24,579.00</td><td>380</td><td>₹93.4 L</td></tr>
                <tr><td className="py-1.5 text-emerald-400">24,578.50</td><td>450</td><td>₹1.10 Cr</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <span className="text-red-400 font-bold block mb-2">ASKS (SELL ORDERS)</span>
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-slate-500 border-b border-[#232d42]">
                  <th className="py-1">Price</th>
                  <th className="py-1">Quantity</th>
                  <th className="py-1">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c2638]">
                <tr><td className="py-1.5 text-red-400">24,580.50</td><td>115</td><td>₹28.2 L</td></tr>
                <tr><td className="py-1.5 text-red-400">24,581.00</td><td>190</td><td>₹46.7 L</td></tr>
                <tr><td className="py-1.5 text-red-400">24,581.50</td><td>310</td><td>₹76.2 L</td></tr>
                <tr><td className="py-1.5 text-red-400">24,582.00</td><td>520</td><td>₹1.27 Cr</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
