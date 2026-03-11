import { useState } from 'react';
import AdminPaises from './AdminPaises';
import AdminOperadoras from './AdminOperadoras';
import AdminProveedores from './AdminProveedores';
import AdminProductos from './AdminProductos';
import styles from './AdminIndex.module.css';

export default function AdminIndex() {
  const [tab, setTab] = useState('paises');
  return (
    <div className={styles.adminRoot}>
      <h2>Panel administrativo</h2>
      <a
        className={styles.scrappingLink}
        href="https://docs.google.com/spreadsheets/d/1gbOhpIomL-w2cGalS6QpM91LN7Wee1u9y3lHstrjpuA/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        Acceder a resultados del scrapping
      </a>
      <div className={styles.nav}>
        <button className={`${styles.navButton} ${tab==='paises'? styles.activeBtn : ''}`} onClick={() => setTab('paises')}>Países</button>
        <button className={`${styles.navButton} ${tab==='operadoras'? styles.activeBtn : ''}`} onClick={() => setTab('operadoras')}>Operadoras</button>
        <button className={`${styles.navButton} ${tab==='proveedores'? styles.activeBtn : ''}`} onClick={() => setTab('proveedores')}>Proveedores</button>
        <button className={`${styles.navButton} ${tab==='productos'? styles.activeBtn : ''}`} onClick={() => setTab('productos')}>Productos</button>
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
