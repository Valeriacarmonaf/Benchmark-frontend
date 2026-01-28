import { useEffect, useState } from 'react';
import { fetchProveedores, fetchOperadoras, createProveedor, updateProveedor, deleteProveedor } from '../../lib/api';

export default function AdminProveedores() {
  const [items, setItems] = useState([]);
  const [operadoras, setOperadoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre_proveedor: '', descripcion_proveedor: '', clientes: [] });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [ps, ops] = await Promise.all([fetchProveedores(), fetchOperadoras()]);
      setItems(ps);
      setOperadoras(ops);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(p) {
    // proveedores api devuelve clientes como string list (nombres), UI will ask ids manually
    setEditingId(p.id_proveedor);
    setForm({ nombre_proveedor: p.nombre_proveedor, descripcion_proveedor: p.descripcion_proveedor || '', clientes: [] });
  }

  function reset() { setEditingId(null); setForm({ nombre_proveedor: '', descripcion_proveedor: '', clientes: [] }); }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) await updateProveedor(editingId, form);
      else await createProveedor(form);
      await load(); reset();
    } catch (err) { console.error(err); alert('Error guardando proveedor'); }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar proveedor?')) return;
    try { await deleteProveedor(id); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  function toggleCliente(id) {
    const set = new Set(form.clientes || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, clientes: Array.from(set) });
  }

  return (
    <div>
      <h3>Proveedores</h3>
      {loading ? <div>Cargando...</div> : (
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <ul>
              {items.map(i => (
                <li key={i.id_proveedor}>{i.nombre_proveedor} — {i.clientes} <button onClick={()=>startEdit(i)}>Editar</button> <button onClick={()=>handleDelete(i.id_proveedor)}>Eliminar</button></li>
              ))}
            </ul>
          </div>

          <div style={{ width: 420 }}>
            <form onSubmit={handleSubmit}>
              <div><label>Nombre</label><input value={form.nombre_proveedor} onChange={(e)=>setForm({...form, nombre_proveedor: e.target.value})} required /></div>
              <div><label>Descripción</label><textarea value={form.descripcion_proveedor} onChange={(e)=>setForm({...form, descripcion_proveedor: e.target.value})} /></div>
              <div>
                <label>Clientes (seleccionar)</label>
                <div style={{ maxHeight: 120, overflow: 'auto', border: '1px solid #eee', padding: 6 }}>
                  {operadoras.map(o => (
                    <div key={o.id_empresa}><label><input type="checkbox" checked={(form.clientes||[]).includes(o.id_empresa)} onChange={()=>toggleCliente(o.id_empresa)} /> {o.nombre_empresa}</label></div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8 }}><button type="submit">{editingId ? 'Actualizar' : 'Crear'}</button>{editingId && <button type="button" onClick={reset}>Cancelar</button>}</div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
