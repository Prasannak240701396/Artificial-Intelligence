import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { wsService } from './services/websocket';

// Pages
import { DashboardHome } from './pages/DashboardHome';
import { MarketIntelligence } from './pages/MarketIntelligence';
import { FinancialOverview } from './pages/FinancialOverview';
import { CashFlow } from './pages/CashFlow';
import { Budgets } from './pages/Budgets';
import { Transactions } from './pages/Transactions';
import { Payments } from './pages/Payments';
import { RiskAnalytics } from './pages/RiskAnalytics';
import { Forecasting } from './pages/Forecasting';
import { AIFinancialPlanner } from './pages/AIFinancialPlanner';
import { AgentControlCenter } from './pages/AgentControlCenter';
import { AlgorithmLab } from './pages/AlgorithmLab';
import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';
import { SystemMonitoring } from './pages/SystemMonitoring';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [marketMode, setMarketMode] = useState<string>('SIMULATION MODE');

  useEffect(() => {
    wsService.connect();
    const unsubscribe = wsService.subscribe((data) => {
      if (data.type === 'STATUS') {
        setWsConnected(data.connected);
      } else if (data.mode) {
        setMarketMode(data.mode);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-[#0a0d14] text-[#f8fafc] overflow-hidden">
          {/* Collapsible Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

          {/* Main Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Top Header */}
            <TopHeader mode={marketMode} wsConnected={wsConnected} />

            {/* Scrollable Page Body */}
            <main className="flex-1 overflow-y-auto bg-[#0a0d14]">
              <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/market-intelligence" element={<MarketIntelligence />} />
                <Route path="/financial-overview" element={<FinancialOverview />} />
                <Route path="/cash-flow" element={<CashFlow />} />
                <Route path="/budgets" element={<Budgets />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/risk-analytics" element={<RiskAnalytics />} />
                <Route path="/forecasting" element={<Forecasting />} />
                <Route path="/ai-planner" element={<AIFinancialPlanner />} />
                <Route path="/agent-control" element={<AgentControlCenter />} />
                <Route path="/algorithm-lab" element={<AlgorithmLab />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/system-monitoring" element={<SystemMonitoring />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
