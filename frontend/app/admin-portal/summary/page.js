'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import FormField from '@/components/admin/FormField';

const styles = {
  form: {
    maxWidth: '800px',
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#162240',
    border: '1px solid #1e3a5f',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontFamily: 'inherit',
    fontSize: '14px',
    minHeight: '200px',
    boxSizing: 'border-box',
    outline: 'none',
    lineHeight: 1.6,
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

export default function AdminSummary() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/api/admin/summary/');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content || '');
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
      const res = await api.put('/api/admin/summary/', { content });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Professional Summary updated successfully.' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Failed to update summary.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading summary config...</div>;
  }

  return (
    <div>
      <h2 style={styles.title}>◉ Professional Summary</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <FormField label="Executive Bio / Summary Statement">
          <textarea
            style={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Introduce yourself, your primary skills, focus areas, and years of experience..."
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
