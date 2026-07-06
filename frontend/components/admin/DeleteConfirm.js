'use client';

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#0a1628',
    border: '1px solid #1e3a5f',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '440px',
    width: '90%',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    fontSize: '24px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '18px',
    fontWeight: 700,
    color: '#e2e8f0',
    marginBottom: '8px',
  },
  message: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    color: '#94a3b8',
    lineHeight: 1.6,
    marginBottom: '24px',
  },
  itemName: {
    color: '#ef4444',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #1e3a5f',
    color: '#94a3b8',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    border: '1px solid #ef4444',
    color: '#ffffff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
};

export default function DeleteConfirm({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconWrap}>⚠</div>
        <div style={styles.title}>Confirm Deletion</div>
        <div style={styles.message}>
          Are you sure you want to delete{' '}
          <span style={styles.itemName}>{itemName || 'this item'}</span>?
          This action cannot be undone.
        </div>
        <div style={styles.actions}>
          <button
            style={styles.cancelBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#94a3b8';
              e.target.style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#1e3a5f';
              e.target.style.color = '#94a3b8';
            }}
          >
            Cancel
          </button>
          <button
            style={styles.deleteBtn}
            onClick={onConfirm}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
