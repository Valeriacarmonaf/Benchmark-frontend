
import { fetchProveedores } from '../lib/api';
import { useSearchList } from '../hooks/useSearchList';
import SearchToolbar from '../components/SearchToolbar';
import CardGrid from '../components/CardGrid';
import { useCallback } from 'react';

export default function ProveedoresPage() {
  // Adaptador al hook. Tu endpoint devuelve un array; lo envolvemos.
  const fetcher = useCallback(async ({ q }) => {
    const list = await fetchProveedores(q);
    return { total: list.length, items: list };
  }, []);

  const { q, setQ, items, total, pending, limit, offset, setOffset } =
    useSearchList(fetcher, { pageSize: 24 });

  return (
    <div className="cx-content-placeholder">
      <h2 className="cx-section-title">Lista de proveedores</h2>

      <SearchToolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar… (proveedor o cliente)"
      />

      <div className="results-info">{pending ? 'Cargando…' : `${total} resultado(s)`}</div>

      <CardGrid
        items={items}
        renderItem={(p) => (
          <article key={p.id_proveedor} className="cx-card">
            <h4 className="cx-card-title">{p.nombre_proveedor}</h4>
            {p.descripcion_proveedor && <p className="cx-card-desc">{p.descripcion_proveedor}</p>}
            <div className="cx-card-meta">
              <span className="cx-meta-label">Clientes:</span>
              <p className="cx-meta-text">{p.clientes || '—'}</p>
            </div>
          </article>
        )}
      />

      {total > limit && (
        <div className="pager">
          <button disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>← Anterior</button>
          <button disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}
