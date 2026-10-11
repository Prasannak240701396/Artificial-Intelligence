import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { wsService } from './services/websocket';

// Pages
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardHome } from './pages/DashboardHome';
import { ProjectWorkflowPage } from './pages/ProjectWorkflowPage';
import { EmailHubPage } from './pages/EmailHubPage';
import { MarketIntelligence } from './pages/MarketIntelligence';

import { CashFlow } from './pages/CashFlow';
import { Budgets } from './pages/Budgets';
import { Transactions } from './pages/Transactions';
import { Payments } from './pages/Payments';
import { RiskAnalytics } from './pages/RiskAnalytics';
import { Forecasting } from './pages/Forecasting';
import { AIFinancialPlanner } from './pages/AIFinancialPlanner';


import { Reports } from './pages/Reports';
import { AuditTrail } from './pages/AuditTrail';
import { SystemMonitoring } from './pages/SystemMonitoring';


interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('finos_user');
    this.setState({ hasError: false, error: null });
    window.location.href = '/login';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-[#f8fafc] flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="bg-[#151c2c] border border-red-500/40 rounded-xl p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="h-12 w-12 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400 font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Application Session Error</h2>
            <p className="text-slate-400 text-xs leading-relaxed">
              A session or rendering error occurred. Please reset your session to return to the login portal.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              Reset Session & Open Login Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
});

const ProtectedRoute: React.FC<{ minLevel: number; children: React.ReactNode }> = ({ minLevel, children }) => {
  const { user } = useAuth();
  const level = user?.hierarchyLevel || 1;

  if (level < minLevel) {
    return <Navigate to="/project-workflow" replace />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const { user } = useAuth();
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

  const userLevel = user?.hierarchyLevel || 1;

  return (
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
            <Route path="/" element={<ProtectedRoute minLevel={2}><DashboardHome /></ProtectedRoute>} />
            <Route path="/project-workflow" element={<ProjectWorkflowPage />} />
            <Route path="/email-hub" element={<EmailHubPage />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/budgets" element={<ProtectedRoute minLevel={2}><Budgets /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute minLevel={2}><Transactions /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute minLevel={2}><Reports /></ProtectedRoute>} />
            <Route path="/market-intelligence" element={<ProtectedRoute minLevel={3}><MarketIntelligence /></ProtectedRoute>} />
            <Route path="/cash-flow" element={<ProtectedRoute minLevel={3}><CashFlow /></ProtectedRoute>} />
            <Route path="/risk-analytics" element={<ProtectedRoute minLevel={3}><RiskAnalytics /></ProtectedRoute>} />
            <Route path="/forecasting" element={<ProtectedRoute minLevel={3}><Forecasting /></ProtectedRoute>} />
            <Route path="/ai-planner" element={<ProtectedRoute minLevel={3}><AIFinancialPlanner /></ProtectedRoute>} />
            <Route path="/audit-trail" element={<ProtectedRoute minLevel={3}><AuditTrail /></ProtectedRoute>} />
            <Route path="/system-monitoring" element={<ProtectedRoute minLevel={3}><SystemMonitoring /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to={userLevel >= 2 ? "/" : "/project-workflow"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const RootRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const userLevel = user?.hierarchyLevel || 1;
  const defaultTarget = userLevel >= 2 ? '/' : '/project-workflow';

  return (
    <Routes>
      {/* Standalone Authentication Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to={defaultTarget} replace />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <SignUpPage /> : <Navigate to={defaultTarget} replace />}
      />

      {/* Main Application Layout (Protected) */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <RootRoutes />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
