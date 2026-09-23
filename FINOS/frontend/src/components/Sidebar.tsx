import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, PieChart, DollarSign,
  Wallet, ArrowRightLeft, CreditCard, ShieldAlert,
  BarChart3, Cpu, Bot, FlaskConical, FileText,
  History, Server, Settings, ChevronLeft, ChevronRight,
  Activity
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Market Intelligence', path: '/market-intelligence', icon: TrendingUp },
    { name: 'Financial Overview', path: '/financial-overview', icon: PieChart },
    { name: 'Cash Flow', path: '/cash-flow', icon: DollarSign },
    { name: 'Budgets', path: '/budgets', icon: Wallet },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft, badge: '120+' },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Risk Analytics', path: '/risk-analytics', icon: ShieldAlert, alert: true },
    { name: 'Forecasting', path: '/forecasting', icon: BarChart3 },
    { name: 'AI Financial Planner', path: '/ai-planner', icon: Cpu },
    { name: 'Agent Control Center', path: '/agent-control', icon: Bot, badge: '11' },
    { name: 'Algorithm Lab', path: '/algorithm-lab', icon: FlaskConical },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'System Monitoring', path: '/system-monitoring', icon: Server },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-[#0d121d] border-r border-[#232d42] flex flex-col transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-[#232d42] flex items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider text-white">FINOS</span>
              <span className="block text-[10px] text-cyan-400 font-mono -mt-1">INTELLIGENCE</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto h-8 w-8 rounded-md bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white">
            F
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#182030] transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-[#151c2c] hover:text-slate-200'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className={`h-4 w-4 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && <span className="truncate">{item.name}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-[#182030] text-cyan-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
              {!collapsed && item.alert && (
                <span className="ml-auto h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-[#232d42] bg-[#090c13]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center">
              <span className="status-dot-live mr-2" /> WS Connected
            </span>
            <span className="text-slate-500">v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
