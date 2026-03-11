// Frontend/src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react';
import { fetchPaises, fetchHome } from '../lib/api';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';


const GREEN = '#A6D33D';
const PALETTE = ['#A6D33D', '#89C13C', '#6FB03A', '#559E38', '#3C8C36', '#227A34'];

export default function Home({ onOpenOperadora, selectedPaisId }) {
  const [paises, setPaises] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  //Cargar países al montar
  useEffect(() => {
    (async () => {
      try {
        const ps = await fetchPaises();
        setPaises(ps);
        // Si ya tenemos un país seleccionado, lo mantenemos. Si no, tomamos el primero.
        if (ps.length) {
          if (selectedPaisId) {
            setPaisId(String(selectedPaisId));     // usa directamente el país que viene del detalle
          } else {
            setPaisId(ps[0].id_pais);              // si no viene nada, usa el primero por defecto
          }
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedPaisId]); //corrección copilot

  //Si App.jsx nos pasa un país seleccionado (por ejemplo al volver del detalle), aplicarlo
  useEffect(() => {
    if (selectedPaisId) {
      setPaisId(String(selectedPaisId));
    }
  }, [selectedPaisId]);

  // 🔹 Cargar datos de Home según país seleccionado
  useEffect(() => {
    if (!paisId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchHome(paisId);
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [paisId]);

  // 🔹 Preparar datos para el gráfico
  const pieData = useMemo(() => {
    if (!data?.marketshare) return [];
    return data.marketshare.map((r) => ({
      name: r.nombre_empresa,
      value: Number(r.porcentaje) || 0
    }));
  }, [data]);

  return (
    <div style={{ padding: 16 }}>
      {/* 🔹 Dropdown de países */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <label style={{ fontWeight: 600 }}>País:</label>
        <select
          value={paisId}
          onChange={(e) => setPaisId(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 999,
            border: '1px solid #d1d5db',
            background: '#E5F2C6'
          }}
          aria-label="Seleccionar país"
        >
          {paises.map((p) => (
            <option key={p.id_pais} value={p.id_pais}>
              {p.nombre_pais}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando…</p>}

      {!loading && data && (
        <>
          {/* 🔹 Row 2: Pie + KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginBottom: 16
            }}
          >
            {/* PieChart card */}
            <div style={cardStyle}>
              <h3 style={cardTitle}>Marketshare</h3>
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPIs card */}
            <div style={cardStyle}>
              <h3 style={cardTitle}>Datos demográficos</h3>
              <div
                style={{
                  minHeight: 220,
                  display: 'grid',
                  gridTemplateRows: 'repeat(3, 1fr)',
                  rowGap: 18,
                  paddingTop: 12
                }}
              >
                <Row label="Total habitantes" value={formatNumber(data.pais?.total_habitantes)} />
                <Row label="Total operadoras" value={data.kpis?.operadoras ?? 0} />
                <Row label="Nº Productos VAS" value={data.kpis?.productos ?? 0} />
              </div>
            </div>
          </div>

          {/* 🔹 Galería de operadoras asociadas */}
          <div style={{ marginTop: 8 }}>
            <h3 className="cx-section-title">Operadoras asociadas</h3>
            <div style={gridGallery}>
              {data.operadoras?.length ? (
                data.operadoras.map((op) => (
                  <div
                    key={op.id_empresa}
                    style={{ ...tile, cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpenOperadora?.(op.id_empresa)}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      onOpenOperadora?.(op.id_empresa)
                    }
                  >
                    <span style={{ textAlign: 'center', fontWeight: 600 }}>
                      {op.nombre_empresa}
                    </span>
                  </div>
                ))
              ) : (
                <p>No hay operadoras registradas.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* 🔹 Helpers visuales */
function Row({ label, value }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '10px 0',
        lineHeight: 1.35
      }}
    >
      <span style={{ color: '#555' }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

const formatNumber = (n) => {
  if (n === null || n === undefined || n === '') return '—';
  const normalized = typeof n === 'string' ? n.replace(/[.,\s]/g, '') : n;
  const num = Number(normalized);
  if (!Number.isFinite(num)) return '—';
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(num);
};

const cardStyle = {
  background: '#F3F7EA',
  borderRadius: 14,
  boxShadow: '0 6px 20px rgba(0,0,0,.08)',
  padding: 14
};

const cardTitle = { margin: 0, marginBottom: 8 };

const gridGallery = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 16
};

const tile = {
  background: '#CDE78A',
  borderRadius: 12,
  minHeight: 120,
  display: 'grid',
  placeItems: 'center',
  padding: 12,
  boxShadow: '0 4px 14px rgba(0,0,0,.08)'
};
