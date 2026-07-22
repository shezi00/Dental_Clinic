'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getInquiries, replyToInquiry } from '../../../services/api';

interface Inquiry {
  id: number;
  full_name?: string;
  name?: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
  created_at: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active Tab State: 'PENDING' vs 'RESOLVED'
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');

  // Reply Modal States
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getInquiries();
      setInquiries(Array.isArray(data) ? data : data.inquiries || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch inquiries.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyText.trim()) return;

    setSendingReply(true);
    try {
      await replyToInquiry(selectedInquiry.id, replyText);
      alert('✉️ Reply sent successfully! Inquiry moved to Resolved.');
      setSelectedInquiry(null);
      setReplyText('');
      fetchInquiries(); // Reloads data; inquiry will automatically move to Resolved tab
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reply.';
      alert(`⚠️ ${msg}`);
    } finally {
      setSendingReply(false);
    }
  };

  // Filter inquiries based on selected tab
  const pendingInquiries = inquiries.filter(
    (item) => !item.status || item.status === 'NEW' || item.status === 'IN_PROGRESS'
  );
  const resolvedInquiries = inquiries.filter((item) => item.status === 'RESOLVED');

  const displayedInquiries = activeTab === 'PENDING' ? pendingInquiries : resolvedInquiries;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2E2A]">Patient Inquiries Inbox</h1>
            <p className="text-xs text-[#0F2E2A]/70 mt-1">
              Manage patient form messages and respond directly via email.
            </p>
          </div>

          <button
            onClick={fetchInquiries}
            className="px-3.5 py-2 bg-[#0F2E2A] hover:bg-[#0F2E2A]/90 text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md duration-300 ease-out self-start sm:self-auto"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-2 bg-white/80 p-1.5 border border-[#0F2E2A]/10 rounded-xl w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === 'PENDING'
                ? 'bg-[#0F2E2A] text-[#FAF7F2] shadow-md'
                : 'text-[#0F2E2A]/70 hover:text-[#0F2E2A] hover:bg-[#0F2E2A]/5'
            }`}
          >
            ⏳ Pending
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'PENDING'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-300/30'
                  : 'bg-[#0F2E2A]/10 text-[#0F2E2A]'
              }`}
            >
              {pendingInquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTab === 'RESOLVED'
                ? 'bg-[#0F2E2A] text-[#FAF7F2] shadow-md'
                : 'text-[#0F2E2A]/70 hover:text-[#0F2E2A] hover:bg-[#0F2E2A]/5'
            }`}
          >
            ✓ Resolved
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'RESOLVED'
                  ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-300/30'
                  : 'bg-[#0F2E2A]/10 text-[#0F2E2A]'
              }`}
            >
              {resolvedInquiries.length}
            </span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Inquiries Content Grid */}
        {loading ? (
          <div className="py-12 text-center text-[#0F2E2A]/60 text-xs font-medium">
            Loading inquiries...
          </div>
        ) : displayedInquiries.length === 0 ? (
          <div className="py-12 text-center bg-white border border-[#0F2E2A]/10 rounded-2xl text-[#0F2E2A]/60 text-xs shadow-sm">
            No {activeTab.toLowerCase()} inquiries found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-[#0F2E2A] text-[#FAF7F2] p-5 rounded-2xl space-y-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start border-b border-white/10 pb-3">
                    <div>
                      <h3 className="font-semibold text-[#FAF7F2] text-sm">
                        {inquiry.full_name || inquiry.name || 'Anonymous'}
                      </h3>
                      <p className="text-xs text-emerald-300 font-medium mt-0.5">
                        {inquiry.email}
                      </p>
                      {inquiry.phone && (
                        <p className="text-[10px] text-[#FAF7F2]/60 mt-0.5">
                          📞 {inquiry.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] text-[#FAF7F2]/70 bg-white/10 px-2 py-0.5 rounded-md">
                        {inquiry.created_at
                          ? new Date(inquiry.created_at).toLocaleDateString()
                          : 'Recent'}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          inquiry.status === 'RESOLVED'
                            ? 'bg-emerald-400/20 text-emerald-300 border-emerald-300/30'
                            : 'bg-amber-400/20 text-amber-300 border-amber-300/30'
                        }`}
                      >
                        {inquiry.status || 'NEW'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#FAF7F2]/90 leading-relaxed bg-white/10 p-3.5 rounded-xl border border-white/10">
                    "{inquiry.message}"
                  </p>
                </div>

                {/* Show Reply button only if inquiry is not already resolved */}
                {activeTab === 'PENDING' && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="px-3.5 py-2 bg-[#FAF7F2] hover:bg-white text-[#0F2E2A] text-xs font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out"
                    >
                      📧 Reply via Email
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reply Modal */}
        {selectedInquiry && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#0F2E2A] text-[#FAF7F2] border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-[#FAF7F2]">
                  Reply to {selectedInquiry.full_name || selectedInquiry.email}
                </h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-[#FAF7F2]/60 hover:text-[#FAF7F2] text-xs transition-colors"
                >
                  ✕ Close
                </button>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 text-xs text-[#FAF7F2]/90">
                <p className="font-semibold text-[#FAF7F2] mb-1">Inquiry:</p>
                "{selectedInquiry.message}"
              </div>

              <div>
                <label className="block text-xs text-[#FAF7F2]/80 font-semibold mb-1.5">
                  Your Response Email
                </label>
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-[#FAF7F2] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FAF7F2]/50 transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-white/10 text-[#FAF7F2] hover:bg-white/20 rounded-xl text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-white text-[#0F2E2A] hover:-translate-y-0.5 disabled:opacity-50 text-xs font-bold rounded-xl shadow-md transition-all duration-300"
                >
                  {sendingReply ? 'Sending Email...' : 'Send Response'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}