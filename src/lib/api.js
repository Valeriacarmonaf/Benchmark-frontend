const BASE = import.meta.env.VITE_API_URL;

export async function fetchOperadoras(q = '') {
  const url = new URL(`${BASE}/operadoras`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar operadoras');
  return res.json();
}

export async function fetchCategorias() {
  const res = await fetch(`${BASE}/catalogo/categorias`);
  if (!res.ok) throw new Error('Error al cargar categorías');
  return res.json();
}
