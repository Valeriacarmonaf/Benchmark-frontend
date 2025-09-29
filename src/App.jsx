// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';       
import './index.css';

export default function App() {
  const [active, setActive] = useState('Inicio'); 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="cx-shell">
      <Header onToggleMenu={() => setMenuOpen((v) => !v)} />

      <div className="cx-main">
        <Sidebar
          active={active}
          onSelect={setActive}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <section className="cx-content" onClick={() => menuOpen && setMenuOpen(false)}>
          <div className="cx-content-placeholder">
            {active === 'Inicio' ? (
              <Home />
            ) : (
              <>
                <h2>{active}</h2>
                <p>Contenido de <strong>{active}</strong>.</p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

