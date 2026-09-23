import React, { useState, useEffect } from 'react';
import { Bot, CheckCircle2, Loader2, Play, ShieldCheck, X, Zap } from 'lucide-react';

interface AgentExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentStep {
  name: string;
  role: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED';
  output: string;
}

export const AgentExecutionModal: React.FC<AgentExecutionModalProps> = ({ isOpen, onClose }) => {
  const [steps, setSteps] = useState<AgentStep[]>([
    { name: 'Monitoring Agent', role: 'Real-time state & ledger surveillance', status: 'IDLE', output: 'Available balance verified: ₹12.48 Cr' },
    { name: 'Planning Agent', role: 'Multi-departmental capital allocation', status: 'IDLE', output: 'Optimal allocation vector generated' },
    { name: 'Risk Assessment Agent', role: 'Bayesian Z-score & anomaly detection', status: 'IDLE', output: 'Overall risk score calculated: 18.4 (LOW)' },
    { name: 'Policy Validation Agent', role: 'Municipal rule & statutory ceiling check', status: 'IDLE', output: '100% compliance verified across all line items' },
    { name: 'Payment Execution Agent', role: 'Disbursement queue validation & audit', status: 'IDLE', output: '4 pending payouts approved for sandbox release' },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'IDLE' })));
      setCurrentStepIndex(0);
      setIsFinished(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || currentStepIndex < 0 || currentStepIndex >= steps.length) return;

    // Set current step to RUNNING
    setSteps((prev) =>
      prev.map((s, idx) => (idx === currentStepIndex ? { ...s, status: 'RUNNING' } : s))
    );

    const timer = setTimeout(() => {
      // Set current step to COMPLETED
      setSteps((prev) =>
        prev.map((s, idx) => (idx === currentStepIndex ? { ...s, status: 'COMPLETED' } : s))
      );

      if (currentStepIndex + 1 < steps.length) {
        setCurrentStepIndex(currentStepIndex + 1);
      } else {
        setIsFinished(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#0d121d] border border-[#232d42] rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#111622] border-b border-[#232d42]">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">FINOS Agent Workflow Execution</h3>
              <span className="text-[10px] text-cyan-400">Autonomous Multi-Agent Cycle</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1c2638]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Banner */}
        <div className="p-4 bg-[#151c2c] border-b border-[#232d42]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-200">
              {isFinished ? 'FINOS Agent Workflow Completed' : 'Executing Autonomous Agents Pipeline...'}
            </span>
            <span className="text-cyan-400 font-bold">
              {isFinished ? '100%' : `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%`}
            </span>
          </div>

          <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
              style={{
                width: isFinished
                  ? '100%'
                  : `${Math.round(((currentStepIndex + 1) / steps.length) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Agent Steps Timeline */}
        <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto">
          {steps.map((step, idx) => {
            const isIdle = step.status === 'IDLE';
            const isRunning = step.status === 'RUNNING';
            const isDone = step.status === 'COMPLETED';

            return (
              <div
                key={step.name}
                className={`p-3 rounded-md border transition-all ${
                  isRunning
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md'
                    : isDone
                    ? 'bg-[#111622] border-[#232d42]'
                    : 'bg-[#090c13] border-[#1c2638] opacity-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 text-cyan-400 animate-spin flex-shrink-0" />
                    ) : isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-600 flex-shrink-0" />
                    )}
                    <span className={`font-bold text-xs ${isDone ? 'text-white' : isRunning ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {step.name}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      isRunning
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#1c2638] text-slate-500'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 ml-6">{step.role}</p>

                {isDone && (
                  <div className="mt-2 ml-6 p-2 bg-[#151c2c] rounded border border-[#232d42] text-[10px] text-emerald-300 font-mono">
                    Output: {step.output}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-[#111622] border-t border-[#232d42] flex justify-between items-center">
          {isFinished ? (
            <div className="text-emerald-400 font-bold flex items-center text-xs">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-emerald-400" />
              Analysis Complete — All system state invariants verified.
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">Simulating Agent Orchestration Workflow...</span>
          )}

          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded font-bold transition-colors text-xs ${
              isFinished
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-[#1c2638] text-slate-300 hover:text-white'
            }`}
          >
            {isFinished ? 'Close Window' : 'Cancel Run'}
          </button>
        </div>
      </div>
    </div>
  );
};
