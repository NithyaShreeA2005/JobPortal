/**
 * Format a salary string (passthrough with fallback).
 */
export const formatSalary = (salary) =>
  salary || 'Salary not disclosed';

/**
 * Return a human-readable "time ago" string from an ISO date.
 */
export const timeAgo = (isoString) => {
  if (!isoString) return '';
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Truncate long strings to `maxLength` characters.
 */
export const truncate = (text = '', maxLength = 100) =>
  text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + '…';

/**
 * Get initials from a full name (up to 2 chars).
 */
export const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

/**
 * Check if an email address is valid.
 */
export const isValidEmail = (email = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
