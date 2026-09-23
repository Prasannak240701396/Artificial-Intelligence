import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, XCircle, Search, Filter, ShieldCheck, X, ArrowUpRight } from 'lucide-react';

interface PaymentRecord {
  id: string;
  beneficiary: string;
  department: string;
  category: string;
  amount: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'REJECTED';
  riskScore: number;
  financialImpact: string;
}

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([
    { id: 'PAY-9901', beneficiary: 'Apex Infrastructure Corp', department: 'Public Works', category: 'Bridge Repair', amount: 4500000, priority: 'HIGH', dueDate: '2026-09-24', status: 'PENDING', riskScore: 12, financialImpact: 'Low reserve impact (3.6% of available balance)' },
    { id: 'PAY-9902', beneficiary: 'BioHealth MedTech Ltd', department: 'Health', category: 'Medical Equipment', amount: 12500000, priority: 'CRITICAL', dueDate: '2026-09-26', status: 'PENDING', riskScore: 28, financialImpact: 'Moderate impact (10% of health budget pool)' },
    { id: 'PAY-9903', beneficiary: 'CloudScale Networks Inc', department: 'IT & Telecom', category: 'Cloud Hosting', amount: 880000, priority: 'MEDIUM', dueDate: '2026-09-29', status: 'APPROVED', riskScore: 8, financialImpact: 'Negligible impact (routine operational expenditure)' },
    { id: 'PAY-9904', beneficiary: 'SunRay Solar Holdings', department: 'Energy', category: 'Solar Grid Installation', amount: 9200000, priority: 'HIGH', dueDate: '2026-10-02', status: 'PENDING', riskScore: 85, financialImpact: 'High risk exposure — Flagged by Anomaly Engine' },
    { id: 'PAY-9905', beneficiary: 'Urban Transport Logistics', department: 'Transport', category: 'Fleet Maintenance', amount: 3100000, priority: 'LOW', dueDate: '2026-10-05', status: 'COMPLETED', riskScore: 14, financialImpact: 'Disbursed and reconciled in audit ledger' },
    { id: 'PAY-9906', beneficiary: 'EcoWater Solutions', department: 'Public Works', category: 'Water Filtration', amount: 6400000, priority: 'HIGH', dueDate: '2026-10-08', status: 'REJECTED', riskScore: 92, financialImpact: 'Duplicate invoice detected by Policy Agent' },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [cardModalInfo, setCardModalInfo] = useState<{ title: string; count: number; items: PaymentRecord[] } | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchSearch =
      p.beneficiary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalValue = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = payments.filter((p) => p.status === 'PENDING').length;
  const approvedCount = payments.filter((p) => p.status === 'APPROVED').length;
  const completedCount = payments.filter((p) => p.status === 'COMPLETED').length;

  const updateStatus = (id: string, newStatus: PaymentRecord['status']) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    if (selectedPayment && selectedPayment.id === id) {
      setSelectedPayment({ ...selectedPayment, status: newStatus });
    }
  };

  // Card click handlers for all 4 top cards
  const handleCardClick = (cardType: 'TOTAL' | 'PENDING' | 'APPROVED' | 'COMPLETED') => {
    if (cardType === 'TOTAL') {
      setCardModalInfo({
        title: 'All Payment Queue Items (Total Queue Value)',
        count: payments.length,
        items: payments,
      });
    } else if (cardType === 'PENDING') {
      setFilterStatus('PENDING');
      setCardModalInfo({
        title: 'Pending Payments Awaiting Approval',
        count: pendingCount,
        items: payments.filter((p) => p.status === 'PENDING'),
      });
    } else if (cardType === 'APPROVED') {
      setFilterStatus('APPROVED');
      setCardModalInfo({
        title: 'Approved Payments Ready for Disbursement',
        count: approvedCount,
        items: payments.filter((p) => p.status === 'APPROVED'),
      });
    } else if (cardType === 'COMPLETED') {
      setFilterStatus('COMPLETED');
      setCardModalInfo({
        title: 'Completed & Reconciled Payouts',
        count: completedCount,
        items: payments.filter((p) => p.status === 'COMPLETED'),
      });
    }
  };

  // Status Distribution Donut Chart
  const statusChartOption: EChartsOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#111622', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: pendingCount, name: 'Pending', itemStyle: { color: '#f59e0b' } },
          { value: approvedCount, name: 'Approved', itemStyle: { color: '#3b82f6' } },
          { value: completedCount, name: 'Completed', itemStyle: { color: '#10b981' } },
          { value: payments.filter((p) => p.status === 'REJECTED').length, name: 'Rejected', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
  };

  // Payment Trend Bar Chart
  const trendChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 15, bottom: 20, left: 45 },
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      {
        name: 'Disbursement Volume (₹L)',
        type: 'bar',
        data: [45.0, 125.0, 31.0, 64.0],
        itemStyle: { color: '#3b82f6' },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" /> Payment & Vendor Disbursement Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Policy-screened vendor disbursement queue, risk approval pipeline & execution sandbox
          </p>
        </div>
      </div>

      {/* 4 TOP SUMMARY CARDS — ALL CLICKABLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Payment Queue Value"
          value={`₹${(totalValue / 10000000).toFixed(2)} Cr`}
          icon={CreditCard}
          change={2.8}
          changeLabel="Total Queue"
          subtitle="Click to view all payout details →"
          onClick={() => handleCardClick('TOTAL')}
        />
        <FinancialCard
          title="Pending Payments"
          value={`${pendingCount} Payouts`}
          icon={Clock}
          change={-5.0}
          changeLabel="Awaiting Approval"
          subtitle="Click to view pending payouts →"
          onClick={() => handleCardClick('PENDING')}
        />
        <FinancialCard
          title="Approved Payments"
          value={`${approvedCount} Payouts`}
          icon={CheckCircle2}
          change={12.0}
          changeLabel="Ready for Disbursement"
          subtitle="Click to view approved payouts →"
          onClick={() => handleCardClick('APPROVED')}
        />
        <FinancialCard
          title="Completed Payouts"
          value={`${completedCount} Payouts`}
          icon={ShieldCheck}
          change={4.2}
          changeLabel="Reconciled"
          subtitle="Click to view completed payouts →"
          onClick={() => handleCardClick('COMPLETED')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Payment Status Distribution</span>
            <span className="text-[10px] text-slate-400">{payments.length} Total Records</span>
          </div>
          <ReactEChart option={statusChartOption} height="200px" />
        </div>

        <div className="col-span-12 lg:col-span-6 finos-card">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Weekly Disbursement Volume Trend (₹ Lakhs)</span>
            <span className="text-[10px] text-cyan-400">September 2026</span>
          </div>
          <ReactEChart option={trendChartOption} height="200px" />
        </div>
      </div>

      {/* Table Toolbar: Search & Filters */}
      <div className="finos-card bg-[#111622] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 border border-[#232d42]">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Payment ID, Beneficiary, Department, Category..."
            className="w-full bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 placeholder-slate-500 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
          {(['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="finos-card overflow-x-auto">
        <table className="finos-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Beneficiary</th>
              <th>Department</th>
              <th>Category</th>
              <th>Amount (₹)</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((p) => (
              <tr
                key={p.id}
                onClick={() => setSelectedPayment(p)}
                className="cursor-pointer hover:bg-[#182338] transition-colors"
              >
                <td className="font-bold text-blue-400">{p.id}</td>
                <td className="font-semibold text-white">{p.beneficiary}</td>
                <td className="text-slate-300">{p.department}</td>
                <td className="text-slate-400">{p.category}</td>
                <td className="font-bold text-white">₹{p.amount.toLocaleString()}</td>
                <td>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.priority === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : p.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    }`}
                  >
                    {p.priority}
                  </span>
                </td>
                <td className="text-slate-400">{p.dueDate}</td>
                <td>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      p.riskScore >= 70
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {p.riskScore}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : p.status === 'APPROVED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : p.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPayment(p);
                    }}
                    className="text-blue-400 hover:text-white underline text-[11px]"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOP CARDS DETAILS MODAL */}
      {cardModalInfo && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="w-full max-w-2xl bg-[#0d121d] border border-[#232d42] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <h3 className="font-bold text-sm text-white">{cardModalInfo.title}</h3>
                <span className="text-xs text-cyan-400 font-bold">{cardModalInfo.count} Records Found</span>
              </div>
              <button onClick={() => setCardModalInfo(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {cardModalInfo.items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setCardModalInfo(null);
                    setSelectedPayment(p);
                  }}
                  className="p-3 bg-[#151c2c] rounded border border-[#232d42] flex justify-between items-center cursor-pointer hover:border-blue-500/50"
                >
                  <div>
                    <span className="font-bold text-blue-400 mr-2">{p.id}</span>
                    <span className="font-bold text-white text-xs">{p.beneficiary}</span>
                    <span className="block text-[10px] text-slate-400">{p.department} • {p.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">₹{p.amount.toLocaleString()}</span>
                    <span className="text-[10px] text-amber-400 font-bold">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end">
              <button
                onClick={() => setCardModalInfo(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL PAYMENT DETAIL DRAWER */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-end p-4 font-mono">
          <div className="w-full max-w-md h-full bg-[#0d121d] border-l border-[#232d42] shadow-2xl p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
                <div>
                  <span className="text-xs text-blue-400 font-bold block">{selectedPayment.id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedPayment.beneficiary}</h3>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#151c2c] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-400 text-[10px] block">Payment Amount</span>
                  <span className="text-xl font-bold text-white">₹{selectedPayment.amount.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Department</span>
                    <span className="font-semibold text-slate-200">{selectedPayment.department}</span>
                  </div>
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Category</span>
                    <span className="font-semibold text-slate-200">{selectedPayment.category}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Priority</span>
                    <span className="font-bold text-amber-400">{selectedPayment.priority}</span>
                  </div>
                  <div className="bg-[#151c2c] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Due Date</span>
                    <span className="font-semibold text-slate-200">{selectedPayment.dueDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#151c2c] rounded border border-[#232d42] space-y-1">
                  <span className="text-slate-400 text-[10px] block">Financial Impact Assessment</span>
                  <p className="text-slate-200 text-[11px] leading-snug">{selectedPayment.financialImpact}</p>
                </div>
              </div>
            </div>

            {/* Simulated Actions */}
            <div className="pt-4 border-t border-[#232d42] space-y-2">
              <span className="text-[10px] text-slate-500 uppercase block">Simulate Payout Action</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateStatus(selectedPayment.id, 'APPROVED')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-colors text-xs"
                >
                  Approve Payout
                </button>
                <button
                  onClick={() => updateStatus(selectedPayment.id, 'REJECTED')}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 rounded transition-colors text-xs"
                >
                  Reject Payout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
