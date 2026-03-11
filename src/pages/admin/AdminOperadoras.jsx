
import { useEffect, useState } from 'react';
import styles from './AdminIndex.module.css';
import cardStyles from '../../components/AdminCard.module.css';
import AdminCard from '../../components/AdminCard';
import { fetchOperadoras, fetchPaises, createOperadora, updateOperadora, deleteOperadora } from '../../lib/api';

export default function AdminOperadoras() {
  const [items, setItems] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [ops, ps] = await Promise.all([fetchOperadoras(), fetchPaises()]);
      setItems(ops || []);
      setPaises(ps || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpdate(item, values) {
    // handle possible creation of parent company
    let fk_e_to_use = values.fk_e ?? null;
    const enteredParentName = (values.empresa_matriz_nombre || '').trim();
    const currentParentName = (item.empresa_matriz || item.matriz || '').trim();

    if (enteredParentName) {
      if (item.fk_e && enteredParentName.toLowerCase() === currentParentName.toLowerCase()) {
        fk_e_to_use = item.fk_e;
      } else {
        const parentPayload = { nombre_empresa: enteredParentName, tipo_empresa: null, url: null, foto: null, cantidad_usuarios: 0, fk_e: null, id_pais: null };
        const parent = await createOperadora(parentPayload);
        fk_e_to_use = parent.id_empresa;
      }
    }

    const payload = {
      nombre_empresa: values.nombre_empresa,
      tipo_empresa: values.tipo_empresa,
      url: values.url,
      foto: values.foto,
      cantidad_usuarios: Number(values.cantidad_usuarios) || 0,
      fk_e: fk_e_to_use,
      id_pais: values.id_pais ? Number(values.id_pais) : null,
    };
    await updateOperadora(item.id_empresa, payload);
    await load();
  }

  async function handleDelete(item) {
    try { await deleteOperadora(item.id_empresa); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  async function handleCreate(payload) {
    await createOperadora(payload);
    await load();
    setOpenCreate(false);
  }

  const filtered = items.filter(i => i.nombre_empresa.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h3>Operadoras</h3>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Buscar..." value={query} onChange={(e)=>setQuery(e.target.value)} />
      </div>

      {loading ? <div>Cargando...</div> : (
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
            <div className={styles.plusCard} onClick={()=>setOpenCreate(true)}>+</div>
            {openCreate && (
              <div className={cardStyles.card}>
                <h4 style={{marginTop:0}}>Crear operadora</h4>
                <CreateOperadoraInline paises={paises} onCreate={handleCreate} onCancel={()=>setOpenCreate(false)} />
              </div>
            )}
            {filtered.map(i => (
              <AdminCard
                key={i.id_empresa}
                item={i}
                fixedSize
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                renderView={(it)=> (
                  <div className={styles.operadoraView}>
                    <strong className={styles.operadoraTitle}>{it.nombre_empresa}</strong>
                    <div className={styles.operadoraLine}>{it.tipo_empresa} — {it.nombre_pais}</div>
                    <div className={styles.operadoraLine}>Empresa matriz: {it.empresa_matriz || it.matriz || 'no disponible'}</div>
                    <div className={styles.operadoraLine}>Usuarios: {Number(it.cantidad_usuarios) > 0 ? it.cantidad_usuarios : 'no disponible'}</div>
                  </div>
                )}
                renderEdit={(values, setValues, { onCancel, onSave, saving }) => (
                  <div>
                    <div className="row"><label>Nombre</label><input value={values.nombre_empresa} onChange={(e)=>setValues({...values, nombre_empresa: e.target.value})} /></div>
                    <div className="row"><label>Tipo</label>
                      <select value={values.tipo_empresa} onChange={(e)=>setValues({...values, tipo_empresa: e.target.value})}>
                        <option>Estatal</option>
                        <option>Privada</option>
                        <option>Mixta</option>
                      </select>
                    </div>
                    <div className="row"><label>URL</label><input value={values.url || ''} onChange={(e)=>setValues({...values, url: e.target.value})} /></div>
                    <div className="row"><label>Foto (link)</label><input value={values.foto || ''} onChange={(e)=>setValues({...values, foto: e.target.value})} /></div>
                    <div className="row"><label>Cantidad usuarios</label><input type="number" value={values.cantidad_usuarios || 0} onChange={(e)=>setValues({...values, cantidad_usuarios: Number(e.target.value)})} /></div>
                    <div className="row"><label>País</label>
                      <select value={values.id_pais || ''} onChange={(e)=>setValues({...values, id_pais: e.target.value ? Number(e.target.value) : null})}>
                        <option value="">(sin país)</option>
                        {paises.map(p => <option key={p.id_pais} value={p.id_pais}>{p.nombre_pais}</option>)}
                      </select>
                    </div>
                    <div className="row"><label>Empresa matriz (nombre)</label><input value={values.empresa_matriz_nombre ?? values.empresa_matriz ?? values.matriz ?? ''} onChange={(e)=>setValues({...values, empresa_matriz_nombre: e.target.value})} /></div>
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

function CreateOperadoraForm({ paises, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_empresa: '', tipo_empresa: 'Privada', url: '', foto: '', cantidad_usuarios: 0, id_pais: null, empresa_matriz_nombre: '' });
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_empresa} onChange={(e)=>setForm({...form, nombre_empresa: e.target.value})} required /></div>
      <div><label>Tipo</label><select value={form.tipo_empresa} onChange={(e)=>setForm({...form, tipo_empresa: e.target.value})}><option>Estatal</option><option>Privada</option><option>Mixta</option></select></div>
      <div><label>URL</label><input value={form.url} onChange={(e)=>setForm({...form, url: e.target.value})} /></div>
      <div><label>Foto (link)</label><input value={form.foto} onChange={(e)=>setForm({...form, foto: e.target.value})} /></div>
      <div><label>Cantidad usuarios</label><input type="number" value={form.cantidad_usuarios} onChange={(e)=>setForm({...form, cantidad_usuarios: Number(e.target.value)})} /></div>
      <div><label>País</label>
        <select value={form.id_pais || ''} onChange={(e)=>setForm({...form, id_pais: e.target.value ? Number(e.target.value) : null})}>
          <option value="">(sin país)</option>
          {paises.map(p => <option key={p.id_pais} value={p.id_pais}>{p.nombre_pais}</option>)}
        </select>
      </div>
      <div><label>Empresa matriz (nombre)</label><input value={form.empresa_matriz_nombre} onChange={(e)=>setForm({...form, empresa_matriz_nombre: e.target.value})} /></div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}

function CreateOperadoraInline({ paises, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_empresa: '', tipo_empresa: 'Privada', url: '', foto: '', cantidad_usuarios: 0, id_pais: null, empresa_matriz_nombre: '' });
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_empresa} onChange={(e)=>setForm({...form, nombre_empresa: e.target.value})} required /></div>
      <div><label>Tipo</label><select value={form.tipo_empresa} onChange={(e)=>setForm({...form, tipo_empresa: e.target.value})}><option>Estatal</option><option>Privada</option><option>Mixta</option></select></div>
      <div><label>URL</label><input value={form.url} onChange={(e)=>setForm({...form, url: e.target.value})} /></div>
      <div><label>País</label>
        <select value={form.id_pais || ''} onChange={(e)=>setForm({...form, id_pais: e.target.value ? Number(e.target.value) : null})}>
          <option value="">(sin país)</option>
          {paises.map(p => <option key={p.id_pais} value={p.id_pais}>{p.nombre_pais}</option>)}
        </select>
      </div>
      <div><label>Empresa matriz (nombre)</label><input value={form.empresa_matriz_nombre} onChange={(e)=>setForm({...form, empresa_matriz_nombre: e.target.value})} /></div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}
