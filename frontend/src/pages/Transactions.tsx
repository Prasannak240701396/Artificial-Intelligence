import React, { useState } from 'react';
import { Transaction } from '../types';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';
import { ArrowRightLeft, Search, Filter, Download, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Transactions: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<Transaction[]>([
    { id: 101, transaction_code: 'TX-2026-1001', account_id: 1, department_id: 1, department_name: 'Public Works', category: 'Bridge Maintenance', counterparty: 'Apex Infrastructure Corp', amount: 4500000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 12, status: 'Completed', timestamp: '2026-09-21 18:14:02', description: 'Scheduled quarterly bridge paving and structural inspection payout.' },
    { id: 102, transaction_code: 'TX-2026-1002', account_id: 1, department_id: 2, department_name: 'Healthcare', category: 'Medical Equipment', counterparty: 'BioHealth MedTech Ltd', amount: 12500000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 28, status: 'Completed', timestamp: '2026-09-21 17:45:10', description: 'Procurement of 2 high-field MRI diagnostic scanners for municipal hospital.' },
    { id: 103, transaction_code: 'TX-2026-1003', account_id: 1, department_id: 3, department_name: 'IT & Telecom', category: 'Cloud Infrastructure', counterparty: 'CloudScale Networks Inc', amount: 880000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 8, status: 'Completed', timestamp: '2026-09-21 16:30:00', description: 'Monthly dedicated server cluster hosting and security backup.' },
    { id: 104, transaction_code: 'TX-2026-1004', account_id: 1, department_id: 4, department_name: 'Energy', category: 'Solar Grid Installation', counterparty: 'SunRay Solar Holdings', amount: 9200000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 85, status: 'Flagged', timestamp: '2026-09-21 15:10:42', description: 'Flagged by Bayesian Anomaly Engine due to price baseline deviation.' },
    { id: 105, transaction_code: 'TX-2026-1005', account_id: 1, department_id: 5, department_name: 'Treasury', category: 'Municipal Tax Inflow', counterparty: 'Commercial Tax Authority', amount: 45800000, currency: 'INR', transaction_type: 'CREDIT', risk_score: 2, status: 'Completed', timestamp: '2026-09-21 14:00:00', description: 'Direct credit of Q2 commercial property tax collection.' },
    { id: 106, transaction_code: 'TX-2026-1006', account_id: 1, department_id: 6, department_name: 'Public Transport', category: 'Fleet Maintenance', counterparty: 'Urban Transport Logistics', amount: 3100000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 14, status: 'Completed', timestamp: '2026-09-21 13:20:15', description: 'Routine brake and engine overhaul for municipal bus fleet.' },
    { id: 107, transaction_code: 'TX-2026-1007', account_id: 1, department_id: 1, department_name: 'Public Works', category: 'Water Filtration', counterparty: 'EcoWater Solutions', amount: 6400000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 92, status: 'Under Review', timestamp: '2026-09-21 12:15:00', description: 'Under Policy Agent review for duplicate invoice screening.' },
    { id: 108, transaction_code: 'TX-2026-1008', account_id: 1, department_id: 3, department_name: 'Education', category: 'School Lab Upgrade', counterparty: 'EduTech Hardware Ltd', amount: 1550000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 18, status: 'Pending', timestamp: '2026-09-21 11:05:30', description: 'Computer lab workstation upgrade for municipal high schools.' },
    { id: 109, transaction_code: 'TX-2026-1009', account_id: 1, department_id: 5, department_name: 'Treasury', category: 'State Grant Credit', counterparty: 'State Finance Ministry', amount: 25000000, currency: 'INR', transaction_type: 'CREDIT', risk_score: 1, status: 'Completed', timestamp: '2026-09-21 10:00:00', description: 'Bi-annual state infrastructure development grant allocation.' },
    { id: 110, transaction_code: 'TX-2026-1010', account_id: 1, department_id: 2, department_name: 'Healthcare', category: 'Sanitation Supplies', counterparty: 'CleanCare Products', amount: 750000, currency: 'INR', transaction_type: 'DEBIT', risk_score: 9, status: 'Completed', timestamp: '2026-09-21 09:12:44', description: 'Bulk disinfectant and PPE inventory replenishment.' },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [riskMin, setRiskMin] = useState<number>(0);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const filteredTransactions = transactionsData.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      tx.transaction_code.toLowerCase().includes(q) ||
      (tx.counterparty && tx.counterparty.toLowerCase().includes(q)) ||
      tx.category.toLowerCase().includes(q) ||
      (tx.department_name && tx.department_name.toLowerCase().includes(q));

    const matchStatus = !statusFilter || tx.status === statusFilter;
    const matchRisk = tx.risk_score >= riskMin;

    return matchSearch && matchStatus && matchRisk;
  });

  // Real CSV/Excel Blob Downloader for Transaction Ledger
  const handleExportCSV = () => {
    const header = 'Tx Code,Department,Category,Counterparty,Amount (INR),Type,Risk Score,Status,Timestamp\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.transaction_code}","${t.department_name || 'Treasury'}","${t.category}","${t.counterparty || ''}","${t.amount}","${t.transaction_type}","${t.risk_score}","${t.status}","${t.timestamp}"`
      )
      .join('\n');

    const fullContent = header + rows;
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FINOS_Transaction_Ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg(`Transaction Ledger CSV downloaded (${filteredTransactions.length} records)!`);
    setTimeout(() => setDownloadMsg(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-cyan-400" /> Financial Transaction Registry & Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Searchable ledger of all municipal and departmental financial transactions
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded flex items-center font-bold text-xs transition-colors shadow"
        >
          <Download className="h-4 w-4 mr-1.5" /> Export CSV Ledger
        </button>
      </div>

      {downloadMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-emerald-400 font-bold flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> {downloadMsg}
        </div>
      )}

      {/* Filter Controls Toolbar */}
      <div className="finos-card bg-[#111622] p-3 rounded-md flex flex-wrap items-center gap-3 border border-[#232d42]">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tx Code, Counterparty, Category, Department..."
            className="w-full bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 placeholder-slate-500 rounded pl-9 pr-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Flagged">Flagged</option>
          <option value="Under Review">Under Review</option>
        </select>

        <div className="flex items-center space-x-2 bg-[#151c2c] border border-[#232d42] px-3 py-1 rounded">
          <span className="text-slate-400 text-[11px]">Min Risk Score: {riskMin}</span>
          <input
            type="range"
            min="0"
            max="90"
            step="10"
            value={riskMin}
            onChange={(e) => setRiskMin(Number(e.target.value))}
            className="w-20 accent-blue-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="finos-card overflow-x-auto">
        <table className="finos-table">
          <thead>
            <tr>
              <th>Tx Code</th>
              <th>Department</th>
              <th>Category</th>
              <th>Counterparty</th>
              <th>Amount (₹)</th>
              <th>Type</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="cursor-pointer hover:bg-[#182338]">
                <td className="font-bold text-blue-400">{tx.transaction_code}</td>
                <td className="font-semibold text-white">{tx.department_name || 'Treasury'}</td>
                <td className="text-slate-300">{tx.category}</td>
                <td className="text-cyan-400">{tx.counterparty}</td>
                <td className="font-bold text-white">₹{tx.amount.toLocaleString()}</td>
                <td>
                  <span className={tx.transaction_type === 'CREDIT' ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                    {tx.transaction_type}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      tx.risk_score >= 70
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : tx.risk_score >= 35
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {tx.risk_score}
                  </span>
                </td>
                <td><span className="text-slate-200">{tx.status}</span></td>
                <td className="text-slate-500">{tx.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer info */}
        <div className="flex justify-between items-center pt-3 border-t border-[#232d42] mt-3 text-[11px] text-slate-400">
          <span>Showing {filteredTransactions.length} of {transactionsData.length} records</span>
          <span>Click any row to open Transaction Inspector Drawer</span>
        </div>
      </div>

      <TransactionDetailDrawer transaction={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
};
