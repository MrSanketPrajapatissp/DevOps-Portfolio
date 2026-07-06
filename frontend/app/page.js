'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, ChevronDown, ChevronRight, Terminal, Activity, Shield, Cloud, Code, Box, GitBranch, Settings, Clock, MapPin, Send, CheckCircle, Award, Briefcase, Server, ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const iconMap = { github: Github, linkedin: Linkedin, twitter: Twitter, mail: Mail };
const categoryIcons = { cloud: Cloud, code: Code, box: Box, 'git-branch': GitBranch, activity: Activity, terminal: Terminal, shield: Shield };

function getStatusColor(s) {
  return { available: '#10b981', open: '#f59e0b', unavailable: '#ef4444', deployed: '#10b981', in_progress: '#f59e0b', archived: '#64748b', obtained: '#10b981', expired: '#ef4444' }[s] || '#94a3b8';
}

// ─── TERMINAL BOOT ─────────────────────────────────────────
const BOOT_LINES = [
  '> INITIALIZING CONTROL PLANE...',
  '> LOADING MODULES.................. [OK]',
  '> ESTABLISHING CONNECTIONS......... [OK]',
  '> VERIFYING CREDENTIALS............ [OK]',
  '> SYSTEM STATUS: ONLINE',
];

function TerminalBoot({ onComplete }) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const currentLine = BOOT_LINES[i];
        if (currentLine) {
          setLines(prev => [...prev, currentLine]);
        }
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 400);
      }
    }, 350);
    return () => clearInterval(interval);
  }, [onComplete]);
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.8 }}>
      {lines.map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}
          style={{ color: (line?.includes('[OK]') || line?.includes('ONLINE')) ? '#10b981' : '#00d4ff' }}>
          {line}
        </motion.div>
      ))}
      {lines.length < BOOT_LINES.length && (
        <span style={{ color: '#10b981' }} className="terminal-cursor">▌</span>
      )}
    </div>
  );
}

// ─── PARTICLE FIELD ────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 50; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, r: Math.random() * 2 + 1 });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.3)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / 120)})`; ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

// ─── SCROLL REVEAL ─────────────────────────────────────────
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -30 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

// ─── SIDEBAR ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'identity', label: 'Identity', icon: Terminal },
  { id: 'skills', label: 'Skills Matrix', icon: Activity },
  { id: 'deployments', label: 'Deployments', icon: Server },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
  { id: 'architecture', label: 'Architecture', icon: Cloud },
  { id: 'contact', label: 'Contact', icon: Send },
];

function Sidebar({ activeSection, socialLinks, isSidebarOpen, setIsSidebarOpen, operatorName }) {
  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">OP</div>
        <div>
          <div className="sidebar-brand-text">{operatorName?.toUpperCase() || 'ALEX CHEN'}</div>
          <div className="sidebar-brand-version">CONTROL PLANE v1.0</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">System Modules</div>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <a key={item.id} href={`#${item.id}`} className={`sidebar-nav-item ${isActive ? 'active' : ''}`} onClick={() => setIsSidebarOpen(false)}>
              <span className="sidebar-nav-dot" style={{ background: isActive ? '#10b981' : '#1e3a5f', animation: isActive ? 'pulse 2s ease-in-out infinite' : 'none' }} />
              <Icon className="sidebar-nav-icon" size={16} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
      <div className="sidebar-social">
        {socialLinks?.map(link => {
          const Icon = iconMap[link.icon_class] || ExternalLink;
          return (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="sidebar-social-link" aria-label={link.platform}>
              <Icon size={16} />
            </a>
          );
        })}
      </div>
    </aside>
  );
}

// ─── STATUS BAR ────────────────────────────────────────────
function StatusBar({ theme, toggleTheme }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Date().toISOString().slice(11, 19));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <span className="status-dot online" /> ALL SYSTEMS OPERATIONAL
      </div>
      <div className="status-bar-right">
        <button onClick={toggleTheme} className="status-bar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} aria-label="Toggle light/dark theme">
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
        <Clock size={14} style={{ marginLeft: 8 }} /> <span className="status-bar-time" style={{ marginLeft: 4 }}>{time} UTC</span>
        <a href="/admin-portal" className="status-bar-link" aria-label="Admin settings"><Settings size={14} /></a>
      </div>
    </div>
  );
}

// ─── HERO SECTION ──────────────────────────────────────────
function HeroSection({ hero, summary }) {
  const [bootDone, setBootDone] = useState(false);
  if (!hero) return null;
  return (
    <section id="identity" className="section hero-section">
      <div className="hero-terminal-side">
        <div className="terminal-container">
          <div className="terminal-header">
            <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
            <span className="terminal-title">system_info.sh</span>
          </div>
          <div className="terminal-body">
            {!bootDone ? (
              <TerminalBoot onComplete={() => setBootDone(true)} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                className="hero-readout">
                <div className="hero-readout-item">
                  <span className="hero-readout-key">operator</span>
                  <span className="hero-readout-value" style={{ fontSize: '18px', fontWeight: 'bold', color: '#00d4ff' }}>{hero.name}</span>
                </div>
                <div className="hero-readout-item">
                  <span className="hero-readout-key">role</span>
                  <span className="hero-readout-value" style={{ fontWeight: '600', color: '#e2e8f0' }}>{hero.title}</span>
                </div>
                <div className="hero-readout-item">
                  <span className="hero-readout-key">status</span>
                  <span className={`hero-readout-value status-${hero.availability_status}`}>
                    {hero.availability_status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="hero-readout-item">
                  <span className="hero-readout-key">location</span>
                  <span className="hero-readout-value"><MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />{hero.location}</span>
                </div>
                <div className="hero-readout-item">
                  <span className="hero-readout-key">uptime</span>
                  <span className="hero-readout-value">{hero.years_experience}+ years</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        {bootDone && hero.tagline && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="hero-tagline">{hero.tagline}</motion.p>
        )}
      </div>
      <div className="hero-particle-side">
        <div className="particle-container">
          <ParticleField />
        </div>
      </div>
      {bootDone && summary?.content && (
        <ScrollReveal delay={0.2}>
          <div style={{ gridColumn: 'span 2', marginTop: '32px' }} className="summary-panel">
            <h3 className="section-label">professional summary</h3>
            <p className="summary-text" style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.7', background: 'rgba(16, 34, 64, 0.2)', padding: '20px', borderRadius: '8px', border: '1px solid #1e3a5f' }}>{summary.content}</p>
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}

// ─── SKILLS SECTION ────────────────────────────────────────
function SkillsSection({ categories }) {
  return (
    <section id="skills" className="section skills-section">
      <h2 className="section-title"><Activity size={20} /> SKILLS MATRIX</h2>
      {!categories?.length ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px' }}>
          &gt; NO SKILLS CATEGORIES RECORDED IN DATABASE.
        </div>
      ) : (
        <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {categories.map((cat, ci) => {
            const Icon = categoryIcons[cat.icon] || Code;
            return (
              <ScrollReveal key={cat.id} delay={ci * 0.08}>
                <div className="skill-category-group">
                  <h3 className="skill-category-label"><Icon size={16} /> {cat.name}</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {cat.skills?.map((skill) => (
                      <span key={skill.id} className="badge cyan" style={{ padding: '6px 12px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'none' }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── PROJECTS SECTION ──────────────────────────────────────
function ProjectsSection({ projects }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <section id="deployments" className="section">
      <h2 className="section-title"><Server size={20} /> DEPLOYMENT LOG</h2>
      {!projects?.length ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px' }}>
          &gt; NO DEPLOYMENTS REPORTED IN DATABASE.
        </div>
      ) : (
        <div className="deployment-log">
          <div className="deployment-log-header">
            <span>Timestamp</span>
            <span>Log Entry / Status</span>
          </div>
          {projects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.06}>
              <div style={{ borderBottom: i < projects.length - 1 ? '1px solid rgba(30, 58, 95, 0.3)' : 'none' }}>
                <div className={`deployment-entry ${expanded === p.id ? 'expanded' : ''}`} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <span className="deployment-timestamp">[{new Date(p.created_at).toISOString().slice(0, 10)}]</span>
                  <span className="deployment-action">DEPLOY</span>
                  <span className="deployment-name">{p.slug}</span>
                  <span className="deployment-dots">{'·'.repeat(Math.max(2, 40 - (p.slug?.length || 0)))}</span>
                  <span className={`deployment-status ${p.status}`} style={{ color: getStatusColor(p.status) }}>
                    <span className={`deployment-status-dot ${p.status}`} />
                    {p.status?.toUpperCase()}
                  </span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    {expanded === p.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                </div>
                <AnimatePresence>
                  {expanded === p.id && (
                    <motion.div className="deployment-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <p className="deployment-detail-description">{p.description}</p>
                      <div className="deployment-detail-section">
                        <div className="deployment-detail-label">Technologies</div>
                        <div className="deployment-detail-techs">
                          {p.tech_stack?.map(t => <span key={t} className="badge cyan">{t}</span>)}
                        </div>
                      </div>
                      <div className="deployment-detail-links">
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="deployment-detail-link">
                            <Github size={12} /> Repository
                          </a>
                        )}
                        {p.live_url && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="deployment-detail-link" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            <ExternalLink size={12} /> Live Link
                          </a>
                        )}
                        <a href={`/projects/${p.slug}`} className="deployment-detail-link">
                          <ExternalLink size={12} /> Full Report
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── CERTIFICATIONS SECTION ────────────────────────────────
function CertificationsSection({ certifications }) {
  return (
    <section id="certifications" className="section">
      <h2 className="section-title"><Award size={20} /> CREDENTIALS REGISTRY</h2>
      {!certifications?.length ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px' }}>
          &gt; NO CREDENTIALS UPLOADED TO REGISTRY.
        </div>
      ) : (
        <div className="credentials-registry">
          <div className="credentials-header">
            <span>Credential</span><span>Issuer</span><span>Date</span><span>Status</span>
          </div>
          {certifications.map((cert, i) => (
            <ScrollReveal key={cert.id} delay={i * 0.06}>
              <div className="credential-row">
                <span className="credential-name">
                  {cert.credential_url ? (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                      {cert.name} <ExternalLink size={12} style={{ display: 'inline', marginLeft: 4 }} />
                    </a>
                  ) : (
                    cert.name
                  )}
                </span>
                <span className="credential-issuer">{cert.issuer}</span>
                <span className="credential-date">{cert.date_obtained ? new Date(cert.date_obtained).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '—'}</span>
                <span className="credential-status">
                  <span className={`status-badge ${cert.status}`} style={{ color: getStatusColor(cert.status) }}>
                    {cert.status === 'in_progress' && <span className="pulse-dot" style={{ background: '#f59e0b' }} />}
                    {cert.status === 'obtained' && <CheckCircle size={14} className="credential-status-icon" />}
                    {cert.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── EXPERIENCE SECTION (HORIZONTAL PIPELINE) ──────────────
function ExperienceSection({ experience }) {
  const [active, setActive] = useState(0);
  return (
    <section id="pipeline" className="section">
      <h2 className="section-title"><GitBranch size={20} /> CAREER PIPELINE</h2>
      {!experience?.length ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px' }}>
          &gt; NO PIPELINE STAGES IN INITIALIZED STATE.
        </div>
      ) : (
        <div className="pipeline-container">
          <div className="pipeline-stages">
            {experience.map((exp, i) => (
              <div key={exp.id} className="pipeline-stage-wrapper">
                <div className={`pipeline-stage ${active === i ? 'selected' : ''} ${exp.is_current ? 'current' : ''}`}
                  onClick={() => setActive(i)}>
                  <div className="pipeline-stage-header">
                    <span className="pipeline-stage-role">{exp.role}</span>
                    {exp.is_current ? (
                      <span className="pipeline-stage-badge current">Current</span>
                    ) : (
                      <span className="pipeline-stage-badge completed">Done</span>
                    )}
                  </div>
                  <div className="pipeline-stage-company">{exp.company}</div>
                  <div className="pipeline-stage-date">
                    {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {exp.is_current ? 'PRESENT' : new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </div>
                </div>
                {i < experience.length - 1 && (
                  <div className="pipeline-connector">
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
          {experience[active] && (
            <AnimatePresence mode="wait">
              <motion.div key={active} className="pipeline-detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff', fontSize: '18px', marginBottom: '4px' }}>{experience[active]?.role}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace" }}>{experience[active]?.company} {experience[active]?.company_url && <a href={experience[active].company_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}><ExternalLink size={12} style={{ display: 'inline' }} /></a>}</p>
                
                <div className="pipeline-detail-section">
                  <div className="pipeline-detail-label">Scope of Operations</div>
                  <p className="pipeline-detail-description" style={{ margin: 0 }}>{experience[active]?.description}</p>
                </div>

                <div className="pipeline-detail-section">
                  <div className="pipeline-detail-label">Automated Actions / Achievements</div>
                  <ul className="pipeline-achievements">
                    {experience[active]?.achievements?.map((a, i) => (
                      <li key={i} className="pipeline-achievement-item">
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pipeline-detail-section">
                  <div className="pipeline-detail-label">Operational Tooling</div>
                  <div className="pipeline-technologies">
                    {experience[active]?.technologies?.map(t => <span key={t} className="badge purple">{t}</span>)}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </section>
  );
}

// ─── SHOWCASES SECTION ─────────────────────────────────────
function ShowcasesSection({ showcases }) {
  return (
    <section id="architecture" className="section">
      <h2 className="section-title"><Cloud size={20} /> ARCHITECTURE BRIEFS</h2>
      {!showcases?.length ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", color: '#475569', border: '1px dashed #1e3a5f', borderRadius: '8px' }}>
          &gt; NO SYSTEM ARCHITECTURE SPECS FILED.
        </div>
      ) : (
        <div className="showcases-grid">
          {showcases.map((sc, i) => (
            <ScrollReveal key={sc.id} delay={i * 0.1}>
              <a href={`/showcases/${sc.slug}`} className="showcase-panel">
                <div className="showcase-bg" style={{ backgroundImage: `url(${sc.diagram_image ? (sc.diagram_image.startsWith('http') ? sc.diagram_image : `${API}${sc.diagram_image}`) : ''})` }} />
                <div className="showcase-overlay" />
                <div className="showcase-content">
                  <h3 className="showcase-title">{sc.title}</h3>
                  <p className="showcase-description">{sc.description}</p>
                  <div className="showcase-tech-badges">
                    {sc.technologies?.slice(0, 5).map(t => <span key={t} className="badge cyan">{t}</span>)}
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── CONTACT SECTION ───────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contact/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch { setStatus('error'); }
    setLoading(false);
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <section id="contact" className="section">
      <h2 className="section-title"><Send size={20} /> TRANSMISSION</h2>
      <div className="contact-terminal">
        <div className="terminal-header">
          <span className="terminal-dot red" /><span className="terminal-dot amber" /><span className="terminal-dot green" />
          <span className="terminal-title">send_message.sh</span>
        </div>
        <form onSubmit={handleSubmit} className="contact-form" style={{ padding: '20px' }}>
          <div className="contact-field">
            <span className="contact-prompt">$</span>
            <label className="contact-label" style={{ minWidth: '90px' }}>name<span className="term-sep">:</span></label>
            <input className="contact-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="operator identity" />
          </div>
          <div className="contact-field">
            <span className="contact-prompt">$</span>
            <label className="contact-label" style={{ minWidth: '90px' }}>email<span className="term-sep">:</span></label>
            <input className="contact-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="comms channel" />
          </div>
          <div className="contact-field">
            <span className="contact-prompt">$</span>
            <label className="contact-label" style={{ minWidth: '90px' }}>subject<span className="term-sep">:</span></label>
            <input className="contact-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required placeholder="transmission header" />
          </div>
          <div className="contact-field" style={{ borderBottom: 'none' }}>
            <span className="contact-prompt">$</span>
            <label className="contact-label" style={{ minWidth: '90px' }}>message<span className="term-sep">:</span></label>
            <textarea className="contact-textarea" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="transmission payload..." rows={4} />
          </div>
          <button type="submit" className="contact-submit" disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? '> TRANSMITTING...' : '> EXECUTE'} <Send size={14} style={{ display: 'inline', marginLeft: 6 }} />
          </button>
          {status === 'success' && <p className="contact-response success" style={{ marginTop: '16px' }}>✓ Message transmitted successfully.</p>}
          {status === 'error' && <p className="contact-response error" style={{ marginTop: '16px' }}>✗ Transmission failed. Try again.</p>}
        </form>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function HomePage() {
  const [data, setData] = useState({});
  const [activeSection, setActiveSection] = useState('identity');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    async function fetchAll() {
      try {
        const endpoints = ['hero', 'summary', 'skill-categories', 'projects', 'certifications', 'experience', 'showcases', 'social-links'];
        const responses = await Promise.all(endpoints.map(e => fetch(`${API}/api/${e}/`).then(r => r.ok ? r.json() : null).catch(() => null)));
        setData({
          hero: responses[0], summary: responses[1],
          categories: responses[2], projects: responses[3],
          certifications: responses[4], experience: responses[5],
          showcases: responses[6], socialLinks: responses[7],
        });
      } catch (err) { console.error('Fetch error:', err); }
      setLoading(false);
    }
    fetchAll();
  }, []);

  // Scroll spy
  useEffect(() => {
    const ids = NAV_ITEMS.map(n => n.id);
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loading]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-terminal">
          <Terminal size={32} style={{ color: '#00d4ff' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: '#10b981', marginTop: 16 }}>
            LOADING CONTROL PLANE...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle navigation drawer">
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`mobile-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />
      
      <Sidebar activeSection={activeSection} socialLinks={data.socialLinks} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} operatorName={data.hero?.name} />
      <main className="main-content">
        <StatusBar theme={theme} toggleTheme={toggleTheme} />
        <div className="content-scroll">
          <HeroSection hero={data.hero} summary={data.summary} />
          <SkillsSection categories={data.categories} />
          <ProjectsSection projects={data.projects} />
          <CertificationsSection certifications={data.certifications} />
          <ExperienceSection experience={data.experience} />
          <ShowcasesSection showcases={data.showcases} />
          <ContactSection />
          <footer className="footer">
            <p>CONTROL PLANE v1.0 — Built with Django + Next.js</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
