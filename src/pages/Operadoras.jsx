import { useEffect, useState } from 'react';
import { fetchOperadoras } from '../lib/api';

export default function OperadorasPage() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try { setRows(await fetchOperadoras(q)); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Operadoras</h1>
      <div style={{ marginBottom: 12 }}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar operadora…"
          style={{ padding: 8, width: 280, marginRight: 8 }}
        />
        <button onClick={load} disabled={loading}>
          {loading ? 'Cargando…' : 'Buscar'}
        </button>
      </div>
      <ul>
        {rows.map(r => (
          <li key={r.id_empresa}>
            {r.nombre_empresa} — {r.nombre_pais || '—'} {r.matriz ? `(${r.matriz})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
