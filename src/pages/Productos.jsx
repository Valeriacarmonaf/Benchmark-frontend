// Frontend/src/pages/Productos.jsx
import { useEffect, useState } from 'react';
import { fetchProductos, fetchCategorias } from '../lib/api';

export default function Productos() {
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try { setCategorias(await fetchCategorias()); }
      catch (e) { console.error('Error categorías:', e); }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { total, items } = await fetchProductos({ q, categoryId, limit: 100, offset: 0 });
        setItems(items || []);
        setTotal(total || 0);
      } catch (e) {
        console.error('Error productos:', e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, categoryId]);

  return (
    <div className="cx-content-placeholder">
      <h2 className="cx-section-title">Productos</h2>

      <div className="cx-toolbar">
        <div className="cx-searchwrap">
          <input
            className="cx-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar productos u operadoras…"
            aria-label="Buscar productos"
          />
          <span className="cx-searchicon" aria-hidden>🔍</span>
        </div>

        <div className="cx-filter">
          <label>Filtrar por categoría:&nbsp;</label>
          <select
            className="cx-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>
                {c.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="results-info">{loading ? 'Cargando…' : `${total} resultado(s)`}</div>

      <div className="cx-grid" style={{ overflow: 'visible', paddingRight: 0 }}>
        {items.map(p => (
          <article className="cx-card" key={p.id_producto}>
            <h4 className="cx-card-title">{p.nombre_producto}</h4>
            <p className="cx-card-desc">{p.descripcion || 'Sin descripción.'}</p>
            <p className="cx-card-line"><strong>Categorías:</strong> {(p.categorias || []).join(', ') || '—'}</p>
            <p className="cx-card-line"><strong>Operadora:</strong> {(p.operadoras || []).join(', ') || '—'}</p>
          </article>
        ))}
      </div>

      {!loading && items.length === 0 && <p>No se encontraron productos para “{q || '…'}”.</p>}
    </div>
  );
}
