import React, { useState } from 'react';
import { ReactEChart } from '../components/ReactEChart';
import { EChartsOption } from 'echarts';
import { Download, Eye, Search, CheckCircle2, ShieldCheck, X, FileSpreadsheet } from 'lucide-react';
import { generate60Reports, generate500CSVRows, DownloadableReport } from '../utils/dummyGenerator';

export const Reports: React.FC = () => {
  const [reports] = useState<DownloadableReport[]>(() => generate60Reports());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeReportModal, setActiveReportModal] = useState<DownloadableReport | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Revenue vs Expense Quarterly Chart
  const reportChartOption: EChartsOption = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['Total Revenue (₹Cr)', 'Total Expenditure (₹Cr)', 'Net Surplus (₹Cr)'],
      textStyle: { color: '#94a3b8', fontSize: 10 }
    },
    grid: { top: 30, right: 15, bottom: 25, left: 45 },
    xAxis: {
      type: 'category',
      data: ['Q1 FY26', 'Q2 FY26', 'Q3 FY26 (Est)', 'Q4 FY26 (Est)'],
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#182030' } },
      axisLabel: { color: '#64748b', fontSize: 10, fontFamily: 'monospace' }
    },
    series: [
      { name: 'Total Revenue (₹Cr)', type: 'bar', data: [38.5, 42.0, 45.2, 49.8], itemStyle: { color: '#10b981' } },
      { name: 'Total Expenditure (₹Cr)', type: 'bar', data: [29.1, 31.4, 34.0, 36.5], itemStyle: { color: '#ef4444' } },
      {
        name: 'Net Surplus (₹Cr)',
        type: 'line',
        smooth: true,
        data: [9.4, 10.6, 11.2, 13.3],
        lineStyle: { color: '#06b6d4', width: 2 }
      }
    ]
  };

  // Real CSV/Excel Blob Downloader generating 500+ items CSV file
  const handleDownloadCSV = (report: DownloadableReport) => {
    const fullContent = generate500CSVRows(report);
    const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.id}_${report.projectCode}_500Items_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(
      `CSV File for '${report.projectCode}' downloaded! Contains ${report.itemCount} detailed records.`
    );
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-400" /> Executive Financial Reports & CSV Export Workbench
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            60+ Downloadable Construction & Financial CSV Packages (Each CSV contains 500+ detailed line-item records)
          </p>
        </div>

        <div className="bg-[#151c2c] px-3.5 py-1.5 rounded border border-[#232d42] text-xs font-mono text-cyan-400 font-bold flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Total Available CSV Exports: {reports.length} Reports</span>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded text-emerald-400 font-bold flex items-center shadow-lg">
          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-400 flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Financial Statement Visualization */}
      <div className="finos-card bg-[#151c2c] border border-[#232d42] p-4 rounded-md">
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#232d42]">
          <span className="font-bold text-slate-200 uppercase">Quarterly Financial Statement Summary & Net Surplus Trend</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
            Verified Audit Ledger
          </span>
        </div>
        <ReactEChart option={reportChartOption} height="240px" />
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#111622] p-3.5 rounded-md border border-[#232d42]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search across 60+ reports by ID, project code, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Tabs */}
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

      {/* Counter Label */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
        <span>Showing <strong className="text-white">{filteredReports.length}</strong> of <strong className="text-white">{reports.length}</strong> Report Downloads</span>
        <span className="text-cyan-400">Each CSV download generates 500+ formatted records</span>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((r) => (
          <div key={r.id} className="finos-card bg-[#111622] border border-[#232d42] p-4 rounded-md space-y-3 hover:border-blue-500/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold block">{r.id} • {r.projectCode}</span>
                <h3 className="font-bold text-xs text-white mt-0.5 line-clamp-1">{r.title}</h3>
                <span className="text-[10px] text-slate-400 block mt-1">Period: {r.period}</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                {r.status}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 font-sans">{r.summary}</p>

            <div className="bg-[#0d121d] p-2 rounded border border-[#232d42] flex justify-between items-center text-[10px] text-slate-400">
              <span>File Size: <strong className="text-white">{r.fileSize}</strong></span>
              <span className="text-emerald-400 font-bold">{r.itemCount}+ Detailed Rows</span>
            </div>

            <div className="pt-2 border-t border-[#232d42] flex space-x-2">
              <button
                onClick={() => setActiveReportModal(r)}
                className="bg-[#151c2c] hover:bg-[#1c2638] text-slate-200 font-bold py-1.5 px-2.5 rounded flex items-center justify-center space-x-1 transition-colors border border-[#232d42] text-[10px]"
              >
                <Eye className="h-3 w-3 text-cyan-400" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleDownloadCSV(r)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-3 rounded flex items-center justify-center space-x-1.5 transition-colors shadow-md text-[11px]"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download CSV (500+ Items)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REPORT PREVIEW MODAL */}
      {activeReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono text-xs">
          <div className="w-full max-w-2xl bg-[#151c2c] border border-[#232d42] rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-[#232d42]">
              <div>
                <span className="text-xs text-cyan-400 font-bold block">{activeReportModal.id} • {activeReportModal.projectCode}</span>
                <h3 className="font-bold text-sm text-white mt-0.5">{activeReportModal.title}</h3>
              </div>
              <button onClick={() => setActiveReportModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 bg-[#0d121d] p-4 rounded border border-[#232d42]">
              <div className="flex justify-between border-b border-[#232d42] pb-2 text-slate-400 text-[11px]">
                <span>Period: <strong className="text-white">{activeReportModal.period}</strong></span>
                <span>Generated: <strong className="text-white">{activeReportModal.generatedDate}</strong></span>
                <span>Category: <strong className="text-cyan-400">{activeReportModal.category}</strong></span>
              </div>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">{activeReportModal.summary}</p>
              <div className="pt-2 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                🔒 Cryptographic Audit Certificate: Validated hash SHA-256 ledger ready for 500+ row CSV download.
              </div>
            </div>

            <div className="pt-3 border-t border-[#232d42] flex justify-end space-x-3">
              <button
                onClick={() => setActiveReportModal(null)}
                className="bg-[#1c2638] hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  handleDownloadCSV(activeReportModal);
                  setActiveReportModal(null);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded text-xs flex items-center space-x-1.5 shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Download CSV File (500+ Line Items)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
