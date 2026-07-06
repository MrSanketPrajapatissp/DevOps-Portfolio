'use client';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '16px',
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  required: {
    color: '#ef4444',
    fontSize: '14px',
  },
  error: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: '#ef4444',
    marginTop: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

export default function FormField({ label, error, children, required }) {
  return (
    <div style={styles.wrapper}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <span style={styles.error}>
          <span>✗</span> {error}
        </span>
      )}
    </div>
  );
}
