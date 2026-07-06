'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import AdminCard from '@/components/admin/AdminCard';
import Link from 'next/link';

const styles = {
  page: {
    maxWidth: '1200px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '24px',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  titleAccent: {
    color: '#00d4ff',
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#475569',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#1e3a5f',
  },
  quickLinks: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  quickLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    backgroundColor: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#e2e8f0',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  quickLinkIcon: {
    fontSize: '18px',
  },
  loadingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
  loadingText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#00d4ff',
  },
};

const quickLinks = [
  { label: 'Manage Projects', href: '/admin-portal/projects', icon: '📦' },
  { label: 'Manage Skills', href: '/admin-portal/skills', icon: '🔧' },
  { label: 'Manage Experience', href: '/admin-portal/experience', icon: '💼' },
  { label: 'Edit Hero', href: '/admin-portal/hero', icon: '⚡' },
  { label: 'View Messages', href: '/admin-portal/messages', icon: '✉' },
  { label: 'GitHub Sync', href: '/admin-portal/github-sync', icon: '⟳' },
  { label: 'Certifications', href: '/admin-portal/certifications', icon: '🏆' },
  { label: 'Showcases', href: '/admin-portal/showcases', icon: '🎯' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [projectsRes, skillsRes, certsRes, expRes, messagesRes] = await Promise.all([
        api.get('/api/admin/projects/'),
        api.get('/api/admin/skills/'),
        api.get('/api/admin/certifications/'),
        api.get('/api/admin/experience/'),
        api.get('/api/admin/messages/'),
      ]);

      const projects = projectsRes.ok ? await projectsRes.json() : [];
      const skills = skillsRes.ok ? await skillsRes.json() : [];
      const certs = certsRes.ok ? await certsRes.json() : [];
      const exp = expRes.ok ? await expRes.json() : [];
      const messages = messagesRes.ok ? await messagesRes.json() : [];

      const toArr = (d) => Array.isArray(d) ? d : (d.results || []);

      setStats({
        projects: toArr(projects).length,
        skills: toArr(skills).length,
        certifications: toArr(certs).length,
        experience: toArr(exp).length,
        unreadMessages: toArr(messages).filter(m => !m.is_read).length,
      });
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      setStats({ projects: 0, skills: 0, certifications: 0, experience: 0, unreadMessages: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingText}>&gt; Loading dashboard metrics...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.titleAccent}>◉</span> System Overview
        </div>
        <div style={styles.subtitle}>// Real-time metrics from the control plane</div>
      </div>

      <div style={styles.sectionTitle}>
        Metrics
        <span style={styles.sectionLine} />
      </div>

      <div style={styles.grid}>
        <AdminCard title="Projects" value={stats?.projects ?? 0} icon="📦" color="cyan" />
        <AdminCard title="Skills" value={stats?.skills ?? 0} icon="🔧" color="green" />
        <AdminCard title="Certifications" value={stats?.certifications ?? 0} icon="🏆" color="amber" />
        <AdminCard title="Experience" value={stats?.experience ?? 0} icon="💼" color="purple" />
        <AdminCard title="Unread Messages" value={stats?.unreadMessages ?? 0} icon="✉" color="red" />
      </div>

      <div style={styles.sectionTitle}>
        Quick Access
        <span style={styles.sectionLine} />
      </div>

      <div style={styles.quickLinks}>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={styles.quickLink}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.backgroundColor = '#1c2d4f';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e3a5f';
              e.currentTarget.style.backgroundColor = '#111d33';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={styles.quickLinkIcon}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
