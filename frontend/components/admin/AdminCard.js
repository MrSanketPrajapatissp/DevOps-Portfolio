'use client';
import { useState } from 'react';

const styles = {
  card: {
    backgroundColor: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'all 0.2s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHover: {
    backgroundColor: '#1c2d4f',
    borderColor: 'rgba(0, 212, 255, 0.3)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1,
    marginBottom: '4px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 500,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  glow: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.15,
    pointerEvents: 'none',
  },
};

const colorMap = {
  cyan: { bg: 'rgba(0, 212, 255, 0.1)', text: '#00d4ff', glow: '#00d4ff' },
  green: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', glow: '#10b981' },
  amber: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', glow: '#f59e0b' },
  red: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', glow: '#ef4444' },
  purple: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', glow: '#8b5cf6' },
};

export default function AdminCard({ title, value, icon, color = 'cyan' }) {
  const [hovered, setHovered] = useState(false);
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...styles.glow, backgroundColor: c.glow }} />
      <div style={{ ...styles.iconWrap, backgroundColor: c.bg }}>
        <span>{icon}</span>
      </div>
      <div style={styles.content}>
        <div style={{ ...styles.value, color: c.text }}>{value}</div>
        <div style={styles.title}>{title}</div>
      </div>
    </div>
  );
}
