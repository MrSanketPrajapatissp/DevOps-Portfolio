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
    maxWidth: '550px',
    maxHeight: '90vh',
    overflowY: 'auto',
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

export default function AdminCertifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Dialog state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });
  const [errorMsg, setErrorMsg] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    issuer: '',
    credential_id: '',
    credential_url: '',
    date_obtained: '',
    expiry_date: '',
    status: 'obtained',
    order: 0,
  });
  const [badgeImage, setBadgeImage] = useState(null);

  useEffect(() => {
    loadCerts();
  }, []);

  const loadCerts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/certifications/');
      if (res.ok) {
        const data = await res.json();
        setCerts(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({
      name: '',
      issuer: '',
      credential_id: '',
      credential_url: '',
      date_obtained: '',
      expiry_date: '',
      status: 'obtained',
      order: certs.length + 1,
    });
    setBadgeImage(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (cert) => {
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      credential_id: cert.credential_id || '',
      credential_url: cert.credential_url || '',
      date_obtained: cert.date_obtained || '',
      expiry_date: cert.expiry_date || '',
      status: cert.status || 'obtained',
      order: cert.order || 0,
    });
    setBadgeImage(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'edit', data: cert });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `/api/admin/certifications/${modal.data.id}/` : '/api/admin/certifications/';
    const method = isEdit ? 'patch' : 'post';
    setErrorMsg(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== undefined) {
          formData.append(key, form[key]);
        }
      });
      if (badgeImage) {
        formData.append('badge_image', badgeImage);
      }

      const res = await api[method](url, formData);
      if (res.ok) {
        setModal({ open: false, mode: 'create', data: null });
        loadCerts();
      } else {
        const errData = await res.json();
        const msg = Object.entries(errData)
          .map(([f, msgs]) => `${f}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setErrorMsg(msg);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('VCS / network connection failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/api/admin/certifications/${deleteDialog.target.id}/`);
      if (res.ok) {
        setDeleteDialog({ open: false, target: null });
        loadCerts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'status', label: 'Status', render: (val) => val.toUpperCase() },
    {
      key: 'date_obtained',
      label: 'Obtained',
      render: (val) => val || 'In Progress',
    },
  ];

  if (loading && certs.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading certification repository...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ Certifications Registry</h2>
        <button style={styles.addButton} onClick={openCreate}>+ ADD CERTIFICATION</button>
      </div>

      <DataTable
        columns={columns}
        data={certs}
        onEdit={openEdit}
        onDelete={(c) => setDeleteDialog({ open: true, target: c })}
      />

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {modal.mode === 'edit' ? 'Edit Certification' : 'Create Certification'}
            </h3>
            {errorMsg && (
              <div style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', backgroundColor: '#ef444411', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '20px' }}>
                [!] ERROR: {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <FormField label="Certification Name">
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Issuer">
                <input
                  style={styles.input}
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  required
                  placeholder="AWS, CNCF, HashiCorp"
                />
              </FormField>

              <FormField label="Credential ID">
                <input
                  style={styles.input}
                  value={form.credential_id}
                  onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
                />
              </FormField>

              <FormField label="Credential Verification URL">
                <input
                  type="url"
                  style={styles.input}
                  value={form.credential_url}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
                />
              </FormField>

              <FormField label="Status">
                <select
                  style={styles.select}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="obtained">Obtained / Passed</option>
                  <option value="in_progress">In Progress / Studying</option>
                  <option value="expired">Expired</option>
                </select>
              </FormField>

              {form.status !== 'in_progress' && (
                <>
                  <FormField label="Date Obtained">
                    <input
                      type="date"
                      style={styles.input}
                      value={form.date_obtained}
                      onChange={(e) => setForm({ ...form, date_obtained: e.target.value })}
                    />
                  </FormField>
                  <FormField label="Expiry Date (optional)">
                    <input
                      type="date"
                      style={styles.input}
                      value={form.expiry_date}
                      onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    />
                  </FormField>
                </>
              )}

              <FormField label="Order">
                <input
                  type="number"
                  style={styles.input}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </FormField>

              <FormField label="Badge Icon / Image">
                <input
                  type="file"
                  accept="image/*"
                  style={styles.input}
                  onChange={(e) => setBadgeImage(e.target.files[0])}
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
        itemName={deleteDialog.target?.name}
      />
    </div>
  );
}
