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
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sliderValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#00d4ff',
    width: '40px',
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
  section: {
    marginBottom: '48px',
  },
  subtitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '16px',
    borderBottom: '1px solid #1e3a5f',
    paddingBottom: '8px',
  },
};

export default function AdminSkills() {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [categoryModal, setCategoryModal] = useState({ open: false, mode: 'create', data: null });
  const [skillModal, setSkillModal] = useState({ open: false, mode: 'create', data: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: 'category', target: null });

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: '', order: 0 });
  const [skillForm, setSkillForm] = useState({ name: '', category: '', proficiency: 80, order: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, skillRes] = await Promise.all([
        api.get('/api/admin/skill-categories/'),
        api.get('/api/admin/skills/'),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (skillRes.ok) setSkills(await skillRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Category CRUD
  const openCategoryCreate = () => {
    setCategoryForm({ name: '', icon: '', order: categories.length + 1 });
    setCategoryModal({ open: true, mode: 'create', data: null });
  };

  const openCategoryEdit = (cat) => {
    setCategoryForm({ name: cat.name, icon: cat.icon || '', order: cat.order });
    setCategoryModal({ open: true, mode: 'edit', data: cat });
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    const isEdit = categoryModal.mode === 'edit';
    const url = isEdit ? `/api/admin/skill-categories/${categoryModal.data.id}/` : '/api/admin/skill-categories/';
    const method = isEdit ? 'put' : 'post';

    try {
      const res = await api[method](url, categoryForm);
      if (res.ok) {
        setCategoryModal({ open: false, mode: 'create', data: null });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Skill CRUD
  const openSkillCreate = () => {
    setSkillForm({
      name: '',
      category: categories[0]?.id || '',
      proficiency: 80,
      order: skills.length + 1,
    });
    setSkillModal({ open: true, mode: 'create', data: null });
  };

  const openSkillEdit = (skill) => {
    setSkillForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      order: skill.order,
    });
    setSkillModal({ open: true, mode: 'edit', data: skill });
  };

  const handleSkillSave = async (e) => {
    e.preventDefault();
    const isEdit = skillModal.mode === 'edit';
    const url = isEdit ? `/api/admin/skills/${skillModal.data.id}/` : '/api/admin/skills/';
    const method = isEdit ? 'put' : 'post';

    try {
      const res = await api[method](url, skillForm);
      if (res.ok) {
        setSkillModal({ open: false, mode: 'create', data: null });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete confirm trigger
  const confirmDelete = (type, target) => {
    setDeleteDialog({ open: true, type, target });
  };

  const handleDeleteConfirm = async () => {
    const { type, target } = deleteDialog;
    const url = type === 'category' ? `/api/admin/skill-categories/${target.id}/` : `/api/admin/skills/${target.id}/`;
    try {
      const res = await api.delete(url);
      if (res.ok) {
        setDeleteDialog({ open: false, type: 'category', target: null });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColumns = [
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon Tag' },
    { key: 'order', label: 'Order' },
  ];

  const skillColumns = [
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (catId) => categories.find((c) => c.id === catId)?.name || 'Unknown',
    },
    {
      key: 'proficiency',
      label: 'Proficiency',
      render: (val) => `${val}%`,
    },
    { key: 'order', label: 'Order' },
  ];

  if (loading && categories.length === 0) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading matrix controllers...</div>;
  }

  return (
    <div>
      {/* Category Section */}
      <div style={styles.section}>
        <div style={styles.header}>
          <h2 style={styles.title}>◉ Skill Categories</h2>
          <button style={styles.addButton} onClick={openCategoryCreate}>+ ADD CATEGORY</button>
        </div>
        <DataTable
          columns={categoryColumns}
          data={categories}
          onEdit={openCategoryEdit}
          onDelete={(cat) => confirmDelete('category', cat)}
        />
      </div>

      {/* Skill Section */}
      <div style={styles.section}>
        <div style={styles.header}>
          <h2 style={styles.title}>◉ Skills Registry</h2>
          <button style={styles.addButton} onClick={openSkillCreate}>+ ADD SKILL</button>
        </div>
        <DataTable
          columns={skillColumns}
          data={skills}
          onEdit={openSkillEdit}
          onDelete={(skill) => confirmDelete('skill', skill)}
        />
      </div>

      {/* Category Create/Edit Modal */}
      {categoryModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {categoryModal.mode === 'edit' ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleCategorySave}>
              <FormField label="Category Name">
                <input
                  style={styles.input}
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Icon (e.target.value tag e.g. cloud, terminal, code)">
                <input
                  style={styles.input}
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                />
              </FormField>
              <FormField label="Order">
                <input
                  type="number"
                  style={styles.input}
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                />
              </FormField>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setCategoryModal({ open: false, mode: 'create', data: null })}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Create/Edit Modal */}
      {skillModal.open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ ...styles.title, marginBottom: '20px' }}>
              {skillModal.mode === 'edit' ? 'Edit Skill' : 'Create Skill'}
            </h3>
            <form onSubmit={handleSkillSave}>
              <FormField label="Skill Name">
                <input
                  style={styles.input}
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                />
              </FormField>
              <FormField label="Category">
                <select
                  style={styles.select}
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Proficiency Level">
                <div style={styles.sliderContainer}>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    style={{ flex: 1 }}
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) || 1 })}
                  />
                  <span style={styles.sliderValue}>{skillForm.proficiency}%</span>
                </div>
              </FormField>
              <FormField label="Order">
                <input
                  type="number"
                  style={styles.input}
                  value={skillForm.order}
                  onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) || 0 })}
                />
              </FormField>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setSkillModal({ open: false, mode: 'create', data: null })}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: 'category', target: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteDialog.target?.name}
      />
    </div>
  );
}
