export default function SearchToolbar({
  q, setQ, placeholder = 'Buscar…',
  options = null, value = '', onChange = () => {}
}) {
  return (
    <div className="cx-toolbar">
      <div className="cx-searchwrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label="Buscar"
          className="cx-search"
        />
        <span className="cx-searchicon" aria-hidden>🔍</span>
      </div>

      {Array.isArray(options) && (
        <div className="cx-filter">
          <label>Filtrar:&nbsp;</label>
          <select value={value} onChange={(e) => onChange(e.target.value)} className="cx-select">
            <option value="">Todos</option>
            {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
