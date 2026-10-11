import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { CreditCard, CheckCircle2, Clock, XCircle, Search, X, Send, Mail } from 'lucide-react';
import { generate75Payments, PaymentVoucher } from '../utils/dummyGenerator';

export const Payments: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [payments, setPayments] = useState<PaymentVoucher[]>(() => generate75Payments());
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentVoucher | null>(null);
  const [cardModalInfo, setCardModalInfo] = useState<{ title: string; count: number; items: PaymentVoucher[] } | null>(null);
  const [emailNotice, setEmailNotice] = useState<{
    voucherCode: string;
    vendorName: string;
    recipientEmail: string;
    recipientPosition: string;
    statusAction: string;
    amount: number;
  } | null>(null);

  const filteredPayments = payments.filter((p) => {
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchSearch =
      p.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.voucherCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalValue = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = payments.filter((p) => p.status === 'PENDING_APPROVAL').length;
  const approvedCount = payments.filter((p) => p.status === 'APPROVED').length;
  const rejectedCount = payments.filter((p) => p.status === 'REJECTED').length;

  // Handle Approve / Reject -> Redirects directly to Project Approval tab (/project-workflow)
  const handlePaymentAction = (payment: PaymentVoucher, newStatus: 'APPROVED' | 'REJECTED') => {
    // 1. Update Payment Status in state
    setPayments((prev) =>
      prev.map((p) => (p.id === payment.id ? { ...p, status: newStatus } : p))
    );

    // 2. Dispatch Toast & Save status notice to localStorage for Project Approval tab
    const actionLabel = newStatus === 'APPROVED' ? 'Project Approved' : 'Project Denied';
    addToast(
      actionLabel,
      `Payment Voucher ${payment.voucherCode} (${payment.projectCode}) ${newStatus === 'APPROVED' ? 'Approved & Dispatched!' : 'Rejected & Denied!'} Redirecting to Project Approval tab...`,
      newStatus === 'APPROVED' ? 'success' : 'error'
    );

    localStorage.setItem(
      'finos_last_payment_action',
      JSON.stringify({
        projectCode: payment.projectCode,
        voucherCode: payment.voucherCode,
        vendorName: payment.vendorName,
        department: payment.department,
        amount: payment.amount,
        status: newStatus,
        timestamp: new Date().toISOString()
      })
    );

    // 3. Immediately navigate to Project Approval Tab (/project-workflow)
    setTimeout(() => {
      navigate('/project-workflow');
    }, 400);
  };

  // Card click handlers
  const handleCardClick = (cardType: 'TOTAL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    if (cardType === 'TOTAL') {
      setCardModalInfo({
        title: 'All Payment Vouchers (Total Queue)',
        count: payments.length,
        items: payments,
      });
    } else if (cardType === 'PENDING') {
      setFilterStatus('PENDING_APPROVAL');
      setCardModalInfo({
        title: 'Pending Payments Awaiting Officer Authorization',
        count: pendingCount,
        items: payments.filter((p) => p.status === 'PENDING_APPROVAL'),
      });
    } else if (cardType === 'APPROVED') {
      setFilterStatus('APPROVED');
      setCardModalInfo({
        title: 'Approved Payments Dispatched to Bank',
        count: approvedCount,
        items: payments.filter((p) => p.status === 'APPROVED'),
      });
    } else if (cardType === 'REJECTED') {
      setFilterStatus('REJECTED');
      setCardModalInfo({
        title: 'Rejected Payment Vouchers',
        count: rejectedCount,
        items: payments.filter((p) => p.status === 'REJECTED'),
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
          { value: pendingCount, name: 'Pending Approval', itemStyle: { color: '#f59e0b' } },
          { value: approvedCount, name: 'Approved', itemStyle: { color: '#3b82f6' } },
          { value: rejectedCount, name: 'Rejected', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
  };

  // Weekly Disbursement Trend Chart
  const trendChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 20, right: 15, bottom: 25, left: 45 },
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
        name: 'Disbursed (₹Cr)',
        type: 'bar',
        data: [14.2, 18.5, 22.8, 28.4],
        itemStyle: { color: '#10b981' },
      },
    ],
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" /> Vendor Payment Authorization & Email Dispatch Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            75+ Payment Vouchers • Instant Email Notification Dispatched to Field Officer upon Approval/Rejection
          </p>
        </div>
      </div>

      {/* Email Dispatch Notice Toast */}
      {emailNotice && (
        <div className="bg-[#151c2c] border border-blue-500/40 rounded-lg p-4 shadow-2xl space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between border-b border-[#232d42] pb-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Official Dispatch Sent to Respective Field Officer!</span>
            </div>
            <button onClick={() => setEmailNotice(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="text-slate-300 text-[11px] leading-relaxed space-y-1">
            <div><strong>Recipient Field Officer:</strong> <span className="text-white">{emailNotice.recipientPosition}</span> ({emailNotice.recipientEmail})</div>
            <div><strong>Voucher Code:</strong> <span className="text-cyan-400 font-bold">{emailNotice.voucherCode}</span> | Vendor: {emailNotice.vendorName}</div>
            <div><strong>Action Decision:</strong> <span className={`font-extrabold ${emailNotice.statusAction === 'APPROVED' ? 'text-emerald-400' : 'text-red-400'}`}>{emailNotice.statusAction}</span> (₹{emailNotice.amount.toFixed(2)} Cr)</div>
            <div className="text-[10px] text-slate-500 pt-1">
              ✓ Email Notification Logged into Enterprise Terminal & Email Dispatch Hub.
            </div>
          </div>
        </div>
      )}

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => handleCardClick('TOTAL')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <FinancialCard title="Total Queue Value" value={`₹${totalValue.toFixed(2)} Cr`} icon={CreditCard} change={12.4} changeLabel="80 Vouchers" />
        </div>
        <div onClick={() => handleCardClick('PENDING')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <FinancialCard title="Pending Field Approval" value={`${pendingCount} Vouchers`} icon={Clock} change={-5.2} changeLabel="Awaiting Action" />
        </div>
        <div onClick={() => handleCardClick('APPROVED')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <FinancialCard title="Approved Dispatches" value={`${approvedCount} Vouchers`} icon={CheckCircle2} change={18.5} changeLabel="Dispatched" />
        </div>
        <div onClick={() => handleCardClick('REJECTED')} className="cursor-pointer transition-transform hover:scale-[1.02]">
          <FinancialCard title="Rejected Vouchers" value={`${rejectedCount} Vouchers`} icon={XCircle} change={2.1} changeLabel="Flagged / Denied" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 finos-card bg-[#151c2c] border border-[#232d42] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Payment Queue Status</span>
          </div>
          <ReactEChart option={statusChartOption} height="200px" />
        </div>

        <div className="col-span-12 lg:col-span-8 finos-card bg-[#151c2c] border border-[#232d42] p-4 rounded-md">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#232d42]">
            <span className="font-bold text-slate-200 uppercase">Weekly Disbursement Volume Trend (₹ Cr)</span>
          </div>
          <ReactEChart option={trendChartOption} height="200px" />
        </div>
      </div>

      {/* Table Toolbar: Search & Filters */}
      <div className="finos-card bg-[#111622] p-3.5 rounded-md flex flex-wrap items-center justify-between gap-3 border border-[#232d42]">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px] relative">
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 75+ Vouchers by Code, Vendor, Department, Project..."
            className="w-full bg-[#151c2c] border border-[#232d42] text-xs text-slate-200 placeholder-slate-500 rounded pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
          {(['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
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

      {/* Counter Label */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Showing <strong className="text-white">{filteredPayments.length}</strong> of <strong className="text-white">{payments.length}</strong> Payment Vouchers</span>
        <span className="text-cyan-400">Clicking Approve/Reject emails respective Field Officer instantly</span>
      </div>

      {/* Payments Table */}
      <div className="finos-card bg-[#111622] border border-[#232d42] rounded-md overflow-x-auto max-h-[700px] overflow-y-auto">
        <table className="finos-table w-full text-left font-mono">
          <thead>
            <tr className="bg-[#151c2c] border-b border-[#232d42] text-slate-400">
              <th className="p-3">Voucher Code</th>
              <th className="p-3">Project Code</th>
              <th className="p-3">Vendor / Beneficiary</th>
              <th className="p-3">Department</th>
              <th className="p-3">Amount (₹ Cr)</th>
              <th className="p-3">Field Officer Position</th>
              <th className="p-3">Due Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Officer Email Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c2638]">
            {filteredPayments.map((p) => (
              <tr key={p.id} onClick={() => setSelectedPayment(p)} className="cursor-pointer hover:bg-[#182338] transition-colors">
                <td className="p-3 font-bold text-blue-400">{p.voucherCode}</td>
                <td className="p-3 text-cyan-400 font-bold">{p.projectCode}</td>
                <td className="p-3 font-semibold text-white">{p.vendorName}</td>
                <td className="p-3 text-slate-300">{p.department}</td>
                <td className="p-3 font-extrabold text-emerald-400">₹{p.amount.toFixed(2)} Cr</td>
                <td className="p-3 text-slate-300">{p.recipientFieldOfficer}</td>
                <td className="p-3 text-slate-400">{p.dueDate}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    p.status === 'APPROVED'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      : p.status === 'REJECTED'
                      ? 'bg-red-500/20 text-red-400 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handlePaymentAction(p, 'APPROVED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-1 rounded shadow flex items-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Approve & Email</span>
                    </button>
                    <button
                      onClick={() => handlePaymentAction(p, 'REJECTED')}
                      className="bg-red-600/80 hover:bg-red-600 text-white font-bold text-[10px] px-2.5 py-1 rounded flex items-center space-x-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Reject & Email</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARDS MODAL DETAILS */}
      {cardModalInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="w-full max-w-2xl bg-[#151c2c] border border-[#232d42] rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <h3 className="font-bold text-sm text-white">{cardModalInfo.title}</h3>
                <span className="text-xs text-cyan-400 font-bold">{cardModalInfo.count} Vouchers</span>
              </div>
              <button onClick={() => setCardModalInfo(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {cardModalInfo.items.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setCardModalInfo(null);
                    setSelectedPayment(p);
                  }}
                  className="p-3 bg-[#0d121d] rounded border border-[#232d42] flex justify-between items-center cursor-pointer hover:border-blue-500/50"
                >
                  <div>
                    <span className="font-bold text-blue-400 mr-2">{p.voucherCode}</span>
                    <span className="font-bold text-white text-xs">{p.vendorName}</span>
                    <span className="block text-[10px] text-slate-400">{p.department} • Officer: {p.recipientFieldOfficer}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400 block">₹{p.amount.toFixed(2)} Cr</span>
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
                Close Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INDIVIDUAL PAYMENT DETAIL & EMAIL DISPATCH DRAWER */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-end p-4 font-mono text-xs">
          <div className="w-full max-w-md h-full bg-[#151c2c] border-l border-[#232d42] shadow-2xl p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
                <div>
                  <span className="text-xs text-blue-400 font-bold block">{selectedPayment.voucherCode} • {selectedPayment.projectCode}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedPayment.vendorName}</h3>
                </div>
                <button onClick={() => setSelectedPayment(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#0d121d] p-3 rounded border border-[#232d42]">
                  <span className="text-slate-400 text-[10px] block">Disbursement Capital</span>
                  <span className="text-xl font-bold text-emerald-400">₹{selectedPayment.amount.toFixed(2)} Cr</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0d121d] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Department</span>
                    <span className="font-semibold text-slate-200">{selectedPayment.department}</span>
                  </div>
                  <div className="bg-[#0d121d] p-2.5 rounded border border-[#232d42]">
                    <span className="text-slate-500 text-[10px] block">Due Date</span>
                    <span className="font-semibold text-slate-200">{selectedPayment.dueDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0d121d] rounded border border-[#232d42] space-y-1">
                  <span className="text-slate-400 text-[10px] block">Recipient Officer Email Target</span>
                  <div className="font-bold text-white text-xs">{selectedPayment.recipientFieldOfficer}</div>
                  <div className="text-cyan-400 text-[11px]">{selectedPayment.officerEmail}</div>
                </div>
              </div>
            </div>

            {/* Email Dispatch Buttons */}
            <div className="pt-4 border-t border-[#232d42] space-y-2">
              <span className="text-[10px] text-slate-400 uppercase block font-bold">Approve / Reject & Dispatch Email:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePaymentAction(selectedPayment, 'APPROVED')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Approve & Email</span>
                </button>
                <button
                  onClick={() => handlePaymentAction(selectedPayment, 'REJECTED')}
                  className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-2.5 rounded text-xs flex items-center justify-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject & Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
