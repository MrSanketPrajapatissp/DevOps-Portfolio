'use client';
import { useState } from 'react';

const styles = {
  container: {
    width: '100%',
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #1e3a5f',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
  },
  thead: {
    backgroundColor: '#162240',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    color: '#94a3b8',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #1e3a5f',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    color: '#e2e8f0',
    borderBottom: '1px solid rgba(30, 58, 95, 0.5)',
    maxWidth: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  rowEven: {
    backgroundColor: '#0a1628',
  },
  rowOdd: {
    backgroundColor: '#111d33',
  },
  rowHover: {
    backgroundColor: '#1c2d4f',
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #00d4ff',
    color: '#00d4ff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: '#475569',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    backgroundColor: '#0a1628',
  },
};

export default function DataTable({ columns, data, onEdit, onDelete, actions }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={styles.container}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={styles.th}>{col.label}</th>
              ))}
              {(onEdit || onDelete || actions) && <th style={styles.th}>Actions</th>}
            </tr>
          </thead>
        </table>
        <div style={styles.emptyState}>No data available</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={styles.th}>{col.label}</th>
            ))}
            {(onEdit || onDelete || actions) && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              style={
                hoveredRow === index
                  ? styles.rowHover
                  : index % 2 === 0
                  ? styles.rowEven
                  : styles.rowOdd
              }
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              {(onEdit || onDelete || actions) && (
                <td style={{ ...styles.td, ...styles.actionsCell }}>
                  {onEdit && (
                    <button
                      style={styles.editBtn}
                      onClick={() => onEdit(item)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      style={styles.deleteBtn}
                      onClick={() => onDelete(item)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      Delete
                    </button>
                  )}
                  {actions && actions.map((action, i) => (
                    <button
                      key={i}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        border: `1px solid ${action.color || '#8b5cf6'}`,
                        color: action.color || '#8b5cf6',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => action.onClick(item)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
