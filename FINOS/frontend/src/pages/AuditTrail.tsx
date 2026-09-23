import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { History, Search, Filter, ShieldCheck } from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    api.getAuditTrail().then(res => setLogs(res.items || []));
  }, []);

  return (
    <div className="p-4 space-y-4 max-w-[1800px] mx-auto font-mono text-xs">
      <div className="flex justify-between items-center pb-2 border-b border-[#232d42]">
        <div>
          <h1 className="text-base font-bold uppercase text-white flex items-center">
            <History className="h-5 w-5 text-cyan-400 mr-2" /> Immutable System Audit Trail Log
          </h1>
          <p className="text-xs text-slate-400">Cryptographic audit log of every user action, agent decision and state mutation</p>
        </div>
      </div>

      <div className="finos-card overflow-x-auto">
        <table className="finos-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor (User / Agent)</th>
              <th>Action</th>
              <th>Entity Type</th>
              <th>Entity ID</th>
              <th>Previous State</th>
              <th>New State</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="text-slate-500">{l.timestamp}</td>
                <td className="font-bold text-cyan-400">{l.user_or_agent}</td>
                <td className="text-white font-bold">{l.action}</td>
                <td className="text-slate-300">{l.entity_type}</td>
                <td className="text-blue-400 font-mono">{l.entity_id || 'N/A'}</td>
                <td className="text-slate-400 truncate max-w-[120px]">{l.previous_value || 'None'}</td>
                <td className="text-emerald-300 truncate max-w-[150px]">{l.new_value || 'N/A'}</td>
                <td>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {l.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
