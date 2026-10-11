import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, DollarSign, Wallet, ArrowRightLeft, CreditCard, ShieldAlert, BarChart3, Cpu, FileText, Server, ChevronLeft, ChevronRight, Building2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const roleLevel = user?.hierarchyLevel || 1;

  const allNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, minLevel: 2 },
    { name: 'Project Approvals', path: '/project-workflow', icon: Building2, badge: 'PIPELINE', minLevel: 1 },
    { name: 'Email Dispatch Hub', path: '/email-hub', icon: Mail, badge: 'LOGS', minLevel: 1 },
    { name: 'Market Intelligence', path: '/market-intelligence', icon: TrendingUp, minLevel: 3 },
    { name: 'Cash Flow', path: '/cash-flow', icon: DollarSign, minLevel: 3 },
    { name: 'Budgets', path: '/budgets', icon: Wallet, minLevel: 2 },
    { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft, badge: '1000+', minLevel: 2 },
    { name: 'Payments', path: '/payments', icon: CreditCard, minLevel: 1 },
    { name: 'Risk Analytics', path: '/risk-analytics', icon: ShieldAlert, alert: true, minLevel: 3 },
    { name: 'Forecasting', path: '/forecasting', icon: BarChart3, minLevel: 3 },
    { name: 'AI Financial Planner', path: '/ai-planner', icon: Cpu, minLevel: 3 },
    { name: 'Reports', path: '/reports', icon: FileText, badge: '60+', minLevel: 2 },
    { name: 'System Monitoring', path: '/system-monitoring', icon: Server, minLevel: 3 },
  ];

  const navItems = allNavItems.filter((item) => roleLevel >= item.minLevel);

  const subRoleText =
    user?.role === 'CEO' ? 'GOVT EXECUTIVE' : user?.role === 'DIRECTOR' ? 'DIRECTORATE' : 'GOVT OPERATIONS';

  return (
    <aside
      className={`bg-[#0d121d] border-r border-[#232d42] flex flex-col transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-[#232d42] flex items-center justify-between px-3.5 font-mono">
        <BrandLogo size="md" collapsed={collapsed} subtitleText={subRoleText} />
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#182030] transition-colors ml-1 flex-shrink-0"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!collapsed && user && (
        <div className="px-3 py-2 bg-[#080c14] border-b border-[#232d42] text-[10px] font-mono">
          <div className="text-slate-400 font-bold uppercase">Role Permission Scope:</div>
          <div className="text-cyan-400 font-bold truncate">{user.roleTitle}</div>
          <div className="text-slate-500 text-[9px]">Hierarchy Level {user.hierarchyLevel} • {navItems.length} Modules Active</div>
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 font-mono">
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

      {/* Footer Logout & System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-[#232d42] bg-[#090c13]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center">
              <span className="status-dot-live mr-2" /> Live RBAC Token
            </span>
            <span className="text-slate-500">v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  );
};
