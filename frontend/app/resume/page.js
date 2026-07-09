'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Terminal, Sun, Moon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000';

export default function ResumePage() {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch(`${API}/api/resume/`);
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        }
      } catch (err) {
        console.error('Failed to load resume:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResume();

    const interval = setInterval(fetchResume, 10000);

    const channel = new BroadcastChannel('portfolio_sync');
    channel.onmessage = (e) => {
      if (e.data === 'sync_data') {
        fetchResume();
      }
    };

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-terminal">
          <Terminal size={32} style={{ color: 'var(--accent-cyan)' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-green)', marginTop: 16 }}>
            RETRIEVING DOCUMENT MATRIX...
          </p>
        </div>
      </div>
    );
  }

  const resumeUrl = resume?.file ? (resume.file.startsWith('http') ? resume.file : `${API}${resume.file}`) : null;

  return (
    <div className="app-layout" style={{ display: 'block' }}>
      <main className="main-content" style={{ marginLeft: 0, width: '100%' }}>
        <div className="status-bar" style={{ left: 0 }}>
          <div className="status-bar-left">
            <button onClick={() => router.back()} className="detail-back-btn" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeft size={14} /> BACK_TO_DASHBOARD
            </button>
          </div>
          <div className="status-bar-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={toggleTheme} className="status-bar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>
              MODULE: RESUME_READER
            </span>
          </div>
        </div>

        <div className="content-scroll" style={{ padding: '80px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 24, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileText size={24} style={{ color: 'var(--accent-cyan)' }} /> RESUME_CV
            </h1>
          </div>

          {resumeUrl ? (
            <div style={{ width: '100%', maxWidth: 900, height: '80vh', border: '1px solid var(--border-subtle)', borderRadius: 4, overflow: 'hidden', background: 'var(--bg-primary)' }}>
              <iframe src={`${resumeUrl}#toolbar=0`} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: 900, border: '1px solid var(--border-subtle)', borderRadius: 4, padding: 80, background: 'var(--bg-primary)', textAlign: 'center', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              <p>[!] NO ACTIVE RESUME UPLOADED YET</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>Please upload a resume in the admin portal to view and download it here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
