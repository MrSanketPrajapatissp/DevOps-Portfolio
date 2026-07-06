'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Terminal, Calendar, Sun, Moon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
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
    async function fetchProject() {
      try {
        const res = await fetch(`${API}/api/projects/${params.slug}/`);
        if (!res.ok) throw new Error('Failed to load project details');
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-terminal">
          <Terminal size={32} style={{ color: '#00d4ff' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', marginTop: 16 }}>
            FETCHING DEPLOYMENT DATA...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="error-screen" style={{ padding: 40, color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>
        <h3>[!] ERROR: DEPLOYMENT LOG NOT FOUND</h3>
        <p>{error || 'Project data is missing.'}</p>
        <button onClick={() => router.back()} className="deploy-link" style={{ marginTop: 20, background: 'none', border: '1px solid #ef4444', padding: '8px 16px', color: '#ef4444', cursor: 'pointer' }}>
          &lt; RETURN TO CONTROL PLANE
        </button>
      </div>
    );
  }

  return (
    <div className="app-layout detail-page">
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
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#94a3b8' }}>
              REPORT_ID: {project.slug?.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="content-scroll" style={{ padding: '80px 40px 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="detail-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span className={`status-dot ${project.status}`} style={{ background: project.status === 'deployed' ? '#10b981' : '#f59e0b' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff', fontSize: 13 }}>
                  SYSTEM_DEPLOYMENT // STATUS: {project.status?.toUpperCase()}
                </span>
              </div>
              <h1 className="detail-title">
                {project.title}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, maxWidth: '800px', marginBottom: 24 }}>
                {project.description}
              </p>

              <div className="detail-meta">
                <div className="detail-meta-item">
                  <Calendar size={14} style={{ color: '#00d4ff' }} />
                  <span>CREATED: {new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                {project.is_github_synced && (
                  <div className="detail-meta-item">
                    <Github size={14} style={{ color: '#10b981' }} />
                    <span>GITHUB SYNCED</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-content">
              <div className="detail-main">
                {project.readme_html ? (
                  <div className="detail-readme">
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: '#475569', borderBottom: '1px solid #1e3a5f', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Terminal size={14} /> parsed_readme_output.log
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: project.readme_html }} />
                  </div>
                ) : (
                  <div style={{ background: '#0a1628', border: '1px solid #1e3a5f', borderRadius: 4, padding: 40, textAlign: 'center', color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
                    NO EXTERNAL README CONTENT ATTAED TO THIS LOG
                  </div>
                )}
              </div>

              <div className="detail-sidebar-info">
                <div className="detail-sidebar-section">
                  <div className="detail-sidebar-label">Technologies</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {project.tech_stack?.map(tech => (
                      <span key={tech} className="badge cyan" style={{ fontSize: 11, padding: '2px 8px' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.github_url && (
                  <div className="detail-sidebar-section">
                    <div className="detail-sidebar-label">Source Control</div>
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="deployment-detail-link" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}>
                      <Github size={14} /> View on GitHub
                    </a>
                  </div>
                )}

                {project.live_url && (
                  <div className="detail-sidebar-section">
                    <div className="detail-sidebar-label">Active Link</div>
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="deployment-detail-link" style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      <ExternalLink size={14} /> Live Deployment
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
