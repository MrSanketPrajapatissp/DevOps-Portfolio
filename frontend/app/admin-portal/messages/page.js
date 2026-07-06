'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import DeleteConfirm from '@/components/admin/DeleteConfirm';

const styles = {
  header: {
    marginBottom: '24px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    color: '#e2e8f0',
    margin: 0,
  },
  detailCard: {
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
    marginTop: '24px',
  },
  detailHeader: {
    borderBottom: '1px solid #1e3a5f',
    paddingBottom: '16px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  meta: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.6,
  },
  body: {
    fontSize: '14px',
    color: '#e2e8f0',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  readBtn: {
    background: '#10b981',
    border: '1px solid #10b981',
    color: '#ffffff',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
  },
};

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/messages/');
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMsg(msg);
  };

  const handleMarkAsRead = async (msg) => {
    try {
      const res = await api.put(`/api/admin/messages/${msg.id}/read/`);
      if (res.ok) {
        const updated = await res.json();
        if (selectedMsg && selectedMsg.id === msg.id) {
          setSelectedMsg(updated);
        }
        loadMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/api/admin/messages/${deleteDialog.target.id}/`);
      if (res.ok) {
        if (selectedMsg && selectedMsg.id === deleteDialog.target.id) {
          setSelectedMsg(null);
        }
        setDeleteDialog({ open: false, target: null });
        loadMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'subject', label: 'Subject' },
    { key: 'name', label: 'From' },
    { key: 'created_at', label: 'Received', render: (val) => new Date(val).toLocaleString() },
    {
      key: 'is_read',
      label: 'Status',
      render: (val) => (val ? 'Read' : '🆕 Unread'),
    },
  ];

  const actions = [
    {
      label: 'View',
      color: '#00d4ff',
      onClick: (msg) => handleSelectMessage(msg),
    },
  ];

  if (loading && messages.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading log queues...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ Contact Messages</h2>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        onDelete={(msg) => setDeleteDialog({ open: true, target: msg })}
        actions={actions}
      />

      {selectedMsg && (
        <div style={styles.detailCard}>
          <div style={styles.detailHeader}>
            <div style={styles.meta}>
              <div><strong>Subject:</strong> {selectedMsg.subject}</div>
              <div><strong>From:</strong> {selectedMsg.name} ({selectedMsg.email})</div>
              <div><strong>Date:</strong> {new Date(selectedMsg.created_at).toLocaleString()}</div>
              <div><strong>Status:</strong> {selectedMsg.is_read ? 'Read' : 'Unread'}</div>
            </div>
            <div style={styles.actions}>
              {!selectedMsg.is_read && (
                <button style={styles.readBtn} onClick={() => handleMarkAsRead(selectedMsg)}>
                  MARK AS READ
                </button>
              )}
              <button style={styles.deleteBtn} onClick={() => setDeleteDialog({ open: true, target: selectedMsg })}>
                DELETE MESSAGE
              </button>
            </div>
          </div>
          <div style={styles.body}>{selectedMsg.message}</div>
        </div>
      )}

      <DeleteConfirm
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, target: null })}
        onConfirm={handleDeleteConfirm}
        itemName={`message: "${deleteDialog.target?.subject}"`}
      />
    </div>
  );
}
