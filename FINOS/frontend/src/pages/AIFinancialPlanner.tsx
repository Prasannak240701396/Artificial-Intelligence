import React, { useState } from 'react';
import { Cpu, Play, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import { FinancialCard } from '../components/FinancialCard';

export const AIFinancialPlanner: React.FC = () => {
  // Input parameters for simulation
  const [paymentAmount, setPaymentAmount] = useState<number>(4500000); // ₹45.0 L
  const [selectedDept, setSelectedDept] = useState<string>('Public Works');
  const [priorityLevel, setPriorityLevel] = useState<string>('HIGH');
  const [isSimulated, setIsSimulated] = useState<boolean>(true);

  // Initial State (BEFORE)
  const initialBalance = 87200000; // ₹8.72 Cr
  const initialReservePool = 21800000; // ₹2.18 Cr
  const initialRiskScore = 18.4;
  const initialDeptSpent = 23550000; // ₹2.35 Cr out of ₹2.50 Cr
  const initialDeptCap = 25000000; // ₹2.50 Cr

  // Computed Action & AFTER State
  const remainingBalanceAfter = initialBalance - paymentAmount;
  const remainingReserveAfter = initialReservePool - Math.min(initialReservePool, paymentAmount * 0.2);
  const newDeptSpent = initialDeptSpent + paymentAmount;
  const newDeptUtilPct = (newDeptSpent / initialDeptCap) * 100;
  const riskDelta = paymentAmount > 10000000 ? 14.5 : paymentAmount > 5000000 ? 8.2 : 2.5;
  const newRiskScore = Number((initialRiskScore + riskDelta).toFixed(1));

  const isOverCeiling = newDeptSpent > initialDeptCap;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" /> Financial Decision Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate "What happens if we make this payment?" with BEFORE → ACTION → AFTER comparative analysis
          </p>
        </div>
        <span className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded border border-cyan-500/30 font-bold flex items-center">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> PROTOTYPE SIMULATOR MODE
        </span>
      </div>

      {/* Simulator Control Workbench */}
      <div className="grid grid-cols-12 gap-4">
        {/* Input Parameters Form (4 cols) */}
        <div className="col-span-12 lg:col-span-4 finos-card space-y-4 bg-[#111622]">
          <div className="flex items-center justify-between pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Simulate Disbursement Decision</span>
            <span className="text-[10px] text-slate-500">Interactive Inputs</span>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">Disbursement Amount (₹)</label>
            <input
              type="number"
              step="100000"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#151c2c] border border-[#232d42] text-white px-3 py-2 rounded font-mono text-sm focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-cyan-400 block font-bold">
              = ₹{(paymentAmount / 100000).toFixed(1)} Lakhs (₹{(paymentAmount / 10000000).toFixed(2)} Cr)
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">Target Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-[#151c2c] border border-[#232d42] text-white px-3 py-2 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="Public Works">Public Works (Cap: ₹2.50 Cr)</option>
              <option value="Healthcare & Sanitation">Healthcare & Sanitation (Cap: ₹3.50 Cr)</option>
              <option value="Education & Youth">Education & Youth (Cap: ₹2.00 Cr)</option>
              <option value="Public Transport">Public Transport (Cap: ₹3.00 Cr)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px] block">Priority Classification</label>
            <select
              value={priorityLevel}
              onChange={(e) => setPriorityLevel(e.target.value)}
              className="w-full bg-[#151c2c] border border-[#232d42] text-white px-3 py-2 rounded font-mono text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="CRITICAL">CRITICAL — Immediate Statutory Payout</option>
              <option value="HIGH">HIGH — Approved Infrastructure Milestone</option>
              <option value="MEDIUM">MEDIUM — Routine Operational Payout</option>
              <option value="LOW">LOW — Optional Discretionary Payout</option>
            </select>
          </div>

          <div className="p-3 bg-[#151c2c] rounded border border-[#232d42] text-[11px] text-slate-300">
            Clicking parameters dynamically recalculates system impact invariants without modifying live data.
          </div>
        </div>

        {/* Comparative Analysis: BEFORE → ACTION → AFTER (8 cols) */}
        <div className="col-span-12 lg:col-span-8 finos-card space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Decision Impact Simulation: BEFORE → ACTION → AFTER</span>
            <span className="text-emerald-400 text-[10px] font-bold">Local Calculation Engine</span>
          </div>

          {/* Three-Column Comparative Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. BEFORE STATE */}
            <div className="bg-[#151c2c] p-3.5 rounded border border-[#232d42] space-y-3">
              <div className="pb-2 border-b border-[#232d42] flex justify-between items-center">
                <span className="font-bold text-slate-400 uppercase text-[11px]">1. BEFORE STATE</span>
                <span className="text-[9px] bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded">Baseline</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Available Balance</span>
                <span className="font-bold text-white text-sm">₹{(initialBalance / 10000000).toFixed(2)} Cr</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Dept Utilization ({selectedDept})</span>
                <span className="font-bold text-blue-400 text-sm">{((initialDeptSpent / initialDeptCap) * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">System Risk Exposure</span>
                <span className="font-bold text-emerald-400 text-sm">{initialRiskScore} / 100</span>
              </div>
            </div>

            {/* 2. ACTION */}
            <div className="bg-blue-600/15 p-3.5 rounded border border-blue-500/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="pb-2 border-b border-blue-500/30 flex justify-between items-center">
                  <span className="font-bold text-cyan-300 uppercase text-[11px]">2. PROPOSED ACTION</span>
                  <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">Disbursement</span>
                </div>
                <div className="mt-3">
                  <span className="text-slate-400 text-[10px] block">Disbursement Value</span>
                  <span className="font-bold text-cyan-300 text-base">₹{(paymentAmount / 100000).toFixed(1)} Lakhs</span>
                </div>
                <div className="mt-2 text-[10px] text-slate-300">
                  Target: <strong className="text-white">{selectedDept}</strong>
                </div>
                <div className="mt-1 text-[10px] text-slate-300">
                  Priority: <strong className="text-amber-400">{priorityLevel}</strong>
                </div>
              </div>
              <div className="pt-2 text-center text-cyan-400 font-bold text-xs flex items-center justify-center">
                Processing Simulation <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </div>

            {/* 3. AFTER STATE */}
            <div
              className={`p-3.5 rounded border space-y-3 ${
                isOverCeiling
                  ? 'bg-red-500/10 border-red-500/40'
                  : 'bg-[#151c2c] border-[#232d42]'
              }`}
            >
              <div className="pb-2 border-b border-[#232d42] flex justify-between items-center">
                <span className="font-bold text-slate-400 uppercase text-[11px]">3. AFTER STATE</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    isOverCeiling ? 'bg-red-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {isOverCeiling ? 'CAP EXCEEDED' : 'Permissible'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Remaining Balance</span>
                <span className="font-bold text-white text-sm">₹{(remainingBalanceAfter / 10000000).toFixed(2)} Cr</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">New Dept Utilization</span>
                <span className={`font-bold text-sm ${isOverCeiling ? 'text-red-400' : 'text-amber-400'}`}>
                  {newDeptUtilPct.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">New Risk Exposure</span>
                <span className="font-bold text-amber-400 text-sm">{newRiskScore} / 100</span>
              </div>
            </div>
          </div>

          {/* Decision Simulation Verdict Banner */}
          <div
            className={`p-3.5 rounded border text-xs space-y-1 ${
              isOverCeiling
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <span className="font-bold text-xs flex items-center">
              {isOverCeiling ? (
                <AlertTriangle className="h-4 w-4 mr-1.5 text-red-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" />
              )}
              Simulation Assessment Result: {isOverCeiling ? 'REJECTED — Ceiling Overrun Warning' : 'APPROVED — Safe Decision'}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isOverCeiling
                ? `Executing this payout of ₹${(paymentAmount / 100000).toFixed(1)}L will cause ${selectedDept} budget utilization to hit ${newDeptUtilPct.toFixed(1)}%, breaching statutory 100% ceiling. Reallocation required.`
                : `Executing this payout leaves ₹${(remainingBalanceAfter / 10000000).toFixed(2)} Cr in available balance. Risk exposure increases slightly by +${riskDelta} points to ${newRiskScore}/100.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
