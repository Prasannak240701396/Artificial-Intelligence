import React, { useState } from 'react';
import { Bot, Play, Activity, CheckCircle2, ShieldCheck, Clock, X, Terminal, Cpu } from 'lucide-react';
import { AgentExecutionModal } from '../components/AgentExecutionModal';

interface AgentInfo {
  id: string;
  name: string;
  purpose: string;
  status: 'COMPLETED' | 'RUNNING' | 'IDLE';
  lastRun: string;
  inputData: string;
  outputData: string;
  recentActivity: string[];
}

export const AgentControlCenter: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([
    {
      id: 'AG-01',
      name: 'Monitoring Agent',
      purpose: 'Real-time state & ledger surveillance',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Current treasury ledger balances & WS live tick stream',
      outputData: 'Available balance verified = ₹8.72 Cr. Solvency ratio = 99.8%',
      recentActivity: [
        'Verified 1,240 municipal transactions against double-entry ledger invariant.',
        'Zero missing receipts flagged across all 6 active departments.',
      ],
    },
    {
      id: 'AG-02',
      name: 'Cash Flow Agent',
      purpose: 'Liquidity forecasting & 90-day cash outflow model',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Expected tax collection receivables & vendor payment queue due dates',
      outputData: '30-Day net inflow projection = +₹0.30 Cr. Zero liquidity deficit predicted.',
      recentActivity: [
        'Recalibrated exponential smoothing model with Q2 municipal tax receipts.',
        'Confirmed liquidity coverage ratio LCR at 2.45x.',
      ],
    },
    {
      id: 'AG-03',
      name: 'Risk Assessment Agent',
      purpose: 'Bayesian risk scoring & statistical anomaly detection',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Z-score deviation vectors on 120+ active transactions',
      outputData: 'Overall system risk score = 18.4 / 100 (LOW EXPOSURE).',
      recentActivity: [
        'Flagged 1 transaction exceeding 3-sigma price baseline (SunRay Solar Holdings).',
        'Updated vulnerability matrix for Public Works Department.',
      ],
    },
    {
      id: 'AG-04',
      name: 'Financial Planning Agent',
      purpose: 'Multi-departmental capital allocation & CSP backtracking solver',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Departmental budget ceilings & Minimax priority weights',
      outputData: 'Optimal capital allocation vector computed with 0 constraint breaches.',
      recentActivity: [
        'Generated BEFORE -> ACTION -> AFTER comparative breakdown for Payout PAY-9901.',
        'Calculated unencumbered contingency headroom of ₹2.70 Cr.',
      ],
    },
    {
      id: 'AG-05',
      name: 'Policy Validation Agent',
      purpose: 'Statutory compliance screening & municipal rule enforcement',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Municipal expenditure guidelines & statutory ceiling limits',
      outputData: '100% compliance verified across all approved disbursement requests.',
      recentActivity: [
        'Rejected EcoWater Solutions invoice due to duplicate billing flag.',
        'Validated two-factor authorization signatures for vendor payout queue.',
      ],
    },
    {
      id: 'AG-06',
      name: 'Payment Agent',
      purpose: 'Disbursement queue execution & sandbox settlement',
      status: 'COMPLETED',
      lastRun: new Date().toLocaleTimeString('en-US', { hour12: false }),
      inputData: 'Approved vendor disbursement queue items',
      outputData: '4 vendor payouts cleared for sandbox disbursement execution.',
      recentActivity: [
        'Executed sandbox payout PAY-9905 (₹31.0L Urban Transport Logistics).',
        'Emitted cryptographic settlement hash to Audit Trail ledger.',
      ],
    },
  ]);

  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState<boolean>(false);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" /> Agentic Finance Autonomous Control Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Specialized AI agents executing Observe-Analyze-Reason-Plan-Validate-Simulate-Verify-Audit loop
          </p>
        </div>

        <button
          onClick={() => setIsWorkflowModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-4 py-2 rounded flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Play className="h-4 w-4" />
          <span>Trigger Full Agent Workflow</span>
        </button>
      </div>

      {/* Agents Grid (6 Specialized Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((ag) => (
          <div
            key={ag.id}
            onClick={() => setSelectedAgent(ag)}
            className="finos-card bg-[#111622] border border-[#232d42] p-4 rounded-md space-y-3 cursor-pointer hover:border-blue-500/50 transition-all"
          >
            <div className="flex justify-between items-start border-b border-[#232d42] pb-2">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold block">{ag.id}</span>
                <h3 className="font-bold text-sm text-white">{ag.name}</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                {ag.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">{ag.purpose}</p>

            <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42] text-[10px] space-y-1">
              <span className="text-slate-500 block">LAST OUTPUT READOUT</span>
              <span className="text-emerald-300 font-bold block truncate">{ag.outputData}</span>
            </div>

            <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500 border-t border-[#1c2638]">
              <span>Last Run: {ag.lastRun}</span>
              <span className="text-blue-400 font-bold hover:underline">Click to View Agent Drawer →</span>
            </div>
          </div>
        ))}
      </div>

      {/* AGENT DETAIL PANEL / DRAWER */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-end p-4 font-mono">
          <div className="w-full max-w-md h-full bg-[#0d121d] border-l border-[#232d42] shadow-2xl p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
                <div>
                  <span className="text-xs text-cyan-400 font-bold block">{selectedAgent.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedAgent.name}</h3>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-500 text-[10px] block">Agent Core Purpose</span>
                  <span className="font-semibold text-slate-200">{selectedAgent.purpose}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Current Status</span>
                    <span className="font-bold text-emerald-400">{selectedAgent.status}</span>
                  </div>
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Last Execution</span>
                    <span className="font-semibold text-slate-200">{selectedAgent.lastRun}</span>
                  </div>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] space-y-1">
                  <span className="text-slate-500 text-[10px] block">Input Data Payload</span>
                  <span className="text-slate-200 text-[11px] block">{selectedAgent.inputData}</span>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] space-y-1">
                  <span className="text-slate-500 text-[10px] block">Execution Output</span>
                  <span className="text-emerald-300 font-bold text-[11px] block">{selectedAgent.outputData}</span>
                </div>

                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42] space-y-2">
                  <span className="text-slate-400 text-[10px] block font-bold">Recent Execution Log</span>
                  <ul className="list-disc list-inside text-slate-300 text-[11px] space-y-1">
                    {selectedAgent.recentActivity.map((act, i) => (
                      <li key={i}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Agent Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Execution Modal */}
      <AgentExecutionModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />
    </div>
  );
};
