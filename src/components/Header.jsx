// src/components/Header.jsx
import logo from '../assets/conectiumlogo.png';

export default function Header({ onToggleMenu }) {
  return (
    <header className="cx-header">
      {/* Botón hamburguesa (solo móvil) */}
      <button className="cx-burger" type="button" onClick={onToggleMenu} aria-label="Abrir menú">
        <span />
        <span />
        <span />
      </button>

      {/* Logo a la izquierda */}
      <img src={logo} alt="Conectium" className="cx-logo" />

      {/* Usuario a la derecha */}
      <div className="cx-user">
        <div className="cx-user-circle">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="cx-user-icon">
            <path d="M12 12c2.761 0 5-2.686 5-6S14.761 0 12 0 7 2.686 7 6s2.239 6 5 6zm0 2c-4.418 0-8 3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z"/>
          </svg>
        </div>
      </div>
    </header>
  );
}

