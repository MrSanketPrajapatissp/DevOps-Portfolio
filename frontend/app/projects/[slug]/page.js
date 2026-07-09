'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Github, ExternalLink, Terminal, Calendar, Sun, Moon, 
  Cpu, HardDrive, Network, Play, CheckCircle, AlertCircle, Clock, 
  Database, Layers, FileText, Monitor, RefreshCw, BarChart2 
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL !== undefined ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:8000';

export default function ProjectDetailPage({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

  // Interactive HUD States
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(64);
  const [netSpeed, setNetSpeed] = useState(1.8);
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' or 'readme'
  
  // Interactive CLI State
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleLines, setConsoleLines] = useState([]);
  const terminalEndRef = useRef(null);

  // Diagnostics State
  const [diagStatus, setDiagStatus] = useState('idle'); // 'idle', 'running', 'success'
  const [diagProgress, setDiagProgress] = useState(0);
  const [diagLogs, setDiagLogs] = useState([]);

  // Theme Sync
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

  // Fetch Project Details
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`${API}/api/projects/${params.slug}/`);
        if (!res.ok) throw new Error('Failed to load project details');
        const data = await res.json();
        setProject(data);

        // Initialize Console Lines only if they are currently empty
        setConsoleLines(prev => {
          if (prev.length > 0) return prev;
          return [
            `[SYS] INITIALIZING CORE CONTROL LOGS...`,
            `[SYS] TARGET NODE ID: ${data.slug?.toUpperCase()}`,
            `[SYS] COMPILING CORRELATION MATRIX...`,
            `[GIT] REPO SYNC: ${data.is_github_synced ? 'ACTIVE (SYNCED)' : 'INACTIVE (LOCAL)'}`,
            `[DOCKER] IMAGE RESOLVED: ${data.image ? 'projects/' + data.image.split('/').pop() : 'DEFAULT_ALPINE:LATEST'}`,
            `[DOCKER] CONTAINER HEALTH: OPERATIONAL`,
            `[SYS] CORE DEPLOYMENT SYSTEMS STABLE.`,
            `[SYS] READY. TYPE 'help' FOR A LIST OF AVAILABLE COMMANDS.`,
          ];
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();

    const interval = setInterval(fetchProject, 10000);

    const channel = new BroadcastChannel('portfolio_sync');
    channel.onmessage = (e) => {
      if (e.data === 'sync_data') {
        fetchProject();
      }
    };

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [params.slug]);

  // Telemetry fluctuation simulator
  useEffect(() => {
    if (loading || error || !project) return;
    const interval = setInterval(() => {
      setCpu(prev => {
        const change = (Math.random() - 0.5) * 6;
        return Math.max(4, Math.min(95, Math.round(prev + change)));
      });
      setRam(prev => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(30, Math.min(240, Math.round(prev + change)));
      });
      setNetSpeed(prev => {
        const change = (Math.random() - 0.5) * 0.4;
        return parseFloat(Math.max(0.5, Math.min(9.5, prev + change)).toFixed(1));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [loading, error, project]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLines]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-terminal">
          <Terminal size={32} style={{ color: 'var(--accent-cyan)' }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-green)', marginTop: 16 }}>
            CONNECTING TO LOGGING NODE...
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

  // Helper to resolve Image URL
  const getProjectImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${API}${img}`;
    return `${API}/${img}`;
  };

  const projectImageUrl = getProjectImageUrl(project.image);

  // Command Shell Executor
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const command = consoleInput.trim();
    if (!command) return;

    const parts = command.toLowerCase().split(' ');
    const baseCmd = parts[0];
    const newLines = [`guest@control-plane:~# ${command}`];

    switch (baseCmd) {
      case 'help':
        newLines.push(
          `Available commands:`,
          `  help   - Display available console commands`,
          `  status - Print real-time container & cluster specifications`,
          `  info   - Display project description & metadata`,
          `  tech   - Display core technologies used on this node`,
          `  git    - Show source control configuration & URL`,
          `  live   - Output public live deployment address`,
          `  ping   - Check packet transmission latency to deployment endpoint`,
          `  clear  - Flush console logs and history`
        );
        break;
      case 'clear':
        setConsoleLines([]);
        setConsoleInput('');
        return;
      case 'status':
        newLines.push(
          `--- NODE SPECIFICATIONS ---`,
          `DEPLOYMENT STATUS: ${project.status?.toUpperCase()}`,
          `VIRTUAL_CPU      : ${cpu}% UTILIZATION`,
          `VIRTUAL_MEMORY   : ${ram} MB / 256 MB`,
          `NETWORK_SPEED    : ${netSpeed} MB/s`,
          `NODE_IP          : 172.24.116.${project.id * 7}`,
          `HOST_PORT        : ${project.live_url ? '80/443' : '3000'}`,
          `CONTAINER_RUNTIME: Docker (Alpine Linux)`,
          `CLUSTER_ORCH     : Kubernetes v1.29`
        );
        break;
      case 'info':
        newLines.push(
          `--- METADATA INFO ---`,
          `TITLE      : ${project.title}`,
          `SLUG       : ${project.slug}`,
          `CREATED    : ${new Date(project.created_at).toLocaleDateString()}`,
          `DESCRIPTION: ${project.description || 'No description provided.'}`
        );
        break;
      case 'tech':
        newLines.push(
          `--- TECHNOLOGY STACK ---`,
          ...project.tech_stack.map(tech => `  - ${tech}`)
        );
        break;
      case 'git':
        newLines.push(
          `--- SOURCE REPOSITORY ---`,
          project.github_url ? `URL: ${project.github_url}` : `No repository linked to this deployment node.`
        );
        break;
      case 'live':
        newLines.push(
          `--- DEPLOYMENT ADDRESS ---`,
          project.live_url ? `URL: ${project.live_url}` : `No public deployment path configured.`
        );
        break;
      case 'ping':
        newLines.push(
          `PING ${project.live_url ? new URL(project.live_url).hostname : 'localhost'} (127.0.0.1): 56 data bytes`,
          `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=12.${Math.floor(Math.random()*9)}ms`,
          `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=10.${Math.floor(Math.random()*9)}ms`,
          `64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=14.${Math.floor(Math.random()*9)}ms`,
          `--- ping statistics ---`,
          `3 packets transmitted, 3 packets received, 0.0% packet loss`
        );
        break;
      default:
        newLines.push(`[!] Command not found: '${baseCmd}'. Type 'help' for instructions.`);
        break;
    }

    setConsoleLines(prev => [...prev, ...newLines]);
    setConsoleInput('');
  };

  // Diagnostics Runner
  const runDiagnostics = () => {
    if (diagStatus === 'running') return;
    setDiagStatus('running');
    setDiagProgress(0);
    setDiagLogs([]);

    const diagnosticSteps = [
      { prg: 10, log: 'Establishing link with cluster control plane...' },
      { prg: 25, log: 'Auditing API endpoint connectivity...' },
      { prg: 40, log: 'Checking Kubernetes replica pod bounds...' },
      { prg: 60, log: 'Running security sandbox validation...' },
      { prg: 75, log: 'Verifying environment variable signature matrix...' },
      { prg: 90, log: 'Testing ingress traffic redirect filters...' },
      { prg: 100, log: 'STATUS: ALL CHECKS PASSED. SYSTEM 100% SECURE.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < diagnosticSteps.length) {
        const step = diagnosticSteps[currentStep];
        setDiagProgress(step.prg);
        setDiagLogs(prev => [...prev, `[DIAG] ${step.log}`]);
        currentStep++;
      } else {
        clearInterval(interval);
        setDiagStatus('success');
      }
    }, 450);
  };

  return (
    <div className="app-layout detail-page" style={{ maxWidth: '1400px', padding: '0px 24px 40px' }}>
      
      {/* Dynamic Scanlines Custom Style injection for premium feel */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hud-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.25) 50%
          ), linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.06), 
            rgba(0, 255, 0, 0.02), 
            rgba(0, 0, 255, 0.06)
          );
          background-size: 100% 4px, 6px 100%;
          z-index: 10;
          opacity: 0.15;
        }
        .glow-cyan-border {
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .glow-cyan-border:hover {
          border-color: var(--accent-cyan) !important;
          box-shadow: 0 0 25px rgba(0, 212, 255, 0.35);
        }
        .hud-tab-btn {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 8px 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hud-tab-btn.active {
          color: var(--accent-cyan);
          border-bottom-color: var(--accent-cyan);
          text-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
        }
        .diag-row {
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 4px 8px;
          border-left: 2px solid var(--accent-cyan);
          background: rgba(0, 212, 255, 0.02);
          margin-bottom: 4px;
          border-radius: 0 4px 4px 0;
          animation: slideInDiag 0.2s ease-out forwards;
        }
        @keyframes slideInDiag {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .custom-gauge-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(0,212,255,0.7), var(--accent-cyan));
          box-shadow: 0 0 10px rgba(0,212,255,0.5);
          transition: width 0.4s ease;
        }
        .status-dot-active {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 1.8s infinite;
        }
        .tactical-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 600;
          padding: 14px 20px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .tactical-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: 0.5s;
        }
        .tactical-btn:hover::before {
          left: 100%;
        }
        .tactical-btn:hover {
          transform: translateY(-2px);
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        .tactical-btn.cyan-btn {
          border-color: rgba(0, 212, 255, 0.3);
        }
        .tactical-btn.cyan-btn:hover {
          background: rgba(0, 212, 255, 0.08);
          border-color: var(--accent-cyan);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
        }
        .tactical-btn.green-btn {
          border-color: rgba(16, 185, 129, 0.3);
        }
        .tactical-btn.green-btn:hover {
          background: rgba(16, 185, 129, 0.08);
          border-color: var(--accent-green);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        }
        .tactical-btn.purple-btn {
          border-color: rgba(139, 92, 246, 0.3);
        }
        .tactical-btn.purple-btn:hover {
          background: rgba(139, 92, 246, 0.08);
          border-color: var(--accent-purple);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
        }
        .blueprint-lines {
          background-image: 
            radial-gradient(var(--border-subtle) 1px, transparent 0),
            radial-gradient(var(--border-subtle) 1px, transparent 0);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
          opacity: 0.15;
        }
      ` }} />

      <main className="main-content" style={{ marginLeft: 0, marginTop: 0, minHeight: '100vh', width: '100%', padding: '0px 0px 40px' }}>
        
        {/* TOP STATUS CONTROL BAR */}
        <header className="status-bar" style={{ left: 0, padding: '0px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="status-bar-left">
            <button onClick={() => router.back()} className="detail-back-btn" style={{ margin: 0, display: 'inline-flex', padding: '6px 12px', background: 'none' }}>
              <ArrowLeft size={14} /> BACK_TO_DASHBOARD
            </button>
            <div style={{ height: '16px', width: '1px', background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="status-dot-active" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.5px' }}>
                CORE_NODE: ONLINE
              </span>
            </div>
          </div>
          <div className="status-bar-right" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={toggleTheme} className="status-bar-link" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-secondary)' }}>
              REPORT_NODE: {project.slug?.toUpperCase()}
            </span>
          </div>
        </header>

        {/* HUD LAYOUT GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px', marginTop: '80px' }}>
          
          {/* TOP SUMMARY HERO SECTION */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                color: 'var(--accent-cyan)', 
                fontSize: 12, 
                fontWeight: 'bold',
                background: 'rgba(0, 212, 255, 0.08)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 212, 255, 0.15)'
              }}>
                [SYS_LOGS // {project.status?.toUpperCase()}]
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)', fontSize: 12 }}>
                ESTABLISHED: {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <h1 style={{ 
              fontFamily: "'JetBrains Mono', monospace", 
              fontSize: 'clamp(28px, 4vw, 44px)', 
              fontWeight: 700, 
              color: 'var(--text-primary)', 
              letterSpacing: '-0.5px',
              textShadow: '0 0 15px rgba(226, 232, 240, 0.05)'
            }}>
              {project.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.7', maxWidth: '900px', marginTop: '4px' }}>
              {project.description}
            </p>
          </div>

          {/* MAIN 2-COLUMN PANELS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="lg:grid-cols-12">
            <style dangerouslySetInnerHTML={{ __html: `
              @media (min-width: 1024px) {
                .lg\\:grid-cols-12 {
                  grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
                }
                .lg\\:col-span-8 {
                  grid-column: span 8 / span 8 !important;
                }
                .lg\\:col-span-4 {
                  grid-column: span 4 / span 4 !important;
                }
              }
            `}} />
            
            {/* LEFT COLUMN: PREVIEW BANNER AND TABBED LOG TERMINAL (8 COLS) */}
            <div className="lg:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* BRAND IMAGE FRAME (BROWSER WINDOW DISPLAY) */}
              <div 
                className="glow-cyan-border" 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)', 
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Mock Window Top Bar */}
                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  borderBottom: '1px solid var(--border-subtle)', 
                  padding: '12px 20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                  </div>
                  <div style={{ 
                    fontFamily: "'JetBrains Mono', monospace", 
                    fontSize: '11px', 
                    color: 'var(--text-muted)',
                    background: 'var(--bg-deep)',
                    padding: '3px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <Monitor size={10} /> browser://mock-server/{project.slug}/index.html
                  </div>
                  <div style={{ width: '30px' }} />
                </div>

                {/* Banner Screen Container */}
                <div style={{ position: 'relative', minHeight: '360px', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  
                  {/* Grid Lines Overlay */}
                  <div className="blueprint-lines" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
                  <div className="hud-scanlines" />

                  {projectImageUrl ? (
                    /* RENDER UPLOADED IMAGE */
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      style={{ width: '100%', height: '100%', minHeight: '360px', display: 'flex', zIndex: 2 }}
                    >
                      <img 
                        src={projectImageUrl} 
                        alt={`${project.title} Banner Image`} 
                        style={{ 
                          width: '100%', 
                          objectFit: 'contain', 
                          maxHeight: '440px',
                          display: 'block',
                          margin: 'auto',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
                        }}
                      />
                    </motion.div>
                  ) : (
                    /* FALLBACK HOLOGRAM VISUALIZER */
                    <div style={{ 
                      zIndex: 2, 
                      textAlign: 'center', 
                      fontFamily: "'JetBrains Mono', monospace",
                      padding: '40px'
                    }}>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        style={{ 
                          margin: '0 auto 20px', 
                          width: '80px', 
                          height: '80px', 
                          border: '2px dashed var(--accent-cyan)', 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--glow-cyan)'
                        }}
                      >
                        <Layers size={32} style={{ color: 'var(--accent-cyan)' }} />
                      </motion.div>
                      <h4 style={{ color: 'var(--accent-cyan)', fontSize: '15px', fontWeight: 'bold', marginBottom: '4px' }}>
                        ACTIVE VISUALIZATION EMULATOR
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                        NO EXTERNALLY UPLOADED PREVIEW DETECTED // EMULATING SYSTEM WIREFRAME
                      </p>
                    </div>
                  )}

                  {/* Corner Target Indicators */}
                  <div style={{ position: 'absolute', top: 12, left: 12, width: 8, height: 8, borderTop: '2px solid rgba(0,212,255,0.4)', borderLeft: '2px solid rgba(0,212,255,0.4)', zIndex: 3 }} />
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderTop: '2px solid rgba(0,212,255,0.4)', borderRight: '2px solid rgba(0,212,255,0.4)', zIndex: 3 }} />
                  <div style={{ position: 'absolute', bottom: 12, left: 12, width: 8, height: 8, borderBottom: '2px solid rgba(0,212,255,0.4)', borderLeft: '2px solid rgba(0,212,255,0.4)', zIndex: 3 }} />
                  <div style={{ position: 'absolute', bottom: 12, right: 12, width: 8, height: 8, borderBottom: '2px solid rgba(0,212,255,0.4)', borderRight: '2px solid rgba(0,212,255,0.4)', zIndex: 3 }} />
                  
                  {/* Floating Telemetry Badge Overlay */}
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 12, 
                    right: 12, 
                    background: 'rgba(5, 10, 20, 0.8)', 
                    border: '1px solid var(--border-subtle)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '9px',
                    color: 'var(--text-secondary)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 4
                  }}>
                    RESOLVING: {project.image ? 'IMAGE_ASSET_READY' : 'MOCK_GRID_EMULATOR'}
                  </div>
                </div>
              </div>

              {/* TABBED INTERACTIVE LOGS & DOCUMENT WORKSPACE */}
              <div 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '400px',
                  overflow: 'hidden'
                }}
              >
                {/* Tabs selection header */}
                <div style={{ 
                  background: 'var(--bg-secondary)', 
                  borderBottom: '1px solid var(--border-subtle)', 
                  padding: '4px 12px 0px', 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button 
                    onClick={() => setActiveTab('logs')}
                    className={`hud-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Terminal size={12} /> [1] PIPELINE_SHELL.LOG
                  </button>
                  <button 
                    onClick={() => setActiveTab('readme')}
                    className={`hud-tab-btn ${activeTab === 'readme' ? 'active' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <FileText size={12} /> [2] DOCUMENTATION.MD
                  </button>
                </div>

                {/* Tab content workspace */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
                  
                  {activeTab === 'logs' ? (
                    /* INTERACTIVE TERMINAL CONSOLE LOGS & CLI SHELL */
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: '1.6' }}>
                      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '380px', marginBottom: '16px', color: '#10b981' }}>
                        {consoleLines.map((line, index) => (
                          <div 
                            key={index} 
                            style={{ 
                              whiteSpace: 'pre-wrap', 
                              wordBreak: 'break-all',
                              color: line.startsWith('guest@') ? 'var(--accent-cyan)' : (line.includes('[!]') ? 'var(--accent-red)' : '#10b981'),
                              marginBottom: '6px'
                            }}
                          >
                            {line}
                          </div>
                        ))}
                        <div ref={terminalEndRef} />
                      </div>

                      {/* Interactive prompt input */}
                      <form onSubmit={handleCommandSubmit} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        borderTop: '1px solid var(--border-subtle)', 
                        paddingTop: '12px' 
                      }}>
                        <span style={{ color: 'var(--accent-cyan)', marginRight: '8px', fontWeight: 'bold' }}>guest@control-plane:~#</span>
                        <input 
                          type="text" 
                          value={consoleInput}
                          onChange={(e) => setConsoleInput(e.target.value)}
                          placeholder="Type 'help' and press Enter..."
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            outline: 'none', 
                            color: '#10b981', 
                            fontFamily: "'JetBrains Mono', monospace", 
                            fontSize: '13px',
                            flex: 1
                          }}
                        />
                      </form>
                    </div>
                  ) : (
                    /* PARSED README MARKDOWN REPORT */
                    <div className="detail-readme" style={{ overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
                      {project.readme_html ? (
                        <>
                          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Terminal size={12} /> parsed_readme_output.log
                          </div>
                          <div dangerouslySetInnerHTML={{ __html: project.readme_html }} />
                        </>
                      ) : (
                        <div style={{ 
                          background: 'var(--bg-deep)', 
                          border: '1px solid var(--border-subtle)', 
                          borderRadius: 8, 
                          padding: '60px 40px', 
                          textAlign: 'center', 
                          color: 'var(--text-muted)', 
                          fontFamily: "'JetBrains Mono', monospace" 
                        }}>
                          <AlertCircle size={32} style={{ color: 'var(--accent-amber)', margin: '0 auto 12px' }} />
                          <h4 style={{ color: 'var(--text-primary)', marginBottom: 4 }}>NO DOCUMENTATION MATRIX RECORDED</h4>
                          <p style={{ fontSize: '12px' }}>This project has no external README markdown documentation attached.</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: TELEMETRY DIAGNOSTICS & HARDWARE SPEC INFO (4 COLS) */}
            <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* WIDGET 1: TELEMETRY METERS */}
              <div 
                className="glow-cyan-border" 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)', 
                  padding: '24px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <BarChart2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    Telemetry Resource Meters
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Gauge: CPU */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Cpu size={12} /> CPU UTILIZATION
                      </span>
                      <span style={{ color: cpu > 80 ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>{cpu}%</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-deep)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(30, 58, 95, 0.3)' }}>
                      <div 
                        className="custom-gauge-fill" 
                        style={{ 
                          width: `${cpu}%`,
                          background: cpu > 80 ? 'var(--accent-red)' : (cpu > 60 ? 'var(--accent-amber)' : 'linear-gradient(90deg, rgba(0,212,255,0.7), var(--accent-cyan))')
                        }} 
                      />
                    </div>
                  </div>

                  {/* Gauge: Memory */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HardDrive size={12} /> CONTAINER MEMORY
                      </span>
                      <span>{ram}MB / 256MB</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-deep)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(30, 58, 95, 0.3)' }}>
                      <div className="custom-gauge-fill" style={{ width: `${(ram / 256) * 100}%` }} />
                    </div>
                  </div>

                  {/* Gauge: Network Speed */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Network size={12} /> INGRESS THROUGHPUT
                      </span>
                      <span>{netSpeed} MB/s</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg-deep)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(30, 58, 95, 0.3)' }}>
                      <div className="custom-gauge-fill" style={{ width: `${(netSpeed / 10) * 100}%`, background: 'var(--accent-green)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET 2: RUN DIAGNOSTICS CONTROL UNIT */}
              <div 
                className="glow-cyan-border" 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)', 
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Play size={16} style={{ color: 'var(--accent-purple)' }} />
                  <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    Diagnostics Engine
                  </h3>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: '1.5' }}>
                  Initialize manual sandbox diagnostics on Kubernetes node pods to audit core routing states.
                </p>

                {diagStatus === 'idle' && (
                  <button onClick={runDiagnostics} className="tactical-btn purple-btn" style={{ width: '100%', outline: 'none' }}>
                    <Play size={13} /> RUN COMPREHENSIVE SCAN
                  </button>
                )}

                {diagStatus === 'running' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginBottom: 6 }}>
                      <span style={{ color: 'var(--accent-purple)' }} className="animate-pulse">SCANNING PORT CORES...</span>
                      <span>{diagProgress}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-deep)', borderRadius: 3, overflow: 'hidden', marginBottom: 16 }}>
                      <div style={{ height: '100%', width: `${diagProgress}%`, background: 'var(--accent-purple)', transition: 'width 0.2s' }} />
                    </div>
                    <div style={{ maxHeight: 120, overflowY: 'auto', background: 'var(--bg-deep)', padding: 8, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                      {diagLogs.map((log, i) => (
                        <div key={i} className="diag-row">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {diagStatus === 'success' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ 
                      background: 'rgba(16, 185, 129, 0.08)', 
                      border: '1px solid var(--accent-green)',
                      padding: 12,
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--accent-green)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '11px'
                    }}>
                      <CheckCircle size={16} /> DIAGNOSTICS COMPLETED: STATUS STABLE
                    </div>
                    <button onClick={runDiagnostics} className="tactical-btn purple-btn" style={{ width: '100%', outline: 'none' }}>
                      <RefreshCw size={13} /> RE-RUN ANALYSIS
                    </button>
                  </div>
                )}
              </div>

              {/* WIDGET 3: CLUSTER SPECIFICATION */}
              <div 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)', 
                  padding: '24px',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Database size={16} style={{ color: 'var(--accent-amber)' }} />
                  <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    Operational Specs
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(30, 58, 95, 0.3)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>CONTAINER ID</span>
                    <span style={{ color: 'var(--text-primary)' }}>POD-{project.id * 1024}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(30, 58, 95, 0.3)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>MAPPING ROUTE</span>
                    <span style={{ color: 'var(--text-primary)' }}>/{project.slug}/*</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(30, 58, 95, 0.3)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)' }}>CLUSTER ENDPOINT</span>
                    <span style={{ color: 'var(--text-primary)' }}>k8s.internal.net</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>IS SYNCED</span>
                    <span style={{ color: project.is_github_synced ? 'var(--accent-green)' : 'var(--accent-amber)' }}>
                      {project.is_github_synced ? 'GITHUB ACTIVE' : 'LOCAL CACHED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* WIDGET 4: TECHNOLOGIES ACCENTS */}
              <div 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-subtle)', 
                  background: 'var(--bg-primary)', 
                  padding: '24px'
                }}
              >
                <div style={{ 
                  fontFamily: "'JetBrains Mono', monospace", 
                  fontSize: 13, 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  marginBottom: 16, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8 
                }}>
                  <Layers size={16} style={{ color: 'var(--accent-cyan)' }} />
                  Tech Stack Integration
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {project.tech_stack?.map(tech => (
                    <span 
                      key={tech} 
                      className="badge cyan" 
                      style={{ 
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11, 
                        padding: '6px 12px',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        background: 'rgba(0, 212, 255, 0.03)',
                        textTransform: 'none'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* WIDGET 5: TACTICAL ACTION LINKS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {project.github_url && (
                  <a 
                    href={project.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="tactical-btn cyan-btn"
                  >
                    <Github size={16} /> VIEW SOURCE CODE (GITHUB)
                  </a>
                )}

                {project.live_url && (
                  <a 
                    href={project.live_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="tactical-btn green-btn"
                  >
                    <ExternalLink size={16} /> CONNECT TO LIVE ENDPOINT
                  </a>
                )}
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
