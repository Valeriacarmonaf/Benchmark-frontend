import { useEffect, useMemo, useState } from 'react';
import pageStyles from './Estadisticas.module.css';

import {
  fetchStatsMultinacional,
  fetchStatsTopCategorias,
  fetchStatsPenetracionVAS,
  fetchStatsParticipacionPaises,
  fetchStatsTopOperadorasProductos,
} from '../lib/api';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import StatCard from '../components/stats/StatCard';
import StatHeader from '../components/stats/StatHeader';
import KpiCard from '../components/stats/KpiCard';
import ChartBox from '../components/stats/ChartBox';
import EmptyState from '../components/stats/EmptyState';
import TooltipCard from '../components/stats/TooltipCard';

const COLORS = {
  green: '#A3E635',
  greenDark: '#65A30D',
  teal: '#14B8A6',
  tealDark: '#0F766E',
  pink: '#EC4899',
  orange: '#F59E0B',
  slate: '#334155',
};

const PIE_COLORS = [
  COLORS.green,
  COLORS.teal,
  COLORS.orange,
  COLORS.pink,
  '#60A5FA',
  '#8B5CF6',
  '#22C55E',
  '#F97316',
];

function truncateLabel(str, max = 12) {
  if (!str) return '';
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

// Tooltip genérico para barras
function BarTooltip({ active, payload, label, valueSuffix = '' }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const title = row?.nombre_pais ?? label;
  const v = payload[0]?.value;

  return (
    <TooltipCard
      title={title}
      lines={[`Valor: ${v}${valueSuffix}`]}
    />
  );
}


// Tooltip para multinacional (incluye países)
function MultinacionalTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const paises = row?.paises?.length ? row.paises.join(', ') : '—';

  return (
    <TooltipCard
      title={label}
      lines={[
        `Países: ${row?.paises_count ?? '—'}`,
        `Lista: ${paises}`,
      ]}
    />
  );
}

// Tooltip para participación (porcentaje + absolutos)
function ParticipacionTooltip({ active, payload, label, kind = 'productos' }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  const title = row?.nombre_pais ?? label;

  const pct = kind === 'productos' ? row?.pct_productos : row?.pct_operadoras;
  const abs = kind === 'productos' ? row?.productos : row?.operadoras;
  const absLabel = kind === 'productos' ? 'Productos' : 'Operadoras';

  return (
    <TooltipCard
      title={title}
      lines={[
        `${pct}% del total regional`,
        `${absLabel}: ${abs}`,
      ]}
    />
  );
}


export default function Estadisticas() {
  const [multi, setMulti] = useState([]);
  const [cats, setCats] = useState([]);
  const [penetr, setPenetr] = useState([]);
  const [part, setPart] = useState([]);
  const [opsTop, setOpsTop] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d, e] = await Promise.all([
          fetchStatsMultinacional(),
          fetchStatsTopCategorias(),
          fetchStatsPenetracionVAS(),
          fetchStatsParticipacionPaises(),
          fetchStatsTopOperadorasProductos(),
        ]);
        setMulti(a);
        setCats(b);
        setPenetr(c);
        setPart(d);
        setOpsTop(e);
      } catch (f) {
        console.error(f);
        setErr(f.message || 'Error cargando estadísticas');
      }
    })();
  }, []);

  // ======= KPIs (de las fuentes disponibles) =======
  const topCategoria = useMemo(() => {
    if (!cats?.length) return null;
    const x = cats[0];
    return {
      id: x.id_categoria,
      nombre: x.nombre_categoria,
      productos: x.productos_activos,
    };
  }, [cats]);

  const topOperadora = useMemo(() => {
    if (!opsTop?.length) return null;
    const x = opsTop[0];
    return {
      id: x.id_empresa,
      nombre: x.operadora,
      productos: x.productos,
    };
  }, [opsTop]);

  // País con mayor productos VAS (usamos part porque ya trae productos por país)
  const topPaisProductos = useMemo(() => {
    if (!part?.length) return null;
    const sorted = [...part].sort((a, b) => (b.productos || 0) - (a.productos || 0));
    const x = sorted[0];
    return {
      id: x.id_pais,
      nombre: x.nombre_pais,
      productos: x.productos,
    };
  }, [part]);

  // ======= Datasets para cards =======
  const multiTop8 = useMemo(() => [...multi].slice(0, 8), [multi]);

  const penetrBottom12 = useMemo(() => {
    const sorted = [...penetr].sort((a, b) => (a.productos_por_millon || 0) - (b.productos_por_millon || 0));
    return sorted.slice(0, 12);
  }, [penetr]);

  const catsTop8 = useMemo(() => [...cats].slice(0, 8), [cats]);

  // Participación: si hay muchos países, mostramos top 12 por productos
  const partTop12 = useMemo(() => [...part].slice(0, 12), [part]);

  return (
    <div className={pageStyles.page}>
      <h2 className="cx-section-title">Estadísticas</h2>
      {err ? <p style={{ color: 'crimson' }}>{err}</p> : null}

      {/* KPIs */}
      <div className={pageStyles.kpiGrid}>
        <KpiCard
          title="Categoría TOP"
          value={topCategoria?.nombre}
          sub={topCategoria ? `(${topCategoria.productos} productos)` : 'Sin datos'}
        
        />

        <KpiCard
          title="País con mayor productos VAS"
          value={topPaisProductos?.nombre}
          sub={topPaisProductos ? `(${topPaisProductos.productos} productos)` : 'Sin datos'}
      
        />

        <KpiCard
          title="Operadora con más productos asociados"
          value={topOperadora?.nombre}
          sub={topOperadora ? `(${topOperadora.productos} productos)` : 'Sin datos'}
      
        />
      </div>

      {/* 2 charts row */}
      <div className={pageStyles.twoGrid}>
        {/* Multinacional */}
        <StatCard>
          <StatHeader
          
            title="Operadoras con presencia multinacional (por matriz)"
            description="Número de países donde opera cada empresa matriz (top 5)."
          />

          <ChartBox height={260}>
            <ResponsiveContainer>
              <BarChart data={multiTop8}>
                <XAxis
                  dataKey="matriz"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  tickFormatter={(v) => truncateLabel(v, 12)}
                />
                <YAxis />
                <Tooltip content={<MultinacionalTooltip />} />
                <Bar
                  dataKey="paises_count"
                  fill={COLORS.green}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          {!multiTop8.length ? <EmptyState text="No hay datos para mostrar." /> : null}
        </StatCard>

        {/* Penetración */}
        <StatCard>
          <StatHeader
          
            title="Ranking de países con menor penetración VAS (prod/millón)"
            description="Productos distintos por millón de habitantes (bottom 12)."
          />

          <ChartBox height={260}>
            <ResponsiveContainer>
              <BarChart data={penetrBottom12}>
                <XAxis
                  dataKey="codigo"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  tickFormatter={(v) => truncateLabel(v, 10)}
                />
                <YAxis />
                <Tooltip content={<BarTooltip valueSuffix=" prod/millón" />} />
                <Bar
                  dataKey="productos_por_millon"
                  fill={COLORS.teal}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          {!penetrBottom12.length ? <EmptyState text="No hay datos para mostrar." /> : null}
        </StatCard>
      </div>

      {/* Top categorías */}
      <div className={pageStyles.sectionGap}>
        <StatCard>
          <StatHeader
          
            title="Top categorías con mayor presencia"
            description="Cantidad de productos activos por categoría (top 8)."
          />

          <ChartBox height={280}>
            <ResponsiveContainer>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0]?.payload;
                    return (
                      <TooltipCard
                        title={p?.nombre_categoria}
                        lines={[`Productos activos: ${p?.productos_activos}`]}
                      />
                    );
                  }}
                />
                <Pie
                  data={catsTop8}
                  dataKey="productos_activos"
                  nameKey="nombre_categoria"
                  outerRadius={110}
                  labelLine={false}
                  label={(d) => truncateLabel(d?.payload?.nombre_categoria, 14)}
                >
                  {catsTop8.map((row, i) => (
                    <Cell key={row.id_categoria} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          {!catsTop8.length ? <EmptyState text="No hay datos para mostrar." /> : null}
        </StatCard>
      </div>

      {/* Participación */}
      <div className={pageStyles.sectionGap}>
        <StatCard>
          <StatHeader
          
            title="Participación de países en el mercado VAS"
            description="Comparación de participación por productos y por operadoras."
          />

          <div className={pageStyles.longText}>
            Esta gráfica muestra la participación de cada país en el mercado VAS latinoamericano, expresada como porcentaje del total regional.
            Se comparan dos dimensiones: el porcentaje de productos activos y el porcentaje de operadoras en cada país.
            <br /><br />
            Un país con una alta participación en productos y alta participación en operadoras refleja un mercado desarrollado y competitivo.
            En cambio, si un país tiene muchas operadoras pero pocos productos, significa que el ecosistema existe pero la oferta de contenidos aún es limitada,
            representando una oportunidad para expandir el catálogo VAS.
            <br /><br />
            Por el contrario, países con pocos operadores pero alto número de productos pueden indicar mercados concentrados o dependientes de pocas operadoras dominantes.
          </div>

          <div className={pageStyles.twoGrid} style={{ marginTop: 12 }}>
            {/* Por productos */}
            <StatCard>
              <StatHeader title="Porcentaje por productos" description="(% del total regional)" />
              <ChartBox height={260}>
                <ResponsiveContainer>
                  <BarChart data={partTop12}>
                    <XAxis
                      dataKey="codigo"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      tickFormatter={(v) => truncateLabel(v, 10)}
                    />
                    <YAxis />
                    <Tooltip content={<ParticipacionTooltip kind="productos" />} />
                    <Bar
                      dataKey="pct_productos"
                      fill={COLORS.orange}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              {!partTop12.length ? <EmptyState text="No hay datos para mostrar." /> : null}
            </StatCard>

            {/* Por operadoras */}
            <StatCard>
              <StatHeader title="Porcentaje por operadoras" description="(% del total regional)" />
              <ChartBox height={260}>
                <ResponsiveContainer>
                  <BarChart data={partTop12}>
                    <XAxis
                      dataKey="codigo"
                      tick={{ fontSize: 11 }}
                      interval={0}
                      tickFormatter={(v) => truncateLabel(v, 10)}
                    />
                    <YAxis />
                    <Tooltip content={<ParticipacionTooltip kind="operadoras" />} />
                    <Bar
                      dataKey="pct_operadoras"
                      fill={COLORS.greenDark}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>
              {!partTop12.length ? <EmptyState text="No hay datos para mostrar." /> : null}
            </StatCard>
          </div>
        </StatCard>
      </div>
    </div>
  );
}
