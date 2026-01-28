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

export async function fetchStatsTopOperadorasProductos() {
  const r = await fetch(`${BASE}/stats/top-operadoras-productos`);
  if (!r.ok) throw new Error('Error cargando top operadoras-productos');
  return r.json();
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

export async function fetchStatsMultinacional() {
  const r = await fetch(`${BASE}/stats/multinacional`);
  if (!r.ok) throw new Error('Error stats multinacional');
  return r.json();
}

export async function fetchStatsTopCategorias() {
  const r = await fetch(`${BASE}/stats/top-categorias`);
  if (!r.ok) throw new Error('Error stats top categorías');
  return r.json();
}

export async function fetchStatsPenetracionVAS() {
  const r = await fetch(`${BASE}/stats/penetracion-vas`);
  if (!r.ok) throw new Error('Error stats penetración VAS');
  return r.json();
}

export async function fetchStatsParticipacionPaises() {
  const r = await fetch(`${BASE}/stats/participacion-paises`);
  if (!r.ok) {
    let body = null;
    try { body = await r.text(); } catch (e) { body = String(e); }
    throw new Error(`Error stats participación países (status ${r.status}): ${body}`);
  }
  return r.json();
}

// Admin actions for operadoras (create / update / delete)
export async function createOperadora(payload) {
  const res = await fetch(`${BASE}/operadoras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando operadora (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateOperadora(id, payload) {
  const res = await fetch(`${BASE}/operadoras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando operadora (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteOperadora(id) {
  const res = await fetch(`${BASE}/operadoras/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error eliminando operadora (status ${res.status}): ${text}`);
  }
  return res.json();
}

// Proveedores CRUD
export async function createProveedor(payload) {
  const res = await fetch(`${BASE}/proveedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando proveedor (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateProveedor(id, payload) {
  const res = await fetch(`${BASE}/proveedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando proveedor (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteProveedor(id) {
  const res = await fetch(`${BASE}/proveedores/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error eliminando proveedor (status ${res.status}): ${text}`);
  }
  return res.json();
}

// Productos CRUD
export async function createProducto(payload) {
  const res = await fetch(`${BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando producto (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function updateProducto(id, payload) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando producto (status ${res.status}): ${text}`);
  }
  return res.json();
}

export async function deleteProducto(id) {
  const res = await fetch(`${BASE}/products/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error eliminando producto (status ${res.status}): ${text}`);
  }
  return res.json();
}
