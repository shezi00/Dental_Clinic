'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface UserSession {
  id: number;
  fullName: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'STAFF';
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.clear();
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#0F2E2A] text-sm font-medium">
        Authenticating session...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      {/* Left Sidebar (#0F2E2A) */}
      <aside className="w-full md:w-64 bg-[#0F2E2A] text-[#FAF7F2] flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <span className="text-2xl">🦷</span>
            <div>
              <h2 className="font-bold text-[#FAF7F2] text-sm leading-tight">
                Harbord Dentistry
              </h2>
              <span className="text-[10px] text-[#FAF7F2]/70 font-semibold tracking-wider uppercase">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                pathname === '/admin'
                  ? 'bg-[#FAF7F2] text-[#0F2E2A] shadow-md'
                  : 'text-[#FAF7F2]/80 hover:bg-white/10 hover:text-[#FAF7F2]'
              }`}
            >
              📊 Overview Dashboard
            </Link>

            <Link
              href="/admin/appointments"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/admin/appointments'
                  ? 'bg-[#FAF7F2] text-[#0F2E2A] shadow-md'
                  : 'text-[#FAF7F2]/80 hover:bg-white/10 hover:text-[#FAF7F2]'
              }`}
            >
              📅 Appointments
            </Link>

            <Link
              href="/admin/inquiries"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === '/admin/inquiries'
                  ? 'bg-[#FAF7F2] text-[#0F2E2A] shadow-md'
                  : 'text-[#FAF7F2]/80 hover:bg-white/10 hover:text-[#FAF7F2]'
              }`}
            >
              💬 Patient Inquiries
            </Link>
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-[#FAF7F2] truncate">
              {user.fullName || 'Staff User'}
            </p>
            <p className="text-[10px] text-[#FAF7F2]/70 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/10 text-[#FAF7F2] text-[10px] font-bold tracking-wide">
              {user.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/20 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Right Content Area (#FAF7F2) */}
      <main className="flex-1 p-6 md:p-8 bg-[#FAF7F2] text-[#0F2E2A] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}