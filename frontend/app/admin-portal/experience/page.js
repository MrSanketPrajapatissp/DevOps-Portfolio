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
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
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
  achievementRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
  },
  addAchBtn: {
    backgroundColor: 'transparent',
    border: '1px dashed #00d4ff',
    color: '#00d4ff',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  removeAchBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
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

export default function AdminExperience() {
  const [experienceList, setExperienceList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Dialog state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, target: null });

  // Form states
  const [form, setForm] = useState({
    role: '',
    company: '',
    company_url: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    technologies: '',
    order: 0,
  });
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/experience/');
      if (res.ok) {
        const data = await res.json();
        setExperienceList(Array.isArray(data) ? data : (data.results || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({
      role: '',
      company: '',
      company_url: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      technologies: '',
      order: experienceList.length + 1,
    });
    setAchievements(['']);
    setModal({ open: true, mode: 'create', data: null });
  };

  const openEdit = (exp) => {
    setForm({
      role: exp.role,
      company: exp.company,
      company_url: exp.company_url || '',
      start_date: exp.start_date || '',
      end_date: exp.end_date || '',
      is_current: exp.is_current || false,
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
      order: exp.order || 0,
    });
    setAchievements(Array.isArray(exp.achievements) && exp.achievements.length > 0 ? [...exp.achievements] : ['']);
    setModal({ open: true, mode: 'edit', data: exp });
  };

  const handleAchievementChange = (index, value) => {
    const next = [...achievements];
    next[index] = value;
    setAchievements(next);
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const removeAchievement = (index) => {
    const next = achievements.filter((_, i) => i !== index);
    setAchievements(next.length === 0 ? [''] : next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = modal.mode === 'edit';
    const url = isEdit ? `/api/admin/experience/${modal.data.id}/` : '/api/admin/experience/';
    const method = isEdit ? 'put' : 'post';

    const techArr = form.technologies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      achievements: achievements.map((a) => a.trim()).filter(Boolean),
      technologies: techArr,
      end_date: form.is_current ? null : form.end_date || null,
    };

    try {
      const res = await api[method](url, payload);
      if (res.ok) {
        setModal({ open: false, mode: 'create', data: null });
        loadExperience();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/api/admin/experience/${deleteDialog.target.id}/`);
      if (res.ok) {
        setDeleteDialog({ open: false, target: null });
        loadExperience();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'role', label: 'Role / Job Title' },
    { key: 'company', label: 'Company' },
    {
      key: 'start_date',
      label: 'Timeline',
      render: (_, item) => `${item.start_date} to ${item.is_current ? 'Present' : item.end_date}`,
    },
    { key: 'order', label: 'Order' },
  ];

  if (loading && experienceList.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading experience timeline...</div>;
  }

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>◉ Professional Experience</h2>
        <button style={styles.addButton} onClick={openCreate}>+ ADD EXPERIENCE</button>
      </div>

      <DataTable
        columns={columns}
        data={experienceList}
        onEdit={openEdit}
        onDelete={(exp) => setDeleteDialog({ open: true, target: exp })}
      />

      {modal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {modal.mode === 'edit' ? 'Edit Experience' : 'Create Experience'}
            </h3>
            <form onSubmit={handleSubmit}>
              <FormField label="Role / Job Title">
                <input
                  style={styles.input}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Company Name">
                <input
                  style={styles.input}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Company Website URL">
                <input
                  type="url"
                  style={styles.input}
                  value={form.company_url}
                  onChange={(e) => setForm({ ...form, company_url: e.target.value })}
                />
              </FormField>

              <FormField label="Start Date">
                <input
                  type="date"
                  style={styles.input}
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  required
                />
              </FormField>

              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="is_current"
                  checked={form.is_current}
                  onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
                />
                <label htmlFor="is_current" style={{ fontSize: '13px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>
                  Currently working here
                </label>
              </div>

              {!form.is_current && (
                <FormField label="End Date">
                  <input
                    type="date"
                    style={styles.input}
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    required={!form.is_current}
                  />
                </FormField>
              )}

              <FormField label="General Description">
                <textarea
                  style={styles.textarea}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </FormField>

              <FormField label="Key Achievements / Impact (One per row)">
                <div>
                  {achievements.map((ach, idx) => (
                    <div key={idx} style={styles.achievementRow}>
                      <input
                        style={styles.input}
                        value={ach}
                        onChange={(e) => handleAchievementChange(idx, e.target.value)}
                        required
                        placeholder="e.g. Reduced deploy time by 40% using containerized tasks..."
                      />
                      <button type="button" style={styles.removeAchBtn} onClick={() => removeAchievement(idx)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" style={styles.addAchBtn} onClick={addAchievement}>+ ADD ACHIEVEMENT</button>
                </div>
              </FormField>

              <FormField label="Technologies Used (comma separated)">
                <input
                  style={styles.input}
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="AWS, Docker, Jenkins, Kubernetes"
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
        itemName={`${deleteDialog.target?.role} at ${deleteDialog.target?.company}`}
      />
    </div>
  );
}
