import React, { useState } from 'react';
import { Transaction } from '../types';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';
import { ArrowRightLeft, Search, Filter, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { generate75Transactions, generate1000TransactionsCSV } from '../utils/dummyGenerator';

export const Transactions: React.FC = () => {
  const [transactionsData, setTransactionsData] = useState<Transaction[]>(() => generate75Transactions());
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

  // Export 1000+ Transactions CSV
  const handleExportCSV1000 = () => {
    const csvContent = generate1000TransactionsCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `FINOS_Enterprise_Transactions_1000Rows_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadMsg(`1000+ Transactions CSV File downloaded successfully! (Contains 1,050 full records).`);
    setTimeout(() => setDownloadMsg(null), 4000);
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
            Institutional ledger of departmental vouchers and 1000+ exportable transaction audit logs
          </p>
        </div>
        <button
          onClick={handleExportCSV1000}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center font-bold text-xs transition-colors shadow-lg"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-cyan-300" /> Export CSV (1000+ Transactions)
        </button>
      </div>

      {downloadMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-emerald-400 font-bold flex items-center shadow-md">
          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400 flex-shrink-0" /> {downloadMsg}
        </div>
      )}

      {/* Filter Controls Toolbar */}
      <div className="finos-card bg-[#111622] p-3.5 rounded-md flex flex-wrap items-center gap-3 border border-[#232d42]">
        {/* Search Input */}
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

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
        >
          <option value="">All Statuses ({transactionsData.length})</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Flagged">Flagged</option>
          <option value="Under Review">Under Review</option>
        </select>

        {/* Manual Number Entry for Min Risk Score */}
        <div className="flex items-center space-x-2 bg-[#151c2c] border border-[#232d42] px-3 py-1.5 rounded">
          <label className="text-slate-300 text-[11px] font-bold uppercase">Min Risk Score:</label>
          <input
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={riskMin === 0 ? '' : riskMin}
            onChange={(e) => {
              const val = e.target.value === '' ? 0 : Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
              setRiskMin(val);
            }}
            className="w-20 px-2 py-1 bg-[#0d121d] border border-[#232d42] rounded text-white text-xs font-mono focus:outline-none focus:border-blue-500"
          />
          {riskMin > 0 && (
            <button
              onClick={() => setRiskMin(0)}
              className="text-[10px] text-slate-400 hover:text-white underline ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Counter Label */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Showing <strong className="text-white">{filteredTransactions.length}</strong> of <strong className="text-white">{transactionsData.length}</strong> Transactions</span>
        <span className="text-cyan-400">Export button downloads full 1,000+ item CSV dataset</span>
      </div>

      {/* Transactions Table */}
      <div className="finos-card bg-[#111622] border border-[#232d42] rounded-md overflow-x-auto max-h-[700px] overflow-y-auto">
        <table className="finos-table w-full text-left font-mono">
          <thead>
            <tr className="bg-[#151c2c] border-b border-[#232d42] text-slate-400">
              <th className="p-3">Tx Code</th>
              <th className="p-3">Department</th>
              <th className="p-3">Category</th>
              <th className="p-3">Counterparty</th>
              <th className="p-3">Amount (₹)</th>
              <th className="p-3">Type</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Status</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2638]">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} onClick={() => setSelectedTx(tx)} className="cursor-pointer hover:bg-[#182338] transition-colors">
                <td className="p-3 font-bold text-blue-400">{tx.transaction_code}</td>
                <td className="p-3 font-semibold text-white">{tx.department_name || 'Treasury'}</td>
                <td className="p-3 text-slate-300">{tx.category}</td>
                <td className="p-3 text-slate-300">{tx.counterparty}</td>
                <td className={`p-3 font-extrabold ${tx.transaction_type === 'CREDIT' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  ₹{tx.amount.toLocaleString()}
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    tx.transaction_type === 'CREDIT'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {tx.transaction_type}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    tx.risk_score > 35
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : tx.risk_score > 20
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {tx.risk_score}/100
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    tx.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : tx.status === 'Flagged'
                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-3 text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTx && (
        <TransactionDetailDrawer transaction={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
};
