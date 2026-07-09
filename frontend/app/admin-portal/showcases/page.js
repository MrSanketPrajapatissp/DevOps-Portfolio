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
    maxWidth: '650px',
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
  textarea: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
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

export default function AdminShowcases() {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Dialog state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });
  const [errorMsg, setErrorMsg] = useState(null);

  // Form states
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    technologies: '',
    challenge: '',
    solution: '',
    impact: '',
    order: 0,
  });
  const [diagram, setDiagram] = useState(null);

  useEffect(() => {
    loadShowcases();
  }, []);

  const loadShowcases = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/showcases/');
      if (res.ok) {
        const data = await res.json();
        setShowcases(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (val) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (val) => {
    setForm((prev) => ({
      ...prev,
      title: val,
      slug: generateSlug(val),
    }));
  };

  const openCreate = () => {
    setForm({
      title: '',
      slug: '',
      description: '',
      technologies: '',
      challenge: '',
      solution: '',
      impact: '',
      order: showcases.length + 1,
    });
    setDiagram(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (sc) => {
    setForm({
      title: sc.title,
      slug: sc.slug,
      description: sc.description,
      technologies: Array.isArray(sc.technologies) ? sc.technologies.join(', ') : '',
      challenge: sc.challenge || '',
      solution: sc.solution || '',
      impact: sc.impact || '',
      order: sc.order || 0,
    });
    setDiagram(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'edit', data: sc });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `/api/admin/showcases/${modal.data.id}/` : '/api/admin/showcases/';
    const method = isEdit ? 'patch' : 'post';
    setErrorMsg(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'technologies') {
          const arr = form.technologies
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          formData.append(key, JSON.stringify(arr));
        } else {
          formData.append(key, form[key]);
        }
      });
      if (diagram) {
        formData.append('diagram_image', diagram);
      }

      const res = await api[method](url, formData);
      if (res.ok) {
        setModal({ open: false, mode: 'create', data: null });
        loadShowcases();
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
      const res = await api.delete(`/api/admin/showcases/${deleteDialog.target.id}/`);
      if (res.ok) {
        setDeleteDialog({ open: false, target: null });
        loadShowcases();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'title', label: 'Brief Title' },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (val) => (Array.isArray(val) ? val.join(', ') : val),
    },
    { key: 'order', label: 'Order' },
  ];

  if (loading && showcases.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading architecture specs...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ System Architecture Briefs</h2>
        <button style={styles.addButton} onClick={openCreate}>+ ADD BRIEF</button>
      </div>

      <DataTable
        columns={columns}
        data={showcases}
        onEdit={openEdit}
        onDelete={(sc) => setDeleteDialog({ open: true, target: sc })}
      />

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {modal.mode === 'edit' ? 'Edit Showcase' : 'Create Showcase'}
            </h3>
            {errorMsg && (
              <div style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', backgroundColor: '#ef444411', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '20px' }}>
                [!] ERROR: {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <FormField label="Showcase Title">
                <input
                  style={styles.input}
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="URL Slug">
                <input
                  style={styles.input}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                  required
                />
              </FormField>

              <FormField label="Short Summary Description">
                <textarea
                  style={styles.textarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Technologies Used (comma separated)">
                <input
                  style={styles.input}
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="Terraform, AWS VPC, Route53, RDS"
                />
              </FormField>

              <FormField label="The Challenge">
                <textarea
                  style={styles.textarea}
                  value={form.challenge}
                  onChange={(e) => setForm({ ...form, challenge: e.target.value })}
                  placeholder="What operational problem/incident or scale issue was faced?"
                />
              </FormField>

              <FormField label="The Solution / Architecture Details">
                <textarea
                  style={styles.textarea}
                  value={form.solution}
                  onChange={(e) => setForm({ ...form, solution: e.target.value })}
                  placeholder="How was it designed and deployed?"
                />
              </FormField>

              <FormField label="System Impact / Results">
                <textarea
                  style={styles.textarea}
                  value={form.impact}
                  onChange={(e) => setForm({ ...form, impact: e.target.value })}
                  placeholder="What were the uptime/cost/efficiency metrics achieved?"
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

              <FormField label="Architecture Diagram / Visual Image">
                <input
                  type="file"
                  accept="image/*"
                  style={styles.input}
                  onChange={(e) => setDiagram(e.target.files[0])}
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
        itemName={deleteDialog.target?.title}
      />
    </div>
  );
}
