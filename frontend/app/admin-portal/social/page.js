'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import DeleteConfirm from '@/components/admin/DeleteConfirm';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    color: '#e2e8f0',
    margin: 0,
  },
  addButton: {
    background: 'linear-gradient(90deg, #00d4ff33, #00d4ff)',
    border: '1px solid #00d4ff',
    color: '#050a14',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 'bold',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#0a1628',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #1e3a5f',
    color: '#94a3b8',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#00d4ff',
    border: '1px solid #00d4ff',
    color: '#050a14',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 'bold',
  },
};

export default function AdminSocialLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Dialog state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });

  // Form states
  const [form, setForm] = useState({
    platform: 'github',
    url: '',
    icon_class: 'github',
    order: 0,
  });

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/social-links/');
      if (res.ok) {
        const data = await res.json();
        setLinks(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({
      platform: 'github',
      url: '',
      icon_class: 'github',
      order: links.length + 1,
    });
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (link) => {
    setForm({
      platform: link.platform,
      url: link.url,
      icon_class: link.icon_class || link.platform,
      order: link.order || 0,
    });
    setModal({ open: true, mode: 'edit', data: link });
  };

  const handlePlatformChange = (platform) => {
    setForm((prev) => ({
      ...prev,
      platform,
      icon_class: platform,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `/api/admin/social-links/${modal.data.id}/` : '/api/admin/social-links/';
    const method = isEdit ? 'put' : 'post';

    try {
      const res = await api[method](url, form);
      if (res.ok) {
        setModal({ open: false, mode: 'create', data: null });
        loadLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/api/admin/social-links/${deleteDialog.target.id}/`);
      if (res.ok) {
        setDeleteDialog({ open: false, target: null });
        loadLinks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'platform', label: 'Platform', render: (val) => val.toUpperCase() },
    { key: 'url', label: 'Destination URL' },
    { key: 'order', label: 'Order' },
  ];

  if (loading && links.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading telemetry channels...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ Social Links Config</h2>
        <button style={styles.addButton} onClick={openCreate}>+ ADD LINK</button>
      </div>

      <DataTable
        columns={columns}
        data={links}
        onEdit={openEdit}
        onDelete={(l) => setDeleteDialog({ open: true, target: l })}
      />

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {modal.mode === 'edit' ? 'Edit Social Link' : 'Create Social Link'}
            </h3>
            <form onSubmit={handleSubmit}>
              <FormField label="Platform">
                <select
                  style={styles.select}
                  value={form.platform}
                  onChange={(e) => handlePlatformChange(e.target.value)}
                  required
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="email">Email</option>
                  <option value="website">Personal Website / Blog</option>
                </select>
              </FormField>

              <FormField label="Destination URL">
                <input
                  style={styles.input}
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  required
                  placeholder={form.platform === 'email' ? 'mailto:username@example.com' : 'https://...'}
                />
              </FormField>

              <FormField label="Icon Style Class / Identifier">
                <input
                  style={styles.input}
                  value={form.icon_class}
                  onChange={(e) => setForm({ ...form, icon_class: e.target.value })}
                  placeholder="github, linkedin, twitter, mail"
                />
              </FormField>

              <FormField label="Order">
                <input
                  type="number"
                  style={styles.input}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </FormField>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setModal({ open: false, mode: 'create', data: null })}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, target: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.target?.platform}
      />
    </div>
  );
}
