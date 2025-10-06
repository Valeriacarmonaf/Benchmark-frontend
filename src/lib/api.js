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

export async function fetchProveedores(q = '') {
  const url = new URL(`${BASE}/proveedores`);
  if (q) url.searchParams.set('q', q);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar proveedores');
  return res.json();
}

export async function fetchProductos({ q = '', categoryId = '', limit = 24, offset = 0 } = {}) {
  const url = new URL(`${BASE}/products`);
  if (q) url.searchParams.set('q', q);
  if (categoryId) url.searchParams.set('categoryId', categoryId);
  url.searchParams.set('limit', limit);
  url.searchParams.set('offset', offset);

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json(); 
}

export async function fetchOperadoraById(id) {
  const res = await fetch(`${BASE}/operadoras/${id}`);
  if (!res.ok) throw new Error('Error al cargar operadora');
  return res.json();
}

export async function fetchOperadoraVas(id, { categoryId = '' } = {}) {
  const url = new URL(`${BASE}/operadoras/${id}/vas`);
  if (categoryId) url.searchParams.set('categoryId', categoryId);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar VAS de la operadora');
  return res.json();
}
