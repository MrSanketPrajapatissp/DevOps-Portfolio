'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Terminal, Cpu, AlertCircle, Layers, CheckCircle, Sun, Moon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000';

export default function ShowcaseDetailPage({ params }) {
  const router = useRouter();
  const [showcase, setShowcase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    async function fetchShowcase() {
      try {
        const res = await fetch(`${API}/api/showcases/${params.slug}/`);
        if (!res.ok) throw new Error('Failed to load showcase details');
        const data = await res.json();
        setShowcase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchShowcase();

    const interval = setInterval(fetchShowcase, 10000);

    const channel = new BroadcastChannel('portfolio_sync');
    channel.onmessage = (e) => {
      if (e.data === 'sync_data') {
        fetchShowcase();
      }
    };

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-terminal">
          <Terminal size={32} style={{ color: 'var(--accent-cyan)' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-green)', marginTop: 16 }}>
            RETRIEVING ARCHITECTURE MATRIX...
          </p>
        </div>
      </div>
    );
  }

  if (error || !showcase) {
    return (
      <div className="error-screen" style={{ padding: 40, color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
        <h3>[!] ERROR: SYSTEM SHOWCASE NOT FOUND</h3>
        <p>{error || 'Showcase data is missing.'}</p>
        <button onClick={() => router.back()} className="deploy-link" style={{ marginTop: 20, background: 'none', border: '1px solid #ef4444', padding: '8px 16px', color: '#ef4444', cursor: 'pointer' }}>
          &lt; RETURN TO CONTROL PLANE
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout incident-report">
      <main className="main-content" style={{ marginLeft: 0, marginTop: 0, minHeight: '100vh', width: '100%' }}>
        <header className="status-bar" style={{ left: 0 }}>
          <div className="status-bar-left">
            <button onClick={() => router.back()} className="detail-back-btn">
              <ArrowLeft size={14} /> BACK_TO_DASHBOARD
            </button>
          </div>
          <div className="status-bar-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={toggleTheme} className="status-bar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)' }}>
              SHOWCASE_ID: {showcase.slug?.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="content-scroll" style={{ padding: '80px 40px 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="showcase-detail-header" style={{ marginBottom: 32, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Cpu size={16} style={{ color: 'var(--accent-purple)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-purple)', fontSize: 13 }}>
                  ARCHITECTURE // SPECIFICATION_SHEET
                </span>
              </div>
              <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
                {showcase.title}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.7, maxWidth: 800, margin: '0 0 24px 0' }}>
                {showcase.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {showcase.technologies?.map(tech => (
                  <span key={tech} className="badge purple" style={{ fontSize: 12, padding: '4px 10px' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {showcase.diagram_image && (
              <div className="incident-diagram">
                <img src={showcase.diagram_image.startsWith('http') ? showcase.diagram_image : `${API}${showcase.diagram_image}`} alt={showcase.title} />
              </div>
            )}

            <div className="incident-sections">
              {showcase.challenge && (
                <div className="incident-section challenge">
                  <h3 className="incident-section-label">
                    <AlertCircle size={16} /> The Challenge
                  </h3>
                  <div className="incident-section-content">
                    <p style={{ margin: 0 }}>{showcase.challenge}</p>
                  </div>
                </div>
              )}

              {showcase.solution && (
                <div className="incident-section solution">
                  <h3 className="incident-section-label">
                    <Layers size={16} /> The Solution
                  </h3>
                  <div className="incident-section-content">
                    <p style={{ margin: 0 }}>{showcase.solution}</p>
                  </div>
                </div>
              )}

              {showcase.impact && (
                <div className="incident-section impact">
                  <h3 className="incident-section-label">
                    <CheckCircle size={16} /> System Impact
                  </h3>
                  <div className="incident-section-content">
                    <p style={{ margin: 0 }}>{showcase.impact}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
