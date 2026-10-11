import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { EmailLog } from '../types';
import { Mail, CheckCircle2, Search } from 'lucide-react';
import { apiService } from '../services/api';
import { generate100Emails } from '../utils/dummyGenerator';

export const EmailHubPage: React.FC = () => {
  const { addToast } = useToast();

  const [emails, setEmails] = useState<EmailLog[]>(() => generate100Emails());
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(() => {
    const list = generate100Emails();
    return list[0] || null;
  });
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    apiService.getEmailLogs().then((res) => {
      if (res && res.length > 0) {
        setEmails(res);
      }
    }).catch(() => {
      // Offline fallback
    });
  }, []);

  const filteredEmails = emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.sender_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.recipient_name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.body_text.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleAcknowledgeAndPass = (email: EmailLog) => {
    addToast(
      'Email Acknowledged & Passed Down',
      `Dispatch #${email.id} acknowledged. Notification transmitted to lower tier.`,
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1800px] mx-auto font-mono text-xs">
      {/* Page Title Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-[#232d42]">
        <div>
          <h1 className="text-lg font-bold uppercase text-white tracking-wider flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" /> Enterprise Email Dispatch Terminal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit Trail & Dispatch Log of Official Notifications Sent Across Leadership Tiers
          </p>
        </div>
      </div>

      {/* Main Mail Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[600px]">
        {/* Left Column: Email List */}
        <div className="lg:col-span-5 bg-[#151c2c] border border-[#232d42] rounded-md p-3.5 flex flex-col space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter dispatches, senders, text..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#0d121d] border border-[#232d42] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-3 rounded border transition-all cursor-pointer font-mono ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/50 shadow-sm'
                      : 'bg-[#0d121d] border-[#232d42] hover:border-[#334155]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-cyan-400">{email.sender_name}</span>
                    <span className="text-[10px] text-slate-500">{new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{email.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 font-sans">{email.body_text}</p>
                  <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#232d42] text-[10px]">
                    <span className="text-emerald-400 font-bold">₹{email.estimated_amount.toFixed(2)} Cr</span>
                    <span className="text-slate-400 bg-[#151c2c] px-2 py-0.5 rounded border border-[#232d42]">To: {email.recipient_name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Reader View */}
        <div className="lg:col-span-7 bg-[#151c2c] border border-[#232d42] rounded-md p-5 flex flex-col justify-between font-mono">
          {selectedEmail ? (
            <div className="space-y-5">
              {/* Header Details */}
              <div className="border-b border-[#232d42] pb-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                    DISPATCH #{selectedEmail.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Verified Digital Signature
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white tracking-wide">{selectedEmail.subject}</h2>

                {/* Sender & Recipient Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0d121d] p-3 rounded border border-[#232d42] text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">FROM SENDER:</span>
                    <span className="text-white font-bold">{selectedEmail.sender_name}</span>
                    <span className="text-slate-400 block text-[11px]">{selectedEmail.sender_role}</span>
                    <span className="text-cyan-400 text-[10px]">BATCH: {selectedEmail.sender_batch}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">TO RECIPIENT:</span>
                    <span className="text-white font-bold">{selectedEmail.recipient_name}</span>
                    <span className="text-slate-400 block text-[11px]">{selectedEmail.recipient_role}</span>
                    <span className="text-cyan-400 text-[10px]">{selectedEmail.recipient_email}</span>
                  </div>
                </div>
              </div>

              {/* Text Body */}
              <div className="bg-[#0d121d] p-4 rounded border border-[#232d42] whitespace-pre-wrap text-xs text-slate-200 leading-relaxed font-sans">
                {selectedEmail.body_text}
              </div>

              {/* Data Summary Box */}
              <div className="bg-[#0d121d] border border-blue-500/30 p-3.5 rounded flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10px]">Attached Financial Capital Authorization:</span>
                  <span className="text-emerald-400 text-base font-extrabold">₹{selectedEmail.estimated_amount.toFixed(2)} Cr</span>
                </div>
                <button
                  onClick={() => handleAcknowledgeAndPass(selectedEmail)}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-colors flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acknowledge & Pass Down</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a dispatch from the left panel to inspect full contents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
