import React, { useState } from 'react';
import { FinancialCard } from '../components/FinancialCard';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { FileText, Download, Eye, Filter, Search, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  category: 'FINANCIAL' | 'RISK' | 'AUDIT' | 'BUDGET';
  period: string;
  generatedDate: string;
  status: 'VERIFIED' | 'DRAFT' | 'PENDING';
  fileSize: string;
  summary: string;
}

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([
    { id: 'REP-2026-Q2', title: 'Q2 Comprehensive Financial Position & Balance Sheet', category: 'FINANCIAL', period: 'Apr 2026 – Jun 2026', generatedDate: '2026-07-05', status: 'VERIFIED', fileSize: '2.4 MB', summary: 'Audited statement of operational assets (₹12.48 Cr), committed expenditure liabilities (₹3.42 Cr), and unencumbered reserves.' },
    { id: 'REP-2026-RSK', title: 'Institutional Risk & Bayesian Anomaly Assessment Report', category: 'RISK', period: 'H1 FY 2026', generatedDate: '2026-08-01', status: 'VERIFIED', fileSize: '1.8 MB', summary: 'Statistical Z-score evaluation across 1,240 municipal vendor transactions. Overall system exposure rated LOW (18.4/100).' },
    { id: 'REP-2026-AUD', title: 'Cryptographic Audit Log Summary & Immutable Ledger', category: 'AUDIT', period: 'Q2 FY 2026', generatedDate: '2026-08-15', status: 'VERIFIED', fileSize: '4.1 MB', summary: 'SHA-256 hash verified log of all agent state mutations, user interventions, and policy screening decisions.' },
    { id: 'REP-2026-BGT', title: 'Departmental Budget Allocation & Ceiling Utilization Audit', category: 'BUDGET', period: 'FY 2026 Mid-Term', generatedDate: '2026-09-01', status: 'VERIFIED', fileSize: '3.0 MB', summary: 'Comparative analysis of 6 municipal department budgets. Highlights Public Works utilization at 94.2% threshold.' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeReportModal, setActiveReportModal] = useState<ReportItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredReports = reports.filter(
    (r) => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  // Revenue vs Expense Quarterly Chart
  const reportChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['Total Revenue (₹Cr)', 'Total Expenditure (₹Cr)', 'Net Surplus (₹Cr)'], textStyle: { color: '#94a3b8', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 25, left: 45 },
    xAxis: {
      type: 'category',
      data: ['Q1 FY26', 'Q2 FY26', 'Q3 FY26 (Est)', 'Q4 FY26 (Est)'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' },
    },
    series: [
      { name: 'Total Revenue (₹Cr)', type: 'bar', data: [3.8, 4.2, 4.5, 4.9], itemStyle: { color: '#10b981' } },
      { name: 'Total Expenditure (₹Cr)', type: 'bar', data: [2.9, 3.1, 3.4, 3.6], itemStyle: { color: '#ef4444' } },
      { name: 'Net Surplus (₹Cr)', type: 'line', smooth: true, data: [0.9, 1.1, 1.1, 1.3], lineStyle: { color: '#06b6d4', width: 2 } },
    ],
  };

  // Real CSV/Excel Blob Downloader
  const handleDownloadCSV = (report: ReportItem) => {
    const csvHeader = 'Report ID,Title,Category,Period,Generated Date,Status,Summary\n';
    const csvRow = `"${report.id}","${report.title}","${report.category}","${report.period}","${report.generatedDate}","${report.status}","${report.summary.replace(/"/g, '""')}"\n`;
    const fullContent = csvHeader + csvRow;

    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.id}_Statement_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(`CSV Report ${report.id} downloaded successfully to your computer!`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" /> Executive Financial Reports & Excel/CSV Export Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audited financial statements, risk assessment reports and Excel CSV export downloader
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-emerald-400 font-bold flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400" /> {downloadSuccess}
        </div>
      )}

      {/* Financial Statement Visualization */}
      <div className="finos-card">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Quarterly Financial Statement Summary & Net Surplus Trend</span>
          <span className="text-[10px] text-emerald-400">Verified Audit Ledger</span>
        </div>
        <ReactEChart option={reportChartOption} height="260px" />
      </div>

      {/* Category Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111622] p-3 rounded border border-[#232d42]">
        <span className="font-bold text-slate-200 uppercase">Available Financial Reports</span>

        <div className="flex space-x-1 bg-[#151c2c] p-1 rounded border border-[#232d42]">
          {(['ALL', 'FINANCIAL', 'RISK', 'AUDIT', 'BUDGET'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((r) => (
          <div key={r.id} className="finos-card bg-[#111622] border border-[#232d42] p-4 rounded-md space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold block">{r.id} • {r.category}</span>
                <h3 className="font-bold text-sm text-white mt-0.5">{r.title}</h3>
                <span className="text-[11px] text-slate-400 block mt-1">Period: {r.period}</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                {r.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug">{r.summary}</p>

            <div className="pt-2 border-t border-[#232d42] flex space-x-2">
              <button
                onClick={() => setActiveReportModal(r)}
                className="flex-1 bg-[#151c2c] hover:bg-[#1c2638] text-slate-200 font-bold py-1.5 px-3 rounded flex items-center justify-center space-x-1.5 transition-colors border border-[#232d42]"
              >
                <Eye className="h-3.5 w-3.5 text-cyan-400" />
                <span>Preview Statement</span>
              </button>
              <button
                onClick={() => handleDownloadCSV(r)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT PREVIEW MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="w-full max-w-xl bg-[#0d121d] border border-[#232d42] rounded-lg p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <span className="text-xs text-cyan-400 font-bold block">{activeReportModal.id}</span>
                <h3 className="font-bold text-sm text-white">{activeReportModal.title}</h3>
              </div>
              <button onClick={() => setActiveReportModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 bg-[#151c2c] p-4 rounded border border-[#232d42]">
              <div className="flex justify-between border-b border-[#232d42] pb-2 text-slate-400">
                <span>Reporting Period: <strong className="text-white">{activeReportModal.period}</strong></span>
                <span>Generated: <strong className="text-white">{activeReportModal.generatedDate}</strong></span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed">{activeReportModal.summary}</p>
              <div className="pt-2 text-[11px] text-cyan-300 font-mono">
                Verification Certificate: Cryptographically signed by FINOS Policy Agent (SHA-256 Validated).
              </div>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end space-x-2">
              <button
                onClick={() => {
                  handleDownloadCSV(activeReportModal);
                  setActiveReportModal(null);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-xs flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> Download CSV Excel
              </button>
              <button
                onClick={() => setActiveReportModal(null)}
                className="bg-[#1c2638] hover:bg-slate-700 text-slate-300 px-4 py-1.5 rounded text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
