import { useEffect, useState } from 'react';
import { fetchCategorias, fetchOperadoraById, fetchOperadoraVas } from '../lib/api';

export default function OperadoraDetalle({ id, onBack }) {
  const [op, setOp] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carga detalle y categorías al montar
  useEffect(() => {
    (async () => {
      try {
        const [opData, cats] = await Promise.all([
          fetchOperadoraById(id),
          fetchCategorias(),
        ]);
        setOp(opData || null);
        setCategorias(cats || []);
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  // Carga VAS (productos) cada vez que cambia la categoría
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const rows = await fetchOperadoraVas(id, { categoryId });
        setProductos(rows || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [id, categoryId]);

  return (
    <div className="cx-content-placeholder">
      <button className="cx-linkback" onClick={onBack}>← Regresar a lista de operadoras</button>

      {/* Header de la operadora */}
      <div className="op-header">
        <div className="op-logoBox">{op?.foto ? <img src={op.foto} alt={op.nombre_empresa} /> : <div className="op-logoPlaceholder" />}</div>
        <div className="op-meta">
          <p><strong>Nombre:</strong> {op?.nombre_empresa || '—'}</p>
          <p><strong>Empresa matriz:</strong> {op?.empresa_matriz || '—'}</p>
          <p><strong>URL:</strong> {op?.url ? <a href={op.url} target="_blank" rel="noreferrer">{op.url}</a> : '—'}</p>
        </div>
      </div>

      {/* Toolbar de productos */}
      <div className="cx-toolbar" style={{marginTop: 12}}>
        <h3 style={{margin: 0}}>Lista de productos</h3>
        <div className="cx-filter" style={{marginLeft:'auto'}}>
          <label>Filtrar por categoría:&nbsp;</label>
          <select className="cx-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de tarjetas */}
      {loading ? <p>Cargando…</p> : (
        <div className="cx-grid" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {productos.map(p => (
            <article key={p.id_producto} className="cx-card">
              <h4 className="cx-card-title">{p.nombre_producto}</h4>
              <p className="cx-card-desc">{p.descripcion || 'Sin descripción.'}</p>
              <p className="cx-card-line"><strong>Categorías:</strong> {(p.categorias || []).join(', ') || '—'}</p>
              {/* <p className="cx-card-line"><strong>Proveedor:</strong> {p.proveedor || '—'}</p> */}
            </article>
          ))}
        </div>
      )}

      {!loading && productos.length === 0 && <p>No hay productos para esta categoría.</p>}
    </div>
  );
}
