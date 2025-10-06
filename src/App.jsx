// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ProveedoresPage from './pages/Proveedores';
import Productos from './pages/Productos';
import Operadoras from './pages/Operadoras';
import OperadoraDetalle from './pages/OperadoraDetalle'; 
import './index.css';

export default function App() {
  const [active, setActive] = useState('Inicio');
  const [menuOpen, setMenuOpen] = useState(false);
  const [opId, setOpId] = useState(null);             

  // Navegar al detalle
  const openOperadora = (id) => {
    setOpId(id);
    setActive('Operadora');                      
  };

  return (
    <div className="cx-shell">
      <Header onToggleMenu={() => setMenuOpen(v => !v)} />

      <div className="cx-main">
        <Sidebar
          active={active}
          onSelect={setActive}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />

        <section
          className="cx-content"
          onClick={() => menuOpen && setMenuOpen(false)}
        >
          <div className="cx-content-placeholder">
            {active === 'Inicio' ? (
              <Home onOpenOperadora={openOperadora} />          
            ) : active === 'Proveedores' ? (
              <ProveedoresPage />
            ) : active === 'Operadoras' ? (
              <Operadoras onOpen={openOperadora} />              
            ) : active === 'Productos' ? (
              <Productos />
            ) : active === 'Operadora' ? (
              <OperadoraDetalle
                id={opId}
                onBack={() => setActive('Operadoras')}          
              />
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
