import { fetchOperadoras } from '../lib/api';
import { useSearchList } from '../hooks/useSearchList';
import SearchToolbar from '../components/SearchToolbar';
import CardGrid from '../components/CardGrid';
import { useCallback } from 'react';


export default function Operadoras({ onOpen }) {  
  const fetcher = useCallback(async ({ q }) => {
    const list = await fetchOperadoras(q);
    return { total: list.length, items: list };
  }, []);

  const { q, setQ, items, total, pending, limit, offset, setOffset } =
    useSearchList(fetcher, { pageSize: 24 });

  return (
    <div className="cx-content-placeholder">
      <h2 className="cx-section-title">Operadoras en el sistema</h2>

      <SearchToolbar
        q={q}
        setQ={setQ}
        placeholder="Buscar… (por nombre)"
      />

      <div className="results-info">
        {pending ? 'Cargando…' : `${total} resultado(s)`}
      </div>

      <CardGrid
        items={items}
        renderItem={(op) => (
          <article
            key={op.id_empresa ?? op.id}
            className="cx-card cx-op-card"
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onClick={() => onOpen?.(op.id_empresa)}                  
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen?.(op.id_empresa)} 
          >
            <div className="cx-op-logoWrap">
              {op.foto || op.logo_url || op.url_logo ? (
                <img
                  className="cx-op-logo"
                  src={op.foto || op.logo_url || op.url_logo}
                  alt={op.nombre_empresa || op.nombre}
                />
              ) : (
                <div className="cx-op-monogram" aria-hidden>
                  {getInitials(op.nombre_empresa || op.nombre)}
                </div>
              )}
            </div>
            <h4 className="cx-op-name">{op.nombre_empresa || op.nombre}</h4>
          </article>
        )}
      />

      {total > limit && (
        <div className="pager">
          <button
            disabled={offset === 0}
            onClick={() => setOffset(Math.max(0, offset - limit))}
          >
            ← Anterior
          </button>
          <button
            disabled={offset + limit >= total}
            onClick={() => setOffset(offset + limit)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] || '';
  const b = parts[1]?.[0] || '';
  return (a + b).toUpperCase();
}
