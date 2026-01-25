export function normalizeEmail(email) {
  return (email || '').trim().toLowerCase();
}

export function isAllowedDomain(email) {
  const allowed = (import.meta.env.VITE_ALLOWED_DOMAINS || '')
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(Boolean);

  const value = normalizeEmail(email);
  const domain = value.split('@')[1] || '';
  return allowed.includes(domain);
}

export function getSiteUrl() {
  return import.meta.env.VITE_SITE_URL || window.location.origin;
}
