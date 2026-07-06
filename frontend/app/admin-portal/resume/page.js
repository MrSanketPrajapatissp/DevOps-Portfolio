'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import FormField from '@/components/admin/FormField';

const styles = {
  container: {
    maxWidth: '600px',
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
  },
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    color: '#e2e8f0',
    marginBottom: '24px',
  },
  activePanel: {
    border: '1px solid #10b981',
    backgroundColor: '#10b98111',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '24px',
  },
  activeTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '14px',
    color: '#10b981',
    margin: '0 0 8px 0',
  },
  fileMeta: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.6,
    wordBreak: 'break-all',
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid #ef4444',
    color: '#ef4444',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    marginTop: '12px',
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
  uploadBtn: {
    background: 'linear-gradient(90deg, #00d4ff33, #00d4ff)',
    border: '1px solid #00d4ff',
    color: '#050a14',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 'bold',
    fontSize: '13px',
  },
  statusMsg: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    marginTop: '16px',
  },
};

export default function AdminResume() {
  const [activeResume, setActiveResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const res = await api.get('/api/resume/');
      if (res.ok) {
        const data = await res.json();
        setActiveResume(data && data.file ? data : null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/admin/resume/', formData);
      if (res.ok) {
        setMessage({ type: 'success', text: 'Resume uploaded and activated.' });
        setFile(null);
        // Clear input element
        document.getElementById('resume-file-input').value = '';
        loadResume();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Upload failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to deactivate and remove this resume?')) return;
    try {
      const res = await api.delete('/api/admin/resume/');
      if (res.ok) {
        setActiveResume(null);
        setMessage({ type: 'success', text: 'Resume deleted.' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ fontFamily: "'JetBrains Mono', monospace", color: '#00d4ff' }}>&gt; Loading file storage...</div>;
  }

  return (
    <div>
      <h2 style={styles.title}>◉ Resume / CV Manager</h2>
      <div style={styles.container}>
        {activeResume ? (
          <div style={styles.activePanel}>
            <h3 style={styles.activeTitle}>◉ ACTIVE RESUME DETECTED</h3>
            <div style={styles.fileMeta}>
              <div><strong>File Name:</strong> {activeResume.file.split('/').pop()}</div>
              <div><strong>Uploaded At:</strong> {new Date(activeResume.uploaded_at).toLocaleString()}</div>
            </div>
            <button style={styles.deleteBtn} onClick={handleDelete}>DEACTIVATE & DELETE</button>
          </div>
        ) : (
          <div style={{ ...styles.activePanel, borderColor: '#ef4444', backgroundColor: '#ef444411', color: '#ef4444' }}>
            <h3 style={{ ...styles.activeTitle, color: '#ef4444' }}>⚠ NO ACTIVE RESUME UPLOADED</h3>
            <div style={{ fontSize: '13px' }}>The resume module is currently offline. Visitors will see a placeholder empty state on the public page.</div>
          </div>
        )}

        <form onSubmit={handleUpload}>
          <FormField label="Upload New Resume (PDF only)">
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              style={styles.input}
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </FormField>
          <button type="submit" style={styles.uploadBtn} disabled={uploading || !file}>
            {uploading ? 'UPLOADING...' : 'UPLOAD NEW RESUME'}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.statusMsg,
            color: message.type === 'success' ? '#10b981' : '#ef4444'
          }}>
            {message.type === 'success' ? '✓ ' : '✗ '} {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
