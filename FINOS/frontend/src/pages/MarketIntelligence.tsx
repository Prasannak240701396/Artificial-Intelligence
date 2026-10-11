import React, { useState, useEffect } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { TrendingUp, Activity, BarChart2, Search } from 'lucide-react';
import { mockTickService } from '../services/mockTickService';
import { generate75MarketAssets, MarketAssetItem } from '../utils/dummyGenerator';

export const MarketIntelligence: React.FC = () => {
  const [ticks, setTicks] = useState<any>({});
  const [assets] = useState<MarketAssetItem[]>(() => generate75MarketAssets());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const unsub = mockTickService.subscribeTicks((data) => setTicks(data));
    return () => unsub();
  }, []);

  const filteredAssets = assets.filter((a) => {
    const matchCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchSearch =
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Correlation Matrix Heatmap Option
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
            80+ Surveillance Assets • Macroeconomic correlations, orderbook depth simulation & multi-asset surveillance
          </p>
        </div>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded border border-cyan-500/30 font-bold flex items-center">
          <span className="status-dot-live mr-1.5" /> LIVE TICKS STREAM ({assets.length} ASSETS)
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
        <div className="col-span-12 lg:col-span-6 finos-card bg-[#151c2c] p-4 rounded border border-[#232d42]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Asset Class Cross-Correlation Heatmap Matrix</span>
          </div>
          <ReactEChart option={correlationOption} height="280px" />
        </div>

        <div className="col-span-12 lg:col-span-6 finos-card bg-[#151c2c] p-4 rounded border border-[#232d42]">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">30-Day Implied Volatility Comparison (%)</span>
          </div>
          <ReactEChart option={volatilityOption} height="280px" />
        </div>
      </div>

      {/* 80+ Market Assets Table Toolbar & List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111622] p-3.5 rounded border border-[#232d42]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search 80+ Market Assets by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
            {(['ALL', 'INDEX', 'COMMODITY', 'FOREX', 'BOND', 'EQUITY'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Showing <strong className="text-white">{filteredAssets.length}</strong> of <strong className="text-white">{assets.length}</strong> Surveillance Assets</span>
        </div>

        <div className="finos-card bg-[#111622] border border-[#232d42] rounded-md overflow-x-auto max-h-[600px] overflow-y-auto font-mono text-xs">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="bg-[#151c2c] border-b border-[#232d42] text-slate-400">
                <th className="p-3">Symbol</th>
                <th className="p-3">Asset Description</th>
                <th className="p-3">Category</th>
                <th className="p-3">Last Price</th>
                <th className="p-3">Change (24h)</th>
                <th className="p-3">High</th>
                <th className="p-3">Low</th>
                <th className="p-3">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]">
              {filteredAssets.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-[#182338] transition-colors">
                  <td className="p-3 font-bold text-cyan-400">{asset.symbol}</td>
                  <td className="p-3 text-slate-200 font-semibold">{asset.name}</td>
                  <td className="p-3">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/30">
                      {asset.category}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-white">₹{asset.price.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`font-bold ${asset.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {asset.changePct >= 0 ? '+' : ''}{asset.changePct}%
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">₹{asset.high.toLocaleString()}</td>
                  <td className="p-3 text-slate-400">₹{asset.low.toLocaleString()}</td>
                  <td className="p-3 text-slate-300 font-mono">{asset.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
