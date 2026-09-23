import React from 'react';
import { Transaction } from '../types';
import { X, ShieldAlert, CheckCircle2, Clock, Building2, UserCheck, Activity, AlertTriangle } from 'lucide-react';

interface TransactionDetailDrawerProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailDrawer: React.FC<TransactionDetailDrawerProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isHighRisk = transaction.risk_score >= 70;
  const isMediumRisk = transaction.risk_score >= 35 && transaction.risk_score < 70;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#111622] border-l border-[#232d42] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#232d42] flex justify-between items-center bg-[#0d121d]">
          <div>
            <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider block">Transaction Intelligence Inspector</span>
            <h3 className="text-sm font-bold font-mono text-white mt-0.5">{transaction.transaction_code}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#182030]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
          {/* Status & Risk Banner */}
          <div className="bg-[#182030] p-3 rounded-md border border-[#232d42] flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] block">Execution Amount</span>
              <span className="text-lg font-bold text-white">
                ${transaction.amount.toLocaleString()} {transaction.currency}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] block">Risk Score</span>
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded ${
                  isHighRisk
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                    : isMediumRisk
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {transaction.risk_score} / 100
              </span>
            </div>
          </div>

          {/* Anomaly Reason Warning */}
          {transaction.anomaly_reason && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-md text-amber-300 space-y-1">
              <div className="flex items-center font-bold text-[11px]">
                <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-400" /> Risk & Anomaly Reason
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">{transaction.anomaly_reason}</p>
            </div>
          )}

          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#151c2c] p-3 rounded-md border border-[#232d42]">
            <div>
              <span className="text-[10px] text-slate-500 block">Department</span>
              <span className="text-slate-200 font-semibold">{transaction.department_name || 'Department'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Category</span>
              <span className="text-slate-200 font-semibold">{transaction.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Counterparty</span>
              <span className="text-cyan-400 font-semibold">{transaction.counterparty || 'Treasury Vendor'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Status</span>
              <span className="text-slate-200 font-semibold">{transaction.status}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-slate-500 block">Timestamp</span>
              <span className="text-slate-300">{transaction.timestamp}</span>
            </div>
          </div>

          {/* Agent Analysis Note */}
          <div className="bg-[#151c2c] p-3 rounded-md border border-[#232d42] space-y-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center">
              <Activity className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> Autonomous Agent Analysis
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Risk Detection Agent evaluated transaction against Z-Score statistical baseline (3.2 std deviations) and isolation forest model. Recommendation: Maintain under elevated compliance monitoring.
            </p>
          </div>

          {/* Audit History Timeline */}
          <div className="bg-[#151c2c] p-3 rounded-md border border-[#232d42] space-y-2">
            <span className="text-[11px] font-bold text-slate-300 flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5 text-cyan-400" /> Audit Provenance Log
            </span>
            <div className="space-y-2 text-[10px] text-slate-400">
              <div className="flex justify-between pb-1 border-b border-[#232d42]">
                <span>18:12:04 - Ingested by Gateway</span>
                <span className="text-emerald-400">VERIFIED</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-[#232d42]">
                <span>18:12:05 - Policy Rule_001 Evaluation</span>
                <span className="text-amber-400">FLAGGED</span>
              </div>
              <div className="flex justify-between">
                <span>18:12:06 - Risk Score Calculated (87.2)</span>
                <span className="text-blue-400">PROCESSED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#232d42] bg-[#0d121d] flex space-x-2">
          <button
            onClick={onClose}
            className="flex-1 bg-[#182030] hover:bg-[#232d42] text-slate-300 py-1.5 rounded text-xs font-mono transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
