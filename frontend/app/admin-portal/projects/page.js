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
  syncMsg: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    padding: '8px 12px',
    borderRadius: '4px',
    marginTop: '16px',
  },
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);
  const [syncMessage, setSyncMessage] = useState(null);

  // Modal & Dialog state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });
  const [errorMsg, setErrorMsg] = useState(null);

  // Form states
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    status: 'deployed',
    order: 0,
    github_repo_name: '',
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/projects/');
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : (data.results || []));
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
      tech_stack: '',
      github_url: '',
      live_url: '',
      status: 'deployed',
      order: projects.length + 1,
      github_repo_name: '',
    });
    setImage(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      status: project.status || 'deployed',
      order: project.order || 0,
      github_repo_name: project.github_repo_name || '',
    });
    setImage(null);
    setErrorMsg(null);
    setModal({ open: true, mode: 'edit', data: project });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `/api/admin/projects/${modal.data.id}/` : '/api/admin/projects/';
    const method = isEdit ? 'patch' : 'post';
    setErrorMsg(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === 'tech_stack') {
          const arr = form.tech_stack
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          formData.append(key, JSON.stringify(arr));
        } else {
          formData.append(key, form[key]);
        }
      });
      if (image) {
        formData.append('image', image);
      }

      const res = await api[method](url, formData);
      if (res.ok) {
        setModal({ open: false, mode: 'create', data: null });
        loadProjects();
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
      const res = await api.delete(`/api/admin/projects/${deleteDialog.target.id}/`);
      if (res.ok) {
        setDeleteDialog({ open: false, target: null });
        loadProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerGitHubSync = async (project) => {
    setSyncingId(project.id);
    setSyncMessage(null);
    try {
      const res = await api.post(`/api/admin/projects/${project.id}/resync/`);
      if (res.ok) {
        setSyncMessage({ type: 'success', text: `Successfully synced README for: ${project.title}` });
        loadProjects();
      } else {
        const err = await res.json();
        setSyncMessage({ type: 'error', text: err.detail || 'Re-sync from GitHub failed.' });
      }
    } catch (err) {
      setSyncMessage({ type: 'error', text: 'Connection failed.' });
    } finally {
      setSyncingId(null);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const columns = [
    { key: 'title', label: 'Project Title' },
    { key: 'status', label: 'Status', render: (val) => val.toUpperCase() },
    {
      key: 'is_github_synced',
      label: 'GitHub Linked',
      render: (val, item) => (val ? `Yes (${item.github_repo_name})` : 'No'),
    },
    { key: 'order', label: 'Order' },
  ];

  const customActions = [
    {
      label: 'Sync',
      color: '#10b981',
      onClick: (project) => triggerGitHubSync(project),
    },
  ];

  if (loading && projects.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading project registry...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ Projects & Deployments</h2>
        <button style={styles.addButton} onClick={openCreate}>+ ADD PROJECT</button>
      </div>

      {syncMessage && (
        <div style={{
          ...styles.syncMsg,
          backgroundColor: syncMessage.type === 'success' ? '#10b98122' : '#ef444422',
          border: `1px solid ${syncMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: syncMessage.type === 'success' ? '#10b981' : '#ef4444',
        }}>
          {syncMessage.text}
        </div>
      )}

      {syncingId && (
        <div style={{ ...styles.syncMsg, color: '#00d4ff', backgroundColor: '#00d4ff11', border: '1px solid #00d4ff' }}>
          &gt; Running Git/VCS parse routine for Project ID {syncingId}...
        </div>
      )}

      <DataTable
        columns={columns}
        data={projects}
        onEdit={openEdit}
        onDelete={(p) => setDeleteDialog({ open: true, target: p })}
        actions={customActions}
      />

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {modal.mode === 'edit' ? 'Edit Project' : 'Create Project'}
            </h3>
            {errorMsg && (
              <div style={{ color: '#ef4444', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', padding: '10px', backgroundColor: '#ef444411', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '20px' }}>
                [!] ERROR: {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <FormField label="Project Title">
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

              <FormField label="Summary Description">
                <textarea
                  style={styles.textarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Technologies / Tech Stack (comma separated)">
                <input
                  style={styles.input}
                  value={form.tech_stack}
                  onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                  placeholder="Terraform, AWS, Ansible, Python"
                />
              </FormField>

              <FormField label="GitHub Repository Link">
                <input
                  type="url"
                  style={styles.input}
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                />
              </FormField>

              <FormField label="Live App / Demo Link">
                <input
                  type="url"
                  style={styles.input}
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                />
              </FormField>

              <FormField label="GitHub Repository Name (for re-sync e.g. username/repo)">
                <input
                  style={styles.input}
                  value={form.github_repo_name}
                  onChange={(e) => setForm({ ...form, github_repo_name: e.target.value })}
                  placeholder="alexchen-devops/cloud-infra-automation"
                />
              </FormField>

              <FormField label="Status">
                <select
                  style={styles.select}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="deployed">Deployed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>

              <FormField label="Order">
                <input
                  type="number"
                  style={styles.input}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                />
              </FormField>

              <FormField label="Project Banner Image">
                <input
                  type="file"
                  accept="image/*"
                  style={styles.input}
                  onChange={(e) => setImage(e.target.files[0])}
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
