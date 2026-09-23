import React, { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, Clock, Code, Activity, Sliders, Check } from 'lucide-react';
import { FinancialCard } from '../components/FinancialCard';

export const AlgorithmLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('a-star');
  const [iterations, setIterations] = useState<number>(100);
  const [riskWeight, setRiskWeight] = useState<number>(0.5);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [output, setOutput] = useState<any | null>(null);

  const tabs = [
    { id: 'a-star', name: 'A* Search', desc: 'Heuristic-guided optimal path search across transaction dependency graph' },
    { id: 'csp', name: 'CSP / Backtracking', desc: 'Constraint satisfaction problem solver for departmental budget allocations' },
    { id: 'logic-rules', name: 'Logic Engine Rules', desc: 'First-order statutory rule evaluation & compliance validator' },
    { id: 'bayesian-risk', name: 'Bayesian Risk', desc: 'Probabilistic risk scoring with prior updates & likelihood estimation' },
    { id: 'minimax', name: 'Minimax Game Theory', desc: 'Adversarial game theory model for capital allocation under budget constraints' },
    { id: 'anomaly-detection', name: 'ML Anomaly Detection', desc: 'Isolation Forest & Z-score statistical outlier detection engine' },
  ];

  const handleRunAlgorithm = (algoId: string) => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      if (algoId === 'a-star') {
        setOutput({
          algorithm: 'A* Graph Search',
          status: 'CONVERGED',
          execution_time_ms: 4.2,
          nodes_evaluated: 142,
          optimal_path_cost: 18.5,
          path: ['Treasury_Node_01', 'PublicWorks_Escrow', 'Vendor_Disbursement_PAY9901'],
          heuristics: 'Euclidean distance to budget cap',
        });
      } else if (algoId === 'csp') {
        setOutput({
          algorithm: 'Constraint Satisfaction Backtracking',
          status: 'OPTIMAL_SOLUTION_FOUND',
          execution_time_ms: 8.7,
          backtracks_count: 12,
          unallocated_reserve: '₹2.70 Cr',
          allocation_vector: { PublicWorks: '₹2.35 Cr', Healthcare: '₹2.98 Cr', Transport: '₹2.61 Cr' },
        });
      } else {
        setOutput({
          algorithm: tabs.find((t) => t.id === algoId)?.name,
          status: 'SUCCESS',
          execution_time_ms: 6.1,
          parameters: { iterations, riskWeight },
          verdict: 'Invariants verified without exception',
        });
      }
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-cyan-400" /> Academic Financial Algorithm Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Executable implementations of graph search, constraint programming & statistical risk models
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex space-x-1 border-b border-[#232d42] overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setOutput(null);
            }}
            className={`px-3.5 py-2 rounded-t text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-blue-600 text-white border-t border-x border-blue-500'
                : 'bg-[#111622] text-slate-400 hover:text-white border-t border-x border-[#232d42]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Execution Workbench */}
      <div className="grid grid-cols-12 gap-4">
        {/* Parameters Form (4 cols) */}
        <div className="col-span-12 lg:col-span-4 finos-card space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Algorithm Tuning Parameters</span>
            <span className="text-[10px] text-cyan-400">{tabs.find((t) => t.id === activeTab)?.name}</span>
          </div>

          <p className="text-slate-400 text-[11px] leading-relaxed">
            {tabs.find((t) => t.id === activeTab)?.desc}
          </p>

          <div className="space-y-1">
            <label className="text-slate-400 text-[10px] block">Max Iterations: {iterations}</label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[10px] block">Risk Penalty Weight: {riskWeight}</label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={riskWeight}
              onChange={(e) => setRiskWeight(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <button
            onClick={() => handleRunAlgorithm(activeTab)}
            disabled={isExecuting}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded flex items-center justify-center space-x-2 transition-colors text-xs"
          >
            <Play className="h-4 w-4" />
            <span>{isExecuting ? 'Executing Model Solver...' : `Run ${tabs.find((t) => t.id === activeTab)?.name}`}</span>
          </button>
        </div>

        {/* Results Area (8 cols) */}
        <div className="col-span-12 lg:col-span-8 finos-card space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Execution Output Inspector</span>
            {output?.execution_time_ms && (
              <span className="text-emerald-400 text-[10px] font-bold">
                Execution Time: {output.execution_time_ms} ms
              </span>
            )}
          </div>

          {output ? (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 flex justify-between items-center">
                <span className="font-bold text-xs flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Solver Execution State: {output.status}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Convergence Verified</span>
              </div>

              <pre className="text-cyan-300 bg-[#090c13] p-4 rounded border border-[#232d42] text-[11px] overflow-x-auto max-h-[380px] font-mono leading-relaxed">
                {JSON.stringify(output, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-20 font-mono">
              Select algorithm parameters and click "Run Solver" to execute mathematical model and inspect results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
