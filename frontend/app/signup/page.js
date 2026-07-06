'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, isAuthenticated } from '@/lib/auth';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#050a14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '24px',
  },
  terminal: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#0a1628',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.05)',
    position: 'relative',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#111d33',
    borderBottom: '1px solid #1e3a5f',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  titleText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#475569',
    marginLeft: '8px',
    letterSpacing: '0.05em',
  },
  body: {
    padding: '32px',
  },
  header: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    fontWeight: 700,
    color: '#00d4ff',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  prompt: {
    color: '#10b981',
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#475569',
    marginBottom: '32px',
    paddingLeft: '20px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '6px',
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#00d4ff',
    border: 'none',
    borderRadius: '6px',
    color: '#050a14',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.05em',
    marginTop: '8px',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  error: {
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#ef4444',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    padding: '16px 0 0',
    borderTop: '1px solid rgba(30, 58, 95, 0.5)',
  },
  footerText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#475569',
  },
  footerLink: {
    color: '#00d4ff',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.2s ease',
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.01) 2px, rgba(0, 212, 255, 0.01) 4px)',
    pointerEvents: 'none',
    borderRadius: '12px',
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/admin-portal');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      router.push('/admin-portal');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.terminal}>
        <div style={styles.scanline} />
        <div style={styles.titleBar}>
          <span style={{ ...styles.dot, backgroundColor: '#ef4444' }} />
          <span style={{ ...styles.dot, backgroundColor: '#f59e0b' }} />
          <span style={{ ...styles.dot, backgroundColor: '#10b981' }} />
          <span style={styles.titleText}>control-plane — register</span>
        </div>
        <div style={styles.body}>
          <div style={styles.header}>
            <span style={styles.prompt}>&gt;</span> REGISTER
          </div>
          <div style={styles.subtitle}>// Create new operator credentials</div>

          {error && (
            <div style={styles.error}>
              <span>✗</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{ color: '#10b981' }}>$</span> Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="choose a username"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{ color: '#10b981' }}>$</span> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="operator@domain.com"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={{ color: '#10b981' }}>$</span> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
                minLength={8}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00d4ff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {}),
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#00bde0';
                  e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#00d4ff';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? '> REGISTERING...' : '> CREATE ACCOUNT'}
            </button>
          </form>

          <div style={styles.footer}>
            <span style={styles.footerText}>
              Already registered?{' '}
              <Link href="/login" style={styles.footerLink}>
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
