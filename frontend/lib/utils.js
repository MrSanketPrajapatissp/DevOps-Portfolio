export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatMonthYear(dateStr) {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getStatusColor(status) {
  const map = {
    available: '#10b981',
    open: '#f59e0b',
    unavailable: '#ef4444',
    deployed: '#10b981',
    in_progress: '#f59e0b',
    archived: '#475569',
    obtained: '#10b981',
    expired: '#ef4444',
    online: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    offline: '#475569',
  };
  return map[status] || '#94a3b8';
}

export function truncate(str, len = 100) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
