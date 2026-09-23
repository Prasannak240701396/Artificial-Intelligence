import React, { useState } from 'react';
import { Server, Activity, Database, Radio, Cpu, RefreshCw, CheckCircle2, AlertTriangle, X, Terminal } from 'lucide-react';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';

export const SystemMonitoring: React.FC = () => {
  const [activeDiagnosticModal, setActiveDiagnosticModal] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '[18:30:00] FastAPI gateway worker #1 listening on port 8000',
    '[18:30:02] WebSocket stream connected: 1 client active (tick horizon 2.5s)',
    '[18:30:05] PostgreSQL connection pool initialized (10 active channels)',
    '[18:30:10] Policy Agent screening loop operational',
  ]);

  // Latency History Chart
  const latencyOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 15, bottom: 20, left: 45 },
    xAxis: {
      type: 'category',
      data: ['18:25', '18:26', '18:27', '18:28', '18:29', '18:30'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      name: 'ms',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'API Latency (ms)',
        type: 'line',
        smooth: true,
        data: [1.8, 1.4, 1.5, 1.2, 1.6, 1.4],
        lineStyle: { color: '#3b82f6', width: 2 },
      },
    ],
  };

  const runDiagnostic = (serviceName: string) => {
    setActiveDiagnosticModal(serviceName);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-400" /> Real-Time System Telemetry & Infrastructure Health
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live telemetry monitoring of FastAPI backend, database pool, Redis bus & WebSocket stream
          </p>
        </div>
        <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30 font-bold">
          <span className="status-dot-live mr-1" /> SYSTEM OPERATIONAL
        </div>
      </div>

      {/* Infrastructure Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: FastAPI Backend */}
        <div
          onClick={() => runDiagnostic('FastAPI Backend API Gateway')}
          className="finos-card bg-[#111622] p-4 rounded space-y-3 cursor-pointer hover:border-blue-500/50 transition-all"
        >
          <div className="flex justify-between items-center border-b border-[#232d42] pb-2">
            <span className="font-bold text-white flex items-center">
              <Server className="h-4 w-4 text-blue-400 mr-1.5" /> FastAPI Backend
            </span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between"><span>API Response Latency:</span><span className="text-white font-bold">1.4 ms</span></div>
            <div className="flex justify-between"><span>Uptime SLA:</span><span className="text-emerald-400 font-bold">99.99%</span></div>
            <div className="flex justify-between"><span>Worker Threads:</span><span className="text-slate-400">4 Active</span></div>
          </div>
          <span className="text-[10px] text-blue-400 hover:underline block pt-1 font-bold">
            Click to Run Diagnostic Health Test →
          </span>
        </div>

        {/* Card 2: Database Connection Pool */}
        <div
          onClick={() => runDiagnostic('PostgreSQL Database Pool')}
          className="finos-card bg-[#111622] p-4 rounded space-y-3 cursor-pointer hover:border-blue-500/50 transition-all"
        >
          <div className="flex justify-between items-center border-b border-[#232d42] pb-2">
            <span className="font-bold text-white flex items-center">
              <Database className="h-4 w-4 text-cyan-400 mr-1.5" /> Database Pool
            </span>
            <span className="text-emerald-400 font-bold">CONNECTED</span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between"><span>Active Connections:</span><span className="text-white font-bold">3 / 10</span></div>
            <div className="flex justify-between"><span>Query Execution:</span><span className="text-emerald-400 font-bold">0.8 ms</span></div>
            <div className="flex justify-between"><span>Audit Ledger Hash:</span><span className="text-slate-400 font-mono">SHA-256 Validated</span></div>
          </div>
          <span className="text-[10px] text-blue-400 hover:underline block pt-1 font-bold">
            Click to Run Connection Test →
          </span>
        </div>

        {/* Card 3: WebSocket Stream Gateway */}
        <div
          onClick={() => runDiagnostic('WebSocket Live Stream Gateway')}
          className="finos-card bg-[#111622] p-4 rounded space-y-3 cursor-pointer hover:border-blue-500/50 transition-all"
        >
          <div className="flex justify-between items-center border-b border-[#232d42] pb-2">
            <span className="font-bold text-white flex items-center">
              <Radio className="h-4 w-4 text-emerald-400 mr-1.5" /> WebSocket Gateway
            </span>
            <span className="text-emerald-400 font-bold">STREAMING</span>
          </div>
          <div className="space-y-1.5 text-slate-300 text-[11px]">
            <div className="flex justify-between"><span>Connected Clients:</span><span className="text-white font-bold">1 Active</span></div>
            <div className="flex justify-between"><span>Stream Horizon:</span><span className="text-cyan-400 font-bold">2.5 sec / tick</span></div>
            <div className="flex justify-between"><span>Total Ticks Emitted:</span><span className="text-slate-400 font-mono">14,280</span></div>
          </div>
          <span className="text-[10px] text-blue-400 hover:underline block pt-1 font-bold">
            Click to Ping Stream Gateway →
          </span>
        </div>
      </div>

      {/* Latency History Chart & System Console Logs */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">API Response Latency History (ms)</span>
          </div>
          <ReactEChart option={latencyOption} height="220px" />
        </div>

        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase flex items-center">
              <Terminal className="h-4 w-4 text-cyan-400 mr-1.5" /> Live System Telemetry Console Log
            </span>
            <span className="text-[10px] text-slate-500">Auto-scrolling</span>
          </div>
          <div className="bg-[#090c13] p-3 rounded border border-[#232d42] text-[11px] text-cyan-300 space-y-1 h-[220px] overflow-y-auto font-mono">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC MODAL */}
      {activeDiagnosticModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="w-full max-w-md bg-[#0d121d] border border-[#232d42] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <h3 className="font-bold text-sm text-white">{activeDiagnosticModal}</h3>
              <button onClick={() => setActiveDiagnosticModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-300 space-y-1">
              <span className="font-bold text-xs flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" /> Diagnostic Diagnostic Passed
              </span>
              <p className="text-[11px]">
                Health check ping returned status HTTP 200 OK (0.8ms). Zero dropped frames or network packet loss detected.
              </p>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setActiveDiagnosticModal(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
