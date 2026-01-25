// src/components/Sidebar.jsx
const SECCIONES = [
  { label: 'Inicio',          value: 'home' },
  { label: 'Proveedores',     value: 'providers' },
  { label: 'Operadoras',      value: 'operators' },
  { label: 'Productos',       value: 'products' },
  { label: 'Estadísticas',    value: 'stats' },
  { label: 'Administración',  value: 'admin', requiresAdmin: true },
];

export default function Sidebar({ active, onSelect, open = false, onClose, isAdmin = false }) {
  const sectionsToShow = SECCIONES.filter(s => !s.requiresAdmin || isAdmin);

  return (
    <>
      <div className={`cx-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />
      <nav className={`cx-sidebar ${open ? 'is-open' : ''}`}>
        <ul className="cx-navlist">
          {sectionsToShow.map(({ label, value }) => {
            const current = active === value;
            return (
              <li key={value}>
                <button
                  className={`cx-navbtn ${current ? 'is-active' : ''}`}
                  onClick={() => { onSelect(value); onClose?.(); }}
                  type="button"
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
