import { useEffect, useState } from 'react';
import styles from './AdminIndex.module.css';
import cardStyles from '../../components/AdminCard.module.css';
import AdminCard from '../../components/AdminCard';
import { fetchProveedores, fetchEmpresasMatriz, createProveedor, updateProveedor, deleteProveedor } from '../../lib/api';

function normalizeIdSelection(rawValue, options, idKey, nameKey) {
  const nameToId = new Map(
    (options || []).map((opt) => [String(opt[nameKey] || '').trim().toLowerCase(), Number(opt[idKey])])
  );

  const rawArray = Array.isArray(rawValue)
    ? rawValue
    : typeof rawValue === 'string'
      ? rawValue.split(',').map((v) => v.trim()).filter(Boolean)
      : [];

  const ids = rawArray
    .map((entry) => {
      const numeric = Number(entry);
      if (Number.isFinite(numeric)) return numeric;
      return nameToId.get(String(entry || '').trim().toLowerCase());
    })
    .filter((id) => Number.isFinite(id));

  return Array.from(new Set(ids));
}

export default function AdminProveedores() {
  const [items, setItems] = useState([]);
  const [matrices, setMatrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [ps, ms] = await Promise.all([fetchProveedores(), fetchEmpresasMatriz()]);
      setItems(ps || []);
      setMatrices(ms || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpdate(item, values) {
    const payload = {
      nombre_proveedor: values.nombre_proveedor,
      descripcion_proveedor: values.descripcion_proveedor,
      clientes: normalizeIdSelection(values.clientes, matrices, 'id_empresa', 'nombre_empresa'),
    };
    await updateProveedor(item.id_proveedor, payload);
    await load();
  }

  async function handleDelete(item) {
    try { await deleteProveedor(item.id_proveedor); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  async function handleCreate(payload) {
    await createProveedor(payload);
    await load();
    setOpenCreate(false);
  }

  const filtered = items.filter(i => i.nombre_proveedor.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h3>Proveedores</h3>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Buscar..." value={query} onChange={(e)=>setQuery(e.target.value)} />
      </div>

      {loading ? <div>Cargando...</div> : (
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
            <div className={styles.plusCard} onClick={()=>setOpenCreate(true)}>+</div>
            {openCreate && (
              <div className={cardStyles.card}>
                <h4 style={{marginTop:0}}>Crear proveedor</h4>
                <CreateProveedorInline operadoras={matrices} onCreate={handleCreate} onCancel={()=>setOpenCreate(false)} />
              </div>
            )}
            {filtered.map(i => (
              <AdminCard
                key={i.id_proveedor}
                item={i}
                fixedSize
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                renderView={(it)=> (
                  <div className={styles.proveedorView}>
                    <strong className={styles.proveedorTitle}>{it.nombre_proveedor}</strong>
                    <div className={styles.proveedorLine}>{it.descripcion_proveedor || 'Sin descripción'}</div>
                    <div className={styles.proveedorLine}>Clientes: {Array.isArray(it.clientes) ? it.clientes.join(', ') : (it.clientes || '-')}</div>
                  </div>
                )}
                renderEdit={(values, setValues, { onCancel, onSave, saving }) => (
                  <div>
                    <div className="row"><label>Nombre</label><input value={values.nombre_proveedor || ''} onChange={(e)=>setValues({...values, nombre_proveedor: e.target.value})} /></div>
                    <div className="row"><label>Descripción</label><textarea value={values.descripcion_proveedor || ''} onChange={(e)=>setValues({...values, descripcion_proveedor: e.target.value})} /></div>
                    <div className="row"><label>Clientes (seleccionar)</label>
                      <div className={styles.multiSelectList} style={{ maxHeight: 120, overflow: 'auto' }}>
                        {matrices.map(o => (
                          <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={normalizeIdSelection(values.clientes, matrices, 'id_empresa', 'nombre_empresa').includes(o.id_empresa)} onChange={()=>{
                            const set = new Set(normalizeIdSelection(values.clientes, matrices, 'id_empresa', 'nombre_empresa'));
                            if (set.has(o.id_empresa)) set.delete(o.id_empresa); else set.add(o.id_empresa);
                            setValues({...values, clientes: Array.from(set)});
                          }} /> {o.nombre_empresa}</label></div>
                        ))}
                      </div>
                    </div>
                    <div className="actions"><button disabled={saving} onClick={onSave}>Guardar</button><button onClick={onCancel}>Cancelar</button></div>
                  </div>
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* inline create handled next to + */}
    </div>
  );
}

function CreateProveedorForm({ operadoras, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_proveedor: '', descripcion_proveedor: '', clientes: [] });
  function toggleCliente(id) {
    const set = new Set(form.clientes || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, clientes: Array.from(set) });
  }
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_proveedor} onChange={(e)=>setForm({...form, nombre_proveedor: e.target.value})} required /></div>
      <div><label>Descripción</label><textarea value={form.descripcion_proveedor} onChange={(e)=>setForm({...form, descripcion_proveedor: e.target.value})} /></div>
      <div><label>Clientes (seleccionar)</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {operadoras.map(o => (
            <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.clientes.includes(o.id_empresa)} onChange={()=>toggleCliente(o.id_empresa)} /> {o.nombre_empresa}</label></div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}

function CreateProveedorInline({ operadoras, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_proveedor: '', descripcion_proveedor: '', clientes: [] });
  function toggleCliente(id) {
    const set = new Set(form.clientes || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, clientes: Array.from(set) });
  }
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_proveedor} onChange={(e)=>setForm({...form, nombre_proveedor: e.target.value})} required /></div>
      <div><label>Descripción</label><textarea value={form.descripcion_proveedor} onChange={(e)=>setForm({...form, descripcion_proveedor: e.target.value})} /></div>
      <div><label>Clientes (seleccionar)</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {operadoras.map(o => (
            <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.clientes.includes(o.id_empresa)} onChange={()=>toggleCliente(o.id_empresa)} /> {o.nombre_empresa}</label></div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}
