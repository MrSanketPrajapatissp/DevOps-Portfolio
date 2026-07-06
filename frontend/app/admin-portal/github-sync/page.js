'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import FormField from '@/components/admin/FormField';

const styles = {
  container: {
    maxWidth: '800px',
  },
  searchBox: {
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
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
  searchBtn: {
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
  title: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '20px',
    color: '#e2e8f0',
    marginBottom: '24px',
  },
  repoCard: {
    background: '#111d33',
    border: '1px solid #1e3a5f',
    borderRadius: '6px',
    padding: '16px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  repoMeta: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: 1.5,
    flex: 1,
  },
  repoName: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '16px',
    color: '#e2e8f0',
    fontWeight: 600,
    marginBottom: '4px',
  },
  syncBtn: {
    background: '#10b981',
    border: '1px solid #10b981',
    color: '#ffffff',
    padding: '6px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    fontWeight: 600,
    marginLeft: '16px',
  },
  statusText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '16px',
  },
};

export default function GitHubSync() {
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingRepo, setSyncingRepo] = useState(null);
  const [message, setMessage] = useState(null);
  const [readmePaths, setReadmePaths] = useState({});

  const handleFetchRepos = async (e) => {
    e.preventDefault();
    if (!username) return;

    setLoading(true);
    setMessage(null);
    setRepos([]);

    try {
      const res = await api.get(`/api/github/repos/?username=${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Failed to fetch repositories.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncRepo = async (repoFullName) => {
    setSyncingRepo(repoFullName);
    setMessage(null);
    const path = readmePaths[repoFullName] || 'README.md';

    try {
      const res = await api.post('/api/github/sync/', {
        repo_full_name: repoFullName,
        readme_path: path
      });
      if (res.ok) {
        const result = await res.json();
        setMessage({
          type: 'success',
          text: `Successfully synchronized ${result.project.title} (using file: ${path}). Status: ${result.created ? 'CREATED' : 'UPDATED'}.`,
        });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.detail || 'Synchronization routine failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network connection failed.' });
    } finally {
      setSyncingRepo(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>◉ VCS / GitHub Synchronization</h2>

      <div style={styles.searchBox}>
        <form onSubmit={handleFetchRepos}>
          <FormField label="GitHub Account Username">
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. alexchen-devops"
            />
          </FormField>
          <button type="submit" style={styles.searchBtn} disabled={loading}>
            {loading ? 'PULLING DATA...' : 'FETCH PUBLIC REPOSITORIES'}
          </button>
        </form>
      </div>

      {message && (
        <div style={{
          ...styles.statusText,
          backgroundColor: message.type === 'success' ? '#10b98122' : '#ef444422',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: message.type === 'success' ? '#10b981' : '#ef4444',
        }}>
          {message.type === 'success' ? '✓ ' : '✗ '} {message.text}
        </div>
      )}

      {syncingRepo && (
        <div style={{
          ...styles.statusText,
          backgroundColor: '#00d4ff11',
          border: '1px solid #00d4ff',
          color: '#00d4ff',
        }}>
          &gt; Running parse pipelines on {syncingRepo} (using file: {readmePaths[syncingRepo] || 'README.md'})...
        </div>
      )}

      <div>
        {repos.map((repo) => (
          <div key={repo.name} style={styles.repoCard}>
            <div style={styles.repoMeta}>
              <div style={styles.repoName}>{repo.name}</div>
              <div style={{ marginBottom: '8px' }}>{repo.description || 'No repository description available.'}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>
                Language: <strong>{repo.language || 'N/A'}</strong> | Stars: <strong>{repo.stargazers_count}</strong>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>Readme Path:</span>
                <input
                  style={{ ...styles.input, width: '200px', padding: '4px 8px', fontSize: '12px' }}
                  value={readmePaths[repo.full_name] || 'README.md'}
                  onChange={(e) => setReadmePaths({ ...readmePaths, [repo.full_name]: e.target.value })}
                  placeholder="README.md"
                />
              </div>
            </div>
            <button
              style={styles.syncBtn}
              onClick={() => handleSyncRepo(repo.full_name)}
              disabled={syncingRepo !== null}
            >
              SYNC
            </button>
          </div>
        ))}
        {repos.length === 0 && !loading && (
          <div style={{ color: '#475569', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', textAlign: 'center', padding: '40px' }}>
            &gt; Enter a GitHub username to discover and sync deployments.
          </div>
        )}
      </div>
    </div>
  );
}
