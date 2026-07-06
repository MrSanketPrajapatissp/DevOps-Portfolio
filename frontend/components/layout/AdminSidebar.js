'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/admin-portal', icon: '◉' },
  { label: 'Hero / Identity', href: '/admin-portal/hero', icon: '⚡' },
  { label: 'Summary', href: '/admin-portal/summary', icon: '📋' },
  { label: 'Skills', href: '/admin-portal/skills', icon: '🔧' },
  { label: 'Projects', href: '/admin-portal/projects', icon: '📦' },
  { label: 'Certifications', href: '/admin-portal/certifications', icon: '🏆' },
  { label: 'Experience', href: '/admin-portal/experience', icon: '💼' },
  { label: 'Showcases', href: '/admin-portal/showcases', icon: '🎯' },
  { label: 'Social Links', href: '/admin-portal/social', icon: '🔗' },
  { label: 'Resume', href: '/admin-portal/resume', icon: '📄' },
  { label: 'Messages', href: '/admin-portal/messages', icon: '✉' },
  { label: 'GitHub Sync', href: '/admin-portal/github-sync', icon: '⟳' },
];

const styles = {
  sidebar: {
    width: '280px',
    minHeight: '100vh',
    backgroundColor: '#0a1628',
    borderRight: '1px solid #1e3a5f',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
    overflowY: 'auto',
  },
  header: {
    padding: '24px 20px',
    borderBottom: '1px solid #1e3a5f',
  },
  headerTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 700,
    color: '#00d4ff',
    letterSpacing: '0.1em',
    marginBottom: '4px',
  },
  headerSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '10px',
    color: '#475569',
    letterSpacing: '0.05em',
  },
  nav: {
    flex: 1,
    padding: '12px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 20px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
  },
  navItemActive: {
    color: '#00d4ff',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
    borderLeftColor: '#00d4ff',
  },
  navItemHover: {
    color: '#e2e8f0',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  icon: {
    fontSize: '16px',
    width: '24px',
    textAlign: 'center',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #1e3a5f',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  publicLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#10b981',
    textDecoration: 'none',
    borderRadius: '6px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s ease',
    justifyContent: 'center',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#ef4444',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    justifyContent: 'center',
    width: '100%',
  },
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>ADMIN PANEL</div>
        <div style={styles.headerSub}>CONTROL PLANE v1.0</div>
      </div>
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin-portal'
              ? pathname === '/admin-portal'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  Object.assign(e.currentTarget.style, styles.navItemHover);
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={styles.footer}>
        <Link
          href="/"
          style={styles.publicLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ← View Public Site
        </Link>
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
          ⏻ Logout
        </button>
      </div>
    </aside>
  );
}
