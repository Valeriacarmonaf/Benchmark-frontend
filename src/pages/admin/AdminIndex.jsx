import { useState } from 'react';
import AdminPaises from './AdminPaises';
import AdminOperadoras from './AdminOperadoras';
import AdminProveedores from './AdminProveedores';
import AdminProductos from './AdminProductos';

export default function AdminIndex() {
  const [tab, setTab] = useState('paises');
  return (
    <div style={{ padding: 20 }}>
      <h2>Panel administrativo</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setTab('paises')}>Países</button>{' '}
        <button onClick={() => setTab('operadoras')}>Operadoras</button>{' '}
        <button onClick={() => setTab('proveedores')}>Proveedores</button>{' '}
        <button onClick={() => setTab('productos')}>Productos</button>
      </div>

      <div>
        {tab === 'paises' && <AdminPaises />}
        {tab === 'operadoras' && <AdminOperadoras />}
        {tab === 'proveedores' && <AdminProveedores />}
        {tab === 'productos' && <AdminProductos />}
      </div>
    </div>
  );
}
