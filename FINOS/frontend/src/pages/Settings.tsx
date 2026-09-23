import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Radio, Shield, Key, Sliders, CheckCircle2, DollarSign } from 'lucide-react';
import { mockTickService } from '../services/mockTickService';

export const Settings: React.FC = () => {
  const [marketMode, setMarketMode] = useState<string>('SIMULATION');
  const [tickSpeedMs, setTickSpeedMs] = useState<number>(2500);
  const [riskAlertThreshold, setRiskAlertThreshold] = useState<number>(70);
  const [currencyPref, setCurrencyPref] = useState<string>('INR');
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    mockTickService.setSpeed(tickSpeedMs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-blue-400" /> Platform Settings & Simulation Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure local tick simulation speed, risk alert thresholds & display preferences
          </p>
        </div>
      </div>

      <div className="finos-card max-w-2xl bg-[#111622] p-5 rounded-md space-y-5 border border-[#232d42]">
        {saved && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-emerald-400 font-bold flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" /> Platform preferences saved & tick engine updated!
          </div>
        )}

        {/* 1. Market Data Mode Toggle */}
        <div className="space-y-3 border-b border-[#232d42] pb-5">
          <label className="text-xs font-bold text-slate-200 block flex items-center">
            <Radio className="h-4 w-4 mr-1.5 text-cyan-400" /> Market Ingestion Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-start space-x-2.5 bg-[#151c2c] border border-[#232d42] p-3 rounded cursor-pointer hover:border-blue-500/40">
              <input
                type="radio"
                name="market_mode"
                value="SIMULATION"
                checked={marketMode === 'SIMULATION'}
                onChange={() => setMarketMode('SIMULATION')}
                className="mt-0.5 accent-blue-500"
              />
              <div>
                <span className="font-bold text-white block">SIMULATION MODE</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Local Geometric Brownian Motion tick generator (NIFTY 50, S&P 500, BANK NIFTY)
                </span>
              </div>
            </label>

            <label className="flex items-start space-x-2.5 bg-[#151c2c] border border-[#232d42] p-3 rounded cursor-pointer hover:border-blue-500/40">
              <input
                type="radio"
                name="market_mode"
                value="LIVE"
                checked={marketMode === 'LIVE'}
                onChange={() => setMarketMode('LIVE')}
                className="mt-0.5 accent-blue-500"
              />
              <div>
                <span className="font-bold text-white block">LIVE MARKET API</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Fetch live financial quotes via external Finnhub / AlphaVantage endpoints
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 2. Simulated Tick Speed Slider */}
        <div className="space-y-2 border-b border-[#232d42] pb-5">
          <label className="text-xs font-bold text-slate-200 block flex items-center">
            <Sliders className="h-4 w-4 mr-1.5 text-blue-400" /> Simulated Live Tick Refresh Interval: {(tickSpeedMs / 1000).toFixed(1)}s
          </label>
          <input
            type="range"
            min="1000"
            max="5000"
            step="500"
            value={tickSpeedMs}
            onChange={(e) => setTickSpeedMs(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 block">
            Controls how fast tick values update across Dashboard, Overview, and Market Intelligence terminals.
          </span>
        </div>

        {/* 3. Risk Alert Threshold */}
        <div className="space-y-2 border-b border-[#232d42] pb-5">
          <label className="text-xs font-bold text-slate-200 block flex items-center">
            <Shield className="h-4 w-4 mr-1.5 text-amber-400" /> Anomaly Risk Flagging Threshold: Score &ge; {riskAlertThreshold}
          </label>
          <input
            type="range"
            min="30"
            max="90"
            step="5"
            value={riskAlertThreshold}
            onChange={(e) => setRiskAlertThreshold(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400 block">
            Transactions exceeding this Bayesian score will be automatically flagged for Policy Agent review.
          </span>
        </div>

        {/* 4. Currency Preference */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-200 block flex items-center">
            <DollarSign className="h-4 w-4 mr-1.5 text-emerald-400" /> Primary Currency Display
          </label>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setCurrencyPref('INR')}
              className={`px-4 py-2 rounded font-bold border transition-colors ${
                currencyPref === 'INR'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-[#151c2c] text-slate-400 border-[#232d42]'
              }`}
            >
              ₹ INR (Indian Rupee / Cr / L)
            </button>
            <button
              type="button"
              onClick={() => setCurrencyPref('USD')}
              className={`px-4 py-2 rounded font-bold border transition-colors ${
                currencyPref === 'USD'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-[#151c2c] text-slate-400 border-[#232d42]'
              }`}
            >
              $ USD (US Dollar / M)
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded flex items-center space-x-2 transition-colors text-xs"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
