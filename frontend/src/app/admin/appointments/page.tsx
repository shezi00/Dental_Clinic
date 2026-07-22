'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { getAppointments, updateAppointmentStatus } from '../../../services/api';

type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

interface Appointment {
  id: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  is_new_patient: boolean;
  reason_for_visit: string;
  is_in_pain: boolean;
  status: AppointmentStatus;
  created_at: string;
  assigned_doctor?: string;
  preferred_days: unknown;
  preferred_times: unknown;
}

// Helper to safely format Postgres array responses (JS arrays, strings like "{Mon,Tue}", or null)
const formatPgArray = (value: unknown, fallback: string): string => {
  if (!value) return fallback;

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : fallback;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/^\{|\}$/g, '').trim();
    if (!cleaned) return fallback;
    return cleaned.split(',').map((s) => s.replace(/^"|"$/g, '').trim()).join(', ');
  }

  return fallback;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load appointments.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status.';
      alert(`⚠️ ${msg}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;
    const matchesSearch =
      app.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.patient_phone?.includes(searchTerm) ||
      app.reason_for_visit?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30';
      case 'COMPLETED':
        return 'bg-blue-500/15 text-blue-800 border-blue-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/15 text-rose-800 border-rose-500/30';
      default: // PENDING
        return 'bg-amber-500/15 text-amber-800 border-amber-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F2E2A]">Appointments Management</h1>
            <p className="text-xs text-[#0F2E2A]/70 mt-1">
              Review and manage patient booking requests.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="px-3.5 py-2 bg-[#0F2E2A] hover:bg-[#0F2E2A]/90 text-[#FAF7F2] text-xs font-semibold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-md duration-300 ease-out self-start md:self-auto shadow-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 p-4 border border-[#0F2E2A]/10 rounded-2xl shadow-sm">
          <input
            type="text"
            placeholder="Search by name, email, phone, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#0F2E2A]/15 rounded-xl text-[#0F2E2A] placeholder-[#0F2E2A]/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F2E2A]/30 transition-all"
          />

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-semibold transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-[#0F2E2A] text-[#FAF7F2] shadow-md'
                    : 'bg-[#FAF7F2] text-[#0F2E2A]/70 hover:text-[#0F2E2A] hover:bg-[#0F2E2A]/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content State */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-[#0F2E2A]/60 text-xs font-medium">
            Loading appointments table...
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="py-12 text-center bg-white border border-[#0F2E2A]/10 rounded-2xl text-[#0F2E2A]/60 text-xs shadow-sm">
            No appointments found matching your criteria.
          </div>
        ) : (
          <div className="bg-white border border-[#0F2E2A]/10 rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2E2A] text-[#FAF7F2] uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Reason / Notes</th>
                    <th className="p-4">Preferred Slots</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0F2E2A]/10 text-[#0F2E2A]">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-[#FAF7F2] transition-colors duration-200">
                      <td className="p-4">
                        <div className="font-semibold text-[#0F2E2A]">{app.patient_name}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {app.is_new_patient && (
                            <span className="px-2 py-0.5 rounded-full bg-[#0F2E2A]/10 text-[#0F2E2A] border border-[#0F2E2A]/20 text-[9px] font-bold">
                              New Patient
                            </span>
                          )}
                          {app.is_in_pain && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/25 text-[9px] font-bold animate-pulse">
                              🚨 In Pain
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{app.patient_email}</div>
                        <div className="text-[10px] text-[#0F2E2A]/60 mt-0.5">📞 {app.patient_phone}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="font-medium text-[#0F2E2A]/90 leading-relaxed">{app.reason_for_visit}</p>
                      </td>
                      <td className="p-4">
                        <div className="text-[11px] font-semibold text-[#0F2E2A]">
                          {formatPgArray(app.preferred_days, 'Any Day')}
                        </div>
                        <div className="text-[10px] text-[#0F2E2A]/60 mt-0.5">
                          {formatPgArray(app.preferred_times, 'Any Time')}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border ${getStatusBadgeStyle(
                            app.status
                          )}`}
                        >
                          {app.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {updatingId === app.id ? (
                          <span className="text-[10px] text-[#0F2E2A]/50 font-medium">Updating...</span>
                        ) : (
                          <select
                            value={app.status || 'PENDING'}
                            onChange={(e) =>
                              handleStatusChange(app.id, e.target.value as AppointmentStatus)
                            }
                            className="bg-[#0F2E2A] text-[#FAF7F2] text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F2E2A]/30 cursor-pointer hover:bg-[#0F2E2A]/90 transition-all duration-300"
                          >
                            <option value="PENDING" className="bg-[#0F2E2A] text-[#FAF7F2]">⏳ PENDING</option>
                            <option value="CONFIRMED" className="bg-[#0F2E2A] text-[#FAF7F2]">✓ CONFIRMED</option>
                            <option value="COMPLETED" className="bg-[#0F2E2A] text-[#FAF7F2]">🎉 COMPLETED</option>
                            <option value="CANCELLED" className="bg-[#0F2E2A] text-[#FAF7F2]">✕ CANCELLED</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}