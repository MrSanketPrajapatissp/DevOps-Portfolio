'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import FormField from '@/components/admin/FormField';

const styles = {
  form: {
    maxWidth: '600px',
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    background: 'linear-gradient(90deg, #00d4ff33, #00d4ff)',
    border: '1px solid #00d4ff',
    color: '#050a14',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 'bold',
    fontSize: '13px',
    outline: 'none',
  },
  statusMsg: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    marginTop: '16px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    color: '#e2e8f0',
    marginBottom: '24px',
  },
};

export default function AdminHero() {
  const [form, setForm] = useState({
    name: '',
    title: '',
    tagline: '',
    availability_status: 'available',
    location: '',
    years_experience: 0,
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/api/admin/hero/');
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || '',
            title: data.title || '',
            tagline: data.tagline || '',
            availability_status: data.availability_status || 'available',
            location: data.location || '',
            years_experience: data.years_experience || 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const res = await api.put('/api/admin/hero/', formData);
      if (res.ok) {
        setMessage({ type: 'success', text: 'Hero Identity updated successfully.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Failed to update hero identity.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading hero config...</div>;
  }

  return (
    <div>
      <h2 style={styles.title}>◉ Hero Identity Config</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <FormField label="Candidate Name">
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Professional Title">
          <input
            style={styles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Tagline / Short Pitch">
          <textarea
            style={styles.textarea}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            required
          />
        </FormField>

        <FormField label="Availability Status">
          <select
            style={styles.select}
            value={form.availability_status}
            onChange={(e) => setForm({ ...form, availability_status: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="open">Open to Offers</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </FormField>

        <FormField label="Location">
          <input
            style={styles.input}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </FormField>

        <FormField label="Years of Experience">
          <input
            type="number"
            style={styles.input}
            value={form.years_experience}
            onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })}
          />
        </FormField>

        <FormField label="Avatar Image">
          <input
            type="file"
            accept="image/*"
            style={styles.input}
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </FormField>

        <button type="submit" style={styles.button} disabled={saving}>
          {saving ? 'UPDATING...' : 'UPDATE SYSTEM'}
        </button>

        {message && (
          <div style={{
            ...styles.statusMsg,
            color: message.type === 'success' ? '#10b981' : '#ef4444'
          }}>
            {message.type === 'success' ? '✓ ' : '✗ '} {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
