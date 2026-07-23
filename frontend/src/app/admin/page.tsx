'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { getDashboardStats } from '../../services/api';

interface DashboardData {
  stats: {
    pendingAppointments: number;
    emergencyRequests: number;
    unreadInquiries: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    type: 'APPOINTMENT' | 'INQUIRY';
    created_at: string;
  }>;
  weeklyTrends: Array<{
    week_label: string;
    count: number;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getDashboardStats();
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const maxTrendCount = Math.max(...(data?.weeklyTrends?.map((t) => t.count) || [1]), 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2E2A]">Clinic Overview</h1>
            <p className="text-xs text-[#0F2E2A]/70 mt-1">
              Real-time operational summary for Harbord Dentistry.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="px-3.5 py-2 bg-[#0F2E2A] hover:bg-[#0F2E2A]/90 text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all self-start sm:self-auto shadow-sm"
          >
            🔄 Refresh Metrics
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[#0F2E2A]/60 text-xs font-medium">
            Calculating analytics and loading clinic activity...
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Pending Appointments */}
              <Link
                href="/admin/appointments"
                className="bg-[#0F2E2A] text-[#FAF7F2] p-5 rounded-2xl space-y-3 transition-all group shadow-md hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#FAF7F2]/80">
                    Pending Requests
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 text-sm">
                    ⏳
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#FAF7F2]">
                  {data?.stats.pendingAppointments || 0}
                </div>
                <p className="text-[11px] text-amber-300 font-medium group-hover:underline">
                  Requires action →
                </p>
              </Link>

              {/* Card 2: Emergency Pain Requests */}
              <Link
                href="/admin/appointments"
                className="bg-[#0F2E2A] text-[#FAF7F2] p-5 rounded-2xl space-y-3 transition-all group shadow-md hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#FAF7F2]/80">
                    Emergency Alerts
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 text-sm animate-pulse">
                    🚨
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#FAF7F2]">
                  {data?.stats.emergencyRequests || 0}
                </div>
                <p className="text-[11px] text-rose-300 font-medium group-hover:underline">
                  Patients in severe pain →
                </p>
              </Link>

              {/* Card 3: Unread Inquiries */}
              <Link
                href="/admin/inquiries"
                className="bg-[#0F2E2A] text-[#FAF7F2] p-5 rounded-2xl space-y-3 transition-all group shadow-md hover:shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#FAF7F2]/80">
                    Pending Inquiries
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/20 border border-emerald-300/30 flex items-center justify-center text-emerald-300 text-sm">
                    📬
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#FAF7F2]">
                  {data?.stats.unreadInquiries || 0}
                </div>
                <p className="text-[11px] text-emerald-300 font-medium group-hover:underline">
                  Inbox messages →
                </p>
              </Link>
            </div>

            {/* Middle Grid: Activity Feed + Trend Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Activity Feed */}
              <div className="lg:col-span-2 bg-white border border-[#0F2E2A]/10 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-[#0F2E2A]/10 pb-3">
                  <h2 className="text-sm font-bold text-[#0F2E2A]">
                    ⚡ Recent Operations Feed
                  </h2>
                  <span className="text-[10px] text-[#0F2E2A]/60">
                    Live system timeline
                  </span>
                </div>

                {!data?.recentActivity || data.recentActivity.length === 0 ? (
                  <p className="text-xs text-[#0F2E2A]/50 py-6 text-center">
                    No recent activity recorded.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.recentActivity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#0F2E2A]/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-base">
                            {item.type === 'APPOINTMENT' ? '🗓️' : '💬'}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-[#0F2E2A]">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#0F2E2A]/70 line-clamp-1 mt-0.5">
                              "{item.subtitle}"
                            </p>
                            <span className="text-[10px] text-[#0F2E2A]/50 mt-1 inline-block">
                              {new Date(item.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                            item.badge.includes('Pain')
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : item.type === 'APPOINTMENT'
                              ? 'bg-[#0F2E2A]/10 text-[#0F2E2A] border-[#0F2E2A]/20'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Monthly Trend Chart */}
              <div className="bg-[#0F2E2A] text-[#FAF7F2] rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold border-b border-white/10 pb-3">
                    📊 Booking Volume (30 Days)
                  </h2>
                  <p className="text-[11px] text-[#FAF7F2]/70 mt-2">
                    Weekly distribution of appointment requests.
                  </p>
                </div>

                {!data?.weeklyTrends || data.weeklyTrends.length === 0 ? (
                  <p className="text-xs text-[#FAF7F2]/50 text-center py-8">
                    Insufficient trend data available.
                  </p>
                ) : (
                  <div className="space-y-4 py-2">
                    {data.weeklyTrends.map((trend) => {
                      const percentage = Math.round(
                        (trend.count / maxTrendCount) * 100
                      );
                      return (
                        <div key={trend.week_label} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-[#FAF7F2]/80">
                              {trend.week_label}
                            </span>
                            <span className="text-[#FAF7F2]">
                              {trend.count} requests
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FAF7F2] rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 8)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-white/10 p-3 rounded-xl text-[11px] text-[#FAF7F2]/80 text-center">
                  💡 Keep pending requests below 5 for optimal patient response times.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}