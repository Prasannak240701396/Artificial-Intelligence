import React, { useState, useEffect } from 'react';
import { Search, Bell, ShieldCheck, Radio, Calendar, Clock, AlertTriangle, Bot, Play, Sparkles } from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { AgentExecutionModal } from './AgentExecutionModal';

interface TopHeaderProps {
  mode: string;
  wsConnected: boolean;
  onSearch?: (query: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ mode, wsConnected }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcut listener for search (Ctrl+K or Slash or typing F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputFocus = () => {
    setIsSearchOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  };

  return (
    <header className="h-14 bg-[#0d121d] border-b border-[#232d42] px-4 sm:px-6 flex items-center justify-between z-20 sticky top-0">
      {/* Global Search Bar */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative w-full cursor-pointer" onClick={() => setIsSearchOpen(true)}>
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            readOnly
            value={searchQuery}
            onFocus={handleInputFocus}
            onChange={handleInputChange}
            placeholder="Global Search (Press 'F' or Ctrl+K to search)..."
            className="w-full bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 placeholder-slate-500 rounded-md pl-9 pr-12 py-2 focus:outline-none focus:border-blue-500 transition-colors font-mono cursor-pointer"
          />
          <kbd className="absolute right-2.5 top-2.5 bg-[#1c2638] text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded border border-[#232d42]">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Top-Right Agent Execution Workflow Trigger Button */}
        <button
          onClick={() => setIsAgentModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-all font-mono"
          title="Trigger FINOS Autonomous Agent Workflow"
        >
          <Bot className="h-4 w-4 animate-bounce" />
          <span className="hidden sm:inline">Run Agent Workflow</span>
          <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
        </button>

        {/* Mode Indicator */}
        <div className="hidden md:flex items-center space-x-2 bg-[#151c2c] border border-[#232d42] px-3 py-1 rounded-md text-xs font-mono">
          <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">{mode || 'SIMULATION MODE'}</span>
        </div>

        {/* Date & Time */}
        <div className="hidden lg:flex items-center space-x-3 text-xs font-mono text-slate-400 bg-[#151c2c]/50 px-3 py-1 rounded border border-[#232d42]/60">
          <span className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" /> {dateStr}
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center font-bold text-slate-200">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-cyan-400" /> {timeStr}
          </span>
        </div>

        {/* Connection status */}
        <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400" title="Live Simulation Status">
          <span className="status-dot-live" />
          <span className="hidden sm:inline">LIVE STREAM</span>
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#182030] relative transition-colors"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          {/* Notifications Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111622] border border-[#232d42] rounded-md shadow-2xl z-50 p-3 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-[#232d42]">
                <span className="font-semibold text-slate-200">System Notifications</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">3 New</span>
              </div>
              <div className="divide-y divide-[#1c2638] max-h-64 overflow-y-auto">
                <div className="py-2.5">
                  <div className="flex items-center text-amber-400 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Liquidity Threshold Alert
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Municipal reserve exceeded 90% utilization threshold.</p>
                  <span className="text-[10px] text-slate-500">18:14:02</span>
                </div>
                <div className="py-2.5">
                  <div className="flex items-center text-blue-400 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Agent Cycle Complete
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">Policy Agent validated Q3 expenditure line items.</p>
                  <span className="text-[10px] text-slate-500">18:10:45</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-[#232d42]">
          <div className="h-7 w-7 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 text-xs font-bold font-mono">
            FA
          </div>
          <div className="hidden xl:block text-left text-xs font-mono">
            <span className="block font-medium text-slate-200 leading-tight">Chief Auditor</span>
            <span className="block text-[10px] text-slate-500">FINOS ADMIN</span>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
      />

      {/* Agent Workflow Execution Modal */}
      <AgentExecutionModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
      />
    </header>
  );
};
