// src/components/Sidebar.jsx
const SECCIONES = ['Inicio','Proveedores','Operadoras','Productos','Estadísticas','Administración'];

export default function Sidebar({ active, onSelect, open = false, onClose }) {
  return (
    <>
      {/* backdrop para móvil */}
      <div className={`cx-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} />

      <nav className={`cx-sidebar ${open ? 'is-open' : ''}`}>
        <ul className="cx-navlist">
          {SECCIONES.map((item) => {
            const current = active === item;
            return (
              <li key={item}>
                <button
                  className={`cx-navbtn ${current ? 'is-active' : ''}`}
                  onClick={() => { onSelect(item); onClose?.(); }}
                  type="button"
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
