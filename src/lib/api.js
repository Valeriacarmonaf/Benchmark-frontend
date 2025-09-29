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

/*lista de países para el dropdown */
export async function fetchPaises() {
  const res = await fetch(`${BASE}/paises`);
  if (!res.ok) throw new Error('Error al cargar países');
  return res.json();
}

/*datos completos de la Home por país */
export async function fetchHome(paisId) {
  const url = new URL(`${BASE}/home`);
  url.searchParams.set('paisId', String(paisId));
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar datos de inicio');
  return res.json();
}
