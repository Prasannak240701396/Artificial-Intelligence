import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft, X, LayoutDashboard, PieChart, DollarSign, Wallet, CreditCard, ShieldAlert, BarChart3, Cpu, Bot, FlaskConical, FileText, History, Server, Settings } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Feature' | 'Data';
  path: string;
  description: string;
  icon?: any;
}

const SEARCH_INDEX: SearchItem[] = [
  { id: '1', title: 'Dashboard', category: 'Navigation', path: '/', description: 'Executive command center, portfolio metrics & market charts', icon: LayoutDashboard },
  { id: '2', title: 'Financial Overview', category: 'Navigation', path: '/financial-overview', description: 'Institutional capital balance sheet, asset allocations & live ticks', icon: PieChart },
  { id: '3', title: 'Financial Risk', category: 'Navigation', path: '/risk-analytics', description: 'Bayesian risk engine, anomaly scatter plots & mitigation drawers', icon: ShieldAlert },
  { id: '4', title: 'Financial Planning', category: 'Navigation', path: '/ai-planner', description: 'Financial decision simulator (BEFORE vs AFTER analysis)', icon: Cpu },
  { id: '5', title: 'Financial Reports', category: 'Navigation', path: '/reports', description: 'Audit statements, financial summaries & CSV export generator', icon: FileText },
  { id: '6', title: 'Cash Flow', category: 'Navigation', path: '/cash-flow', description: 'Liquidity trend tracking, inflow/outflow forecast & status', icon: DollarSign },
  { id: '7', title: 'Budgets', category: 'Navigation', path: '/budgets', description: 'Departmental budget ceilings, utilization & allocation breakdown', icon: Wallet },
  { id: '8', title: 'Payments', category: 'Navigation', path: '/payments', description: 'Vendor disbursement queue, status distribution & payment drawer', icon: CreditCard },
  { id: '9', title: 'Transactions', category: 'Navigation', path: '/transactions', description: 'Searchable ledger of all financial transactions & audit logs', icon: LayoutDashboard },
  { id: '10', title: 'Agent Control Center', category: 'Navigation', path: '/agent-control', description: 'Autonomous agent monitoring, execution logs & workflow trigger', icon: Bot },
  { id: '11', title: 'Market Intelligence', category: 'Navigation', path: '/market-intelligence', description: 'Macro correlations, orderbook depth & market surveillance', icon: BarChart3 },
  { id: '12', title: 'Forecasting', category: 'Navigation', path: '/forecasting', description: 'Time-series regression models, confidence bounds & projections', icon: BarChart3 },
  { id: '13', title: 'Algorithm Lab', category: 'Navigation', path: '/algorithm-lab', description: 'Academic financial algorithms, CSP backtracking & A* search', icon: FlaskConical },
  { id: '15', title: 'System Monitoring', category: 'Navigation', path: '/system-monitoring', description: 'FastAPI telemetry, database pool status & latency metrics', icon: Server },
  { id: '16', title: 'Settings', category: 'Navigation', path: '/settings', description: 'Simulation mode, risk thresholds & provider configuration', icon: Settings },
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredResults = SEARCH_INDEX.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleSelect = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4">
      <div
        className="w-full max-w-2xl bg-[#0d121d] border border-[#232d42] rounded-lg shadow-2xl overflow-hidden font-mono text-xs flex flex-col"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#232d42] bg-[#111622]">
          <Search className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type 'F' or search pages, risk models, reports..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-slate-300 mr-2">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-[#1c2638]">
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No matching FINOS navigation or feature found for "<span className="text-slate-300">{query}</span>"
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = item.icon || LayoutDashboard;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-white border border-blue-500/40'
                      : 'hover:bg-[#151c2c] text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2 rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-[#182030] text-slate-400'}`}>
                      <Icon className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs flex items-center gap-2 text-white">
                        <span>{item.title}</span>
                        <span className="text-[9px] bg-[#1c2638] text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                          {item.path}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">{item.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-500 ml-2">
                    {isSelected && <CornerDownLeft className="h-3.5 w-3.5 text-blue-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 py-2 bg-[#090c13] border-t border-[#232d42] flex justify-between items-center text-[10px] text-slate-500">
          <div className="flex items-center space-x-3">
            <span><kbd className="bg-[#1c2638] px-1 rounded text-slate-300">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-[#1c2638] px-1 rounded text-slate-300">↵</kbd> Select</span>
            <span><kbd className="bg-[#1c2638] px-1 rounded text-slate-300">ESC</kbd> Close</span>
          </div>
          <span>FINOS Instant Navigation Index</span>
        </div>
      </div>
    </div>
  );
};
