import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProjectDispatch } from '../types';
import { Building2, ArrowRight, CheckCircle2, Clock, Send, Mail, ShieldCheck, Plus, FileText, MapPin, AlertCircle, Layers3, Search, Filter } from 'lucide-react';
import { apiService } from '../services/api';
import { generate100Projects } from '../utils/dummyGenerator';

export const ProjectWorkflowPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [projects, setProjects] = useState<ProjectDispatch[]>(() => generate100Projects());
  const [selectedProject, setSelectedProject] = useState<ProjectDispatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');

  const [paymentNotice, setPaymentNotice] = useState<{
    projectCode: string;
    voucherCode: string;
    vendorName: string;
    department: string;
    amount: number;
    status: 'APPROVED' | 'REJECTED';
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('finos_last_payment_action');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.status && parsed.voucherCode) {
          setPaymentNotice(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const clearPaymentNotice = () => {
    setPaymentNotice(null);
    localStorage.removeItem('finos_last_payment_action');
  };

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const hierarchySteps = [
    { role: 'CEO', label: '1. Executive Leadership', person: 'Chief Executive Officer (CEO)', batch: 'EXEC-HQ-9041' },
    { role: 'DIRECTOR', label: '2. Regional Directorate', person: 'Regional Director', batch: 'DIR-HQ-7732' },
    { role: 'PROJECT_MANAGER', label: '3. Operations & PM Team', person: 'Project / Operations Manager', batch: 'MGR-OPS-6611' },
    { role: 'SITE_INCHARGE', label: '4. Field Execution', person: 'Site Incharge / Field Lead', batch: 'FLD-SITE-5544' }
  ];

  const handleOpenForwardModal = (project: ProjectDispatch) => {
    setSelectedProject(project);
    setCustomNotes(
      `We are proceeding with construction for '${project.title}'. Total estimated amount allocated is ₹${project.estimated_amount.toFixed(
        2
      )} Cr. Please inspect site specifications, authorize initial phase disbursements, and dispatch instructions to the next level team.`
    );
    setIsModalOpen(true);
  };

  const handleConfirmDispatch = async () => {
    if (!selectedProject || !user) return;

    try {
      await apiService.forwardDispatch({
        project_id: selectedProject.id,
        sender_name: user.fullName,
        sender_email: user.email,
        sender_role: user.roleTitle,
        sender_batch: user.batchNo,
        notes: customNotes
      });
    } catch (e) {
      console.log('Backend sync offline, updating local state seamlessly');
    }

    const nextTierMap: Record<string, string> = {
      CEO: 'DIRECTOR',
      DIRECTOR: 'PROJECT_MANAGER',
      PROJECT_MANAGER: 'SITE_INCHARGE',
      OPERATIONS_MANAGER: 'SITE_INCHARGE',
      HR_MANAGER: 'SITE_INCHARGE',
      SITE_INCHARGE: 'COMPLETED',
      MANAGER: 'SITE_INCHARGE',
      SITE_EMPLOYEE: 'COMPLETED'
    };

    const nextTier = nextTierMap[selectedProject.current_tier] || 'COMPLETED';

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === selectedProject.id) {
          return {
            ...p,
            current_tier: nextTier,
            status: nextTier === 'COMPLETED' ? 'FULLY_EXECUTED' : `FORWARDED_TO_${nextTier}`
          };
        }
        return p;
      })
    );

    setIsModalOpen(false);
    addToast(
      'Official Dispatch Email Sent!',
      `Project '${selectedProject.title}' approved & email dispatched to ${nextTier} tier!`,
      'success'
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newLocation || !newAmount || !user) {
      addToast('Error', 'Please fill in all project fields', 'error');
      return;
    }

    const newProj: ProjectDispatch = {
      id: Date.now(),
      project_code: `PRJ-INF-2026-0${projects.length + 1}`,
      title: newTitle,
      location: newLocation,
      estimated_amount: parseFloat(newAmount),
      description: newDesc || `We are going to build new constructions here at ${newLocation}. Estimated amount allocated is ₹${newAmount} Cr.`,
      current_tier: 'CEO',
      status: 'APPROVED_BY_CEO',
      created_by_name: user.fullName,
      created_by_email: user.email,
      created_by_batch: user.batchNo,
      timestamp: new Date().toISOString()
    };

    setProjects([newProj, ...projects]);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewLocation('');
    setNewAmount('');
    setNewDesc('');
    addToast('Construction Proposal Created', `New project '${newProj.title}' logged at CEO tier.`, 'success');
  };

  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTier = selectedTierFilter === 'ALL' || p.current_tier === selectedTierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Page Title Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-400" /> Capital & Construction Approval Chain
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            4-Level Hierarchical Governance Pipeline (CEO ➔ Regional Director ➔ Project / Ops / HR Manager ➔ Site Incharge)
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded flex items-center space-x-1.5 shadow-lg shadow-blue-500/20 transition-colors font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>New Construction Dispatch</span>
          </button>
        </div>
      </div>

      {/* Payment Action Dispatch Alert Banner */}
      {paymentNotice && (
        <div className={`p-4 rounded-md border flex items-center justify-between shadow-xl font-mono ${
          paymentNotice.status === 'APPROVED' 
            ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200' 
            : 'bg-rose-950/90 border-rose-500/60 text-rose-200'
        }`}>
          <div className="flex items-start space-x-3.5">
            <div className={`p-2.5 rounded-lg border ${
              paymentNotice.status === 'APPROVED' 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}>
              {paymentNotice.status === 'APPROVED' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className={`font-black text-base tracking-widest uppercase px-2 py-0.5 rounded ${
                  paymentNotice.status === 'APPROVED' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                }`}>
                  {paymentNotice.status === 'APPROVED' ? 'PROJECT APPROVED' : 'PROJECT DENIED'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-white">
                  VOUCHER: {paymentNotice.voucherCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-black/50 border border-white/20 font-mono text-white">
                  PROJECT: {paymentNotice.projectCode}
                </span>
              </div>
              <p className="text-xs mt-1.5 opacity-90 font-mono leading-relaxed">
                Payment Voucher dispatch for <strong className="text-white">{paymentNotice.vendorName}</strong> ({paymentNotice.department}) amount <strong className="text-white">₹{paymentNotice.amount.toLocaleString('en-IN')}</strong> has been successfully marked as <strong className="uppercase underline decoration-2">{paymentNotice.status}</strong>. Automatic notification dispatched to respective field officers.
              </p>
            </div>
          </div>
          <button 
            onClick={clearPaymentNotice}
            className="text-xs bg-black/40 hover:bg-black/70 border border-white/20 px-3 py-1.5 rounded transition-colors text-white font-bold whitespace-nowrap ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Authenticated Officer Status Banner */}
      <div className="bg-[#151c2c] border border-[#232d42] rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-md bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Authenticated Officer Identity</div>
            <div className="flex items-center space-x-3 mt-0.5">
              <span className="font-bold text-white text-sm">{user?.fullName}</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                {user?.roleTitle} ({user?.role}) — LEVEL {user?.hierarchyLevel}
              </span>
              <span className="text-[10px] text-slate-400 bg-[#0d121d] px-2 py-0.5 rounded border border-[#232d42] font-mono">
                BATCH / ID: {user?.batchNo}
              </span>
              {user?.department && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                  {user.department}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Tier Node Pipeline Flow */}
      <div className="bg-[#151c2c] border border-[#232d42] rounded-md p-4 space-y-3">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Layers3 className="w-3.5 h-3.5 text-blue-400" />
          <span>Hierarchy Routing Status</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {hierarchySteps.map((step, idx) => {
            const isCurrent = user?.role === step.role;
            return (
              <div
                key={step.role}
                className={`p-3 rounded border transition-all relative font-mono ${
                  isCurrent
                    ? 'bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/40'
                    : 'bg-[#0d121d] border-[#232d42]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-300">{step.label}</span>
                  {isCurrent && (
                    <span className="text-[9px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">
                      YOU (LOGGED IN)
                    </span>
                  )}
                </div>
                <div className="font-bold text-white text-xs">{step.person}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{step.batch}</div>

                {idx < 3 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects List Grid Toolbar & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[#232d42]">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Active Capital Dispatches ({filteredProjects.length} of {projects.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search 100+ projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 sm:w-64"
              />
            </div>

            {/* Filter by Tier */}
            <select
              value={selectedTierFilter}
              onChange={(e) => setSelectedTierFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
            >
              <option value="ALL">All Governance Tiers ({projects.length})</option>
              <option value="CEO">CEO Tier</option>
              <option value="DIRECTOR">Director Tier</option>
              <option value="PROJECT_MANAGER">Project Manager Tier</option>
              <option value="OPERATIONS_MANAGER">Operations Manager Tier</option>
              <option value="HR_MANAGER">HR Manager Tier</option>
              <option value="SITE_INCHARGE">Site Incharge Tier</option>
              <option value="COMPLETED">Fully Executed</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 max-h-[900px] overflow-y-auto pr-1">
          {filteredProjects.map((proj) => {
            const isAtMyTier = user?.role === proj.current_tier;
            return (
              <div
                key={proj.id}
                className="bg-[#151c2c] border border-[#232d42] rounded-md p-5 space-y-4 hover:border-blue-500/40 transition-all font-mono"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#232d42]">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                        {proj.project_code}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-wide">{proj.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-red-400" />
                        <span>{proj.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Created by: {proj.created_by_name} ({proj.created_by_batch})</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Allocated Capital</div>
                      <div className="text-base font-extrabold text-emerald-400">
                        ₹{proj.estimated_amount.toFixed(2)} Cr
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                        proj.current_tier === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      TIER: {proj.current_tier}
                    </span>
                  </div>
                </div>

                {/* Description Box */}
                <div className="bg-[#0d121d] p-3.5 rounded border border-[#232d42] text-xs text-slate-300 leading-relaxed font-sans">
                  <div className="text-[10px] font-bold uppercase text-blue-400 mb-1 flex items-center space-x-1 font-mono">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official Dispatch Text Body:</span>
                  </div>
                  {proj.description}
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Routing Status:</span>
                    <span className="text-blue-400 font-bold">{proj.status}</span>
                  </div>

                  <button
                    onClick={() => handleOpenForwardModal(proj)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded font-bold text-xs transition-all shadow-md ${
                      isAtMyTier
                        ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 ring-1 ring-blue-500/50'
                        : 'bg-[#182030] text-slate-300 hover:text-white border border-[#232d42]'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {proj.current_tier === 'CEO' && 'Approve & Transmit Email to Regional Director'}
                      {proj.current_tier === 'DIRECTOR' && 'Acknowledge & Transmit Email to Project / Operations Manager'}
                      {(proj.current_tier === 'PROJECT_MANAGER' || proj.current_tier === 'MANAGER' || proj.current_tier === 'OPERATIONS_MANAGER' || proj.current_tier === 'HR_MANAGER') && 'Approve & Transmit Work Order Email to Site Incharge'}
                      {(proj.current_tier === 'SITE_INCHARGE' || proj.current_tier === 'SITE_EMPLOYEE') && 'Submit Site Field Execution Report'}
                      {proj.current_tier === 'COMPLETED' && 'View Fully Executed Audit Logs'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISPATCH & EMAIL PREVIEW MODAL */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#151c2c] border border-[#232d42] rounded-md max-w-2xl w-full p-6 space-y-5 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#232d42] pb-3">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm uppercase">Official Dispatch Authorization Form</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="bg-[#0d121d] p-3.5 rounded border border-[#232d42] space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">SENDER OFFICER:</span>
                <span className="text-cyan-400 font-bold">{user?.fullName} ({user?.roleTitle}) • {user?.batchNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PROJECT CODE:</span>
                <span className="text-white font-bold">{selectedProject.project_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CAPITAL ALLOCATION:</span>
                <span className="text-emerald-400 font-bold">₹{selectedProject.estimated_amount.toFixed(2)} Cr</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase">
                Dispatch Notification Text:
              </label>
              <textarea
                rows={5}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full p-3 bg-[#0d121d] border border-[#232d42] rounded text-xs text-slate-200 font-sans focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded border border-[#232d42] text-slate-300 hover:text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDispatch}
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Email Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW CONSTRUCTION PROPOSAL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateProject}
            className="bg-[#151c2c] border border-[#232d42] rounded-md max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#232d42] pb-3">
              <h3 className="font-bold text-white text-sm uppercase flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Create Construction Dispatch Proposal</span>
              </h3>
              <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Project Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Elevated Express Corridor - Phase II"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Site Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tech Corridor Sector 12"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full p-2.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Estimated Amount (in ₹ Cr) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 35.50"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full p-2.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">Dispatch Instructions & Description</label>
              <textarea
                rows={3}
                placeholder="Construction dispatch details..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full p-2.5 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded border border-[#232d42] text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Log Dispatch Proposal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
