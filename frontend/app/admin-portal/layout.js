'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUser, logout } from '@/lib/auth';
import AdminSidebar from '@/components/layout/AdminSidebar';

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#050a14',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: '56px',
    backgroundColor: '#0a1628',
    borderBottom: '1px solid #1e3a5f',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  topBarTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 600,
    color: '#00d4ff',
    letterSpacing: '0.08em',
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  logoutBtn: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    color: '#ef4444',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  content: {
    flex: 1,
    padding: '24px',
  },
  loadingScreen: {
    minHeight: '100vh',
    backgroundColor: '#050a14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#00d4ff',
  },
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const u = getUser();
    setUser(u);
    setChecking(false);
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (checking) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingText}>&gt; Verifying credentials...</div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <AdminSidebar />
      <div style={styles.main}>
        <header style={styles.topBar}>
          <div style={styles.topBarTitle}>
            CONTROL PLANE // ADMIN
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.username}>
              <span style={styles.statusDot} />
              {user?.username || 'operator'}
            </div>
            <button
              style={styles.logoutBtn}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              LOGOUT
            </button>
          </div>
        </header>
        <main style={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
