import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ProveedoresPage from './pages/Proveedores';
import Productos from './pages/Productos';
import Operadoras from './pages/Operadoras';
import OperadoraDetalle from './pages/OperadoraDetalle';
import Estadisticas from './pages/Estadisticas';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import { useAuth } from './hooks/useAuth_new';

import './index.css';

export default function App() {
  const { session, loading, isAdmin, isActive, signOut } = useAuth();

  // Estado de navegación interna (tu app actual)
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [opId, setOpId] = useState(null);
  const [selectedPaisId, setSelectedPaisId] = useState(null);

  // Estado de pantallas auth
  const [authView, setAuthView] = useState('login'); // login | register | forgot | reset

  const openOperadora = (id) => {
    setOpId(id);
    setActive('operatorDetail');
  };

  // Si no hay sesión, fuerza auth
  useEffect(() => {
    if (!loading && !session) {
      setAuthView('login');
    }
  }, [loading, session]);

  useEffect(() => {
  if (!loading && session) {
    setAuthView('login'); // resetea pantallas auth
    setActive('home');    // entra al home al loguear
  }
}, [loading, session]);

  // Si hay sesión pero el usuario está inactivo, lo sacas
  useEffect(() => {
    if (!loading && session && isActive === false) {
      // seguridad extra: si lo bloquean en DB, se lo saca
      signOut();
    }
  }, [loading, session, isActive, signOut]);

  // Admin guard (UI)
  useEffect(() => {
    if (active === 'admin' && !isAdmin) {
      setActive('home');
    }
  }, [active, isAdmin]);

  const content = useMemo(() => {
    if (active === 'home') {
      return <Home onOpenOperadora={openOperadora} selectedPaisId={selectedPaisId} />;
    }
    if (active === 'providers') return <ProveedoresPage />;
    if (active === 'operators') return <Operadoras onOpen={openOperadora} />;
    if (active === 'products') return <Productos />;
    if (active === 'stats') return <Estadisticas />;
    if (active === 'operatorDetail') {
      return (
        <OperadoraDetalle
          id={opId}
          onBack={(paisId) => {
            setSelectedPaisId(paisId);
            setTimeout(() => setActive('home'), 50);
          }}
        />
      );
    }
    if (active === 'admin') {
      return (
        <>
          <h2>Administración</h2>
          <p>Contenido de Administración.</p>
        </>
      );
    }

    return (
      <>
        <h2>{active}</h2>
        <p>Contenido de {active}.</p>
      </>
    );
  }, [active, opId, selectedPaisId]);

  // 1) Cargando sesión
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <p>Cargando…</p>
      </div>
    );
  }

  // 2) Sin sesión: SOLO auth, nada de Home/Header/Sidebar
  if (!session) {
    if (authView === 'register') {
      return <Register onGoLogin={() => setAuthView('login')} />;
    }
    if (authView === 'forgot') {
      return <ForgotPassword onGoLogin={() => setAuthView('login')} />;
    }
    if (authView === 'reset') {
      return <ResetPassword onGoLogin={() => setAuthView('login')} />;
    }
    return (
      <Login
        onGoRegister={() => setAuthView('register')}
        onGoForgot={() => setAuthView('forgot')}
      />
    );
  }

  // 3) Con sesión: app normal
  return (
    <div className="cx-shell">
      <Header onToggleMenu={() => setMenuOpen(v => !v)} />

      <div className="cx-main">
        <Sidebar
          active={active}
          onSelect={setActive}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          isAdmin={isAdmin} // opcional: si tu Sidebar lo ignora, no pasa nada
        />

        <section
          className={`cx-content ${active === 'stats' ? 'is-scrollable' : ''}`}
          onClick={() => menuOpen && setMenuOpen(false)}
        >
          <div className="cx-content-placeholder">
            {content}
          </div>
        </section>
      </div>
    </div>
  );
}
