import React from 'react';
import { Zap } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  collapsed?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'GOVT FINANCIAL INTELLIGENCE',
  collapsed = false
}) => {
  const iconSizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
    xl: 'h-16 w-16 text-xl'
  };

  const textScaleClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center space-x-3 select-none">
      {/* Unique Brand Emblem */}
      <div
        className={`relative ${iconSizeClasses[size]} rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 p-[1.5px] brand-emblem-pulse brand-emblem-glow flex-shrink-0`}
      >
        <div className="w-full h-full bg-[#0a0e1a] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle Grid overlay background */}
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px] opacity-30" />
          {/* Core Geometric Shield */}
          <div className="relative z-10 flex items-center justify-center text-cyan-300">
            <Zap className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : size === 'lg' ? 'w-6 h-6' : 'w-9 h-9'} text-cyan-300 fill-cyan-400/20`} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0e1a]" />
        </div>
      </div>

      {/* Brand Title Typography */}
      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className={`font-brand font-black tracking-tight ${textScaleClasses[size]} brand-title-gradient leading-none`}>
              FINOS
            </span>
            <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded tracking-widest uppercase">
              v2.6
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[9.5px] font-brand-alt font-bold tracking-wider text-slate-400 uppercase mt-0.5 opacity-90 truncate max-w-[200px]">
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
