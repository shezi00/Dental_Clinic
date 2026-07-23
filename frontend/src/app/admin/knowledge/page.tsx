'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { uploadKnowledgeBase } from '@/services/api';

export default function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      await uploadKnowledgeBase(file);
      setMessage('✅ Knowledge base updated and re-indexed successfully!');
      setFile(null); // Reset file input selection after success
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error connecting to backend server.';
      setMessage(`❌ Error: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border border-[#0F2E2A]/10">
          <div className="text-center mb-6">
            <h1 className="text-xl font-extrabold text-[#0F2E2A] mb-2">
              AI Knowledge Base Management
            </h1>
            <p className="text-xs text-[#0F2E2A]/70 leading-relaxed">
              Upload a replacement PDF containing updated clinic guidelines, pricing, or operating hours. The backend will automatically replace the old document and re-index the vector database instantly.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-5">
            <div className="border-2 border-dashed border-[#0F2E2A]/20 rounded-xl p-6 text-center hover:border-[#0F2E2A]/40 transition-all bg-[#FAF7F2]/50">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-[#0F2E2A] file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F2E2A] file:text-[#FAF7F2] hover:file:bg-[#0F2E2A]/90 cursor-pointer mx-auto"
              />
              {file && (
                <p className="mt-3 text-[11px] font-semibold text-[#0F2E2A]">
                  📄 Selected File: <span className="font-normal">{file.name}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full py-3 bg-[#0F2E2A] text-[#FAF7F2] rounded-xl text-xs font-bold tracking-wide hover:bg-[#0F2E2A]/90 transition-all disabled:opacity-50 shadow-md"
            >
              {uploading ? 'Processing & Re-indexing Vectors...' : 'Upload & Update Knowledge Base'}
            </button>
          </form>

          {message && (
            <div className="mt-5 p-3 rounded-xl bg-[#FAF7F2] border border-[#0F2E2A]/10 text-center">
              <p className="text-xs font-semibold text-[#0F2E2A]">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}