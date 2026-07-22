'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../../services/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser({ email, password });
      if (res.token && res.user) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        router.push('/admin');
      } else {
        setError(res.message || 'Invalid credentials.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-[#0F2E2A] text-[#FAF7F2] p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl inline-block mb-1">🦷</span>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAF7F2]">
            Harbord Dentistry
          </h1>
          <p className="text-xs text-[#FAF7F2]/70">
            Administrative Portal Sign In
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#FAF7F2]/80 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@harborddentistry.com"
              className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-[#FAF7F2] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FAF7F2]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FAF7F2]/80 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-[#FAF7F2] placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FAF7F2]/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FAF7F2] hover:bg-white text-[#0F2E2A] font-bold text-xs rounded-xl shadow-md hover:shadow-lg hover:shadow-[#FAF7F2]/20 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-100 transition-all duration-300 ease-out disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}