import { useEffect, useState } from 'react';
import { fetchOperadoras, fetchPaises, createOperadora, updateOperadora, deleteOperadora } from '../../lib/api';

export default function AdminOperadoras() {
  const [items, setItems] = useState([]);
  const [paises, setPaises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre_empresa: '', tipo_empresa: 'Privada', url: '', foto: '', cantidad_usuarios: 0, fk_e: null, id_pais: null, empresa_matriz_nombre: '' });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [ops, ps] = await Promise.all([fetchOperadoras(), fetchPaises()]);
      setItems(ops);
      setPaises(ps);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(o) {
    setEditingId(o.id_empresa);
    setForm({
      nombre_empresa: o.nombre_empresa || '', tipo_empresa: o.tipo_empresa || 'Privada', url: o.url || '', foto: o.foto || '', cantidad_usuarios: o.cantidad_usuarios || 0, fk_e: o.fk_e || null, id_pais: o.id_pais || null,
      empresa_matriz_nombre: o.matriz || ''
    });
  }

  function reset() { setEditingId(null); setForm({ nombre_empresa: '', tipo_empresa: 'Privada', url: '', foto: '', cantidad_usuarios: 0, fk_e: null, id_pais: null, empresa_matriz_nombre: '' }); }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Si el usuario escribió un nombre de empresa matriz, crearla primero (como empresa con fk_e = null)
      let fk_e_to_use = form.fk_e ?? null;
      if (form.empresa_matriz_nombre && form.empresa_matriz_nombre.trim() !== '') {
        // crear empresa matriz mínima
        const parentPayload = { nombre_empresa: form.empresa_matriz_nombre.trim(), tipo_empresa: null, url: null, foto: null, cantidad_usuarios: 0, fk_e: null, id_pais: null };
        const parent = await createOperadora(parentPayload);
        fk_e_to_use = parent.id_empresa;
      }

      const payload = {
        nombre_empresa: form.nombre_empresa,
        tipo_empresa: form.tipo_empresa,
        url: form.url,
        foto: form.foto,
        cantidad_usuarios: Number(form.cantidad_usuarios) || 0,
        fk_e: fk_e_to_use,
        id_pais: form.id_pais ? Number(form.id_pais) : null,
      };

      if (editingId) await updateOperadora(editingId, payload);
      else await createOperadora(payload);
      await load(); reset();
    } catch (err) { console.error(err); alert('Error guardando operadora'); }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar operadora?')) return;
    try { await deleteOperadora(id); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  return (
    <div>
      <h3>Operadoras</h3>
      {loading ? <div>Cargando...</div> : (
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <ul>
              {items.map(i => (
                <li key={i.id_empresa}>
                  {i.nombre_empresa} — {i.nombre_pais} {' '}
                  <button onClick={() => startEdit(i)}>Editar</button>{' '}
                  <button onClick={() => handleDelete(i.id_empresa)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ width: 420 }}>
            <form onSubmit={handleSubmit}>
              <div><label>Nombre</label><input value={form.nombre_empresa} onChange={(e)=>setForm({...form, nombre_empresa: e.target.value})} required /></div>
              <div>
                <label>Tipo</label>
                <select value={form.tipo_empresa} onChange={(e)=>setForm({...form, tipo_empresa: e.target.value})}>
                  <option>Estatal</option>
                  <option>Privada</option>
                  <option>Mixta</option>
                </select>
              </div>
              <div><label>URL</label><input value={form.url} onChange={(e)=>setForm({...form, url: e.target.value})} /></div>
              <div><label>Foto (link)</label><input value={form.foto} onChange={(e)=>setForm({...form, foto: e.target.value})} /></div>
              <div><label>Cantidad usuarios</label><input type="number" value={form.cantidad_usuarios} onChange={(e)=>setForm({...form, cantidad_usuarios: Number(e.target.value)})} /></div>
              <div>
                <label>País</label>
                <select value={form.id_pais || ''} onChange={(e)=>setForm({...form, id_pais: e.target.value ? Number(e.target.value) : null})}>
                  <option value="">(sin país)</option>
                  {paises.map(p => <option key={p.id_pais} value={p.id_pais}>{p.nombre_pais}</option>)}
                </select>
              </div>
              <div>
                <label>Empresa matriz (nombre)</label>
                <input value={form.empresa_matriz_nombre} onChange={(e)=>setForm({...form, empresa_matriz_nombre: e.target.value})} placeholder="Escribe nombre empresa matriz (opcional)" />
                <small style={{ color: '#666' }}>Si rellenas este campo se creará la empresa matriz y la operadora referenciará a ella.</small>
              </div>
              <div style={{ marginTop: 8 }}><button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>{editingId && <button type="button" onClick={reset}>Cancelar</button>}</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
