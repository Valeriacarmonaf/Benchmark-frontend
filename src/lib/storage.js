export const STORAGE_BASE =
  'https://peeyptigsmryrqtuhpvs.supabase.co/storage/v1/object/public/logos/';

export function getLogoUrl(path) {
  if (!path) return null;
  const clean = String(path).replace(/^\/+/, '');
  return STORAGE_BASE + clean;
}