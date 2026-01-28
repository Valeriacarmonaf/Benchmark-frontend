import { useEffect, useState } from 'react';
import { fetchProductos, fetchCategorias, fetchOperadoras, createProducto, updateProducto, deleteProducto } from '../../lib/api';

export default function AdminProductos() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [operadoras, setOperadoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nombre_producto: '', descripcion: '', categorias: [], operadoras: [] });
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [prodRes, cats, ops] = await Promise.all([fetchProductos(), fetchCategorias(), fetchOperadoras()]);
      setItems(prodRes.items || []);
      setCategorias(cats);
      setOperadoras(ops);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function startEdit(p) {
    setEditingId(p.id_producto);
    setForm({ nombre_producto: p.nombre_producto, descripcion: p.descripcion || '', categorias: [], operadoras: [] });
  }

  function reset() { setEditingId(null); setForm({ nombre_producto: '', descripcion: '', categorias: [], operadoras: [] }); }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) await updateProducto(editingId, form);
      else await createProducto(form);
      await load(); reset();
    } catch (err) { console.error(err); alert('Error guardando producto'); }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar producto?')) return;
    try { await deleteProducto(id); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  function toggleArrayField(field, id) {
    const set = new Set(form[field] || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, [field]: Array.from(set) });
  }

  return (
    <div>
      <h3>Productos</h3>
      {loading ? <div>Cargando...</div> : (
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <ul>
              {items.map(i => (
                <li key={i.id_producto}>{i.nombre_producto} — {i.categorias?.join(', ')} <button onClick={()=>startEdit(i)}>Editar</button> <button onClick={()=>handleDelete(i.id_producto)}>Eliminar</button></li>
              ))}
            </ul>
          </div>

          <div style={{ width: 520 }}>
            <form onSubmit={handleSubmit}>
              <div><label>Nombre</label><input value={form.nombre_producto} onChange={(e)=>setForm({...form, nombre_producto: e.target.value})} required /></div>
              <div><label>Descripción</label><textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} /></div>
              <div>
                <label>Categorías</label>
                <div style={{ maxHeight: 120, overflow: 'auto', border: '1px solid #eee', padding: 6 }}>
                  {categorias.map(c => <div key={c.id_categoria}><label><input type="checkbox" checked={(form.categorias||[]).includes(c.id_categoria)} onChange={()=>toggleArrayField('categorias', c.id_categoria)} /> {c.nombre_categoria}</label></div>)}
                </div>
              </div>
              <div>
                <label>Operadoras</label>
                <div style={{ maxHeight: 120, overflow: 'auto', border: '1px solid #eee', padding: 6 }}>
                  {operadoras.map(o => <div key={o.id_empresa}><label><input type="checkbox" checked={(form.operadoras||[]).includes(o.id_empresa)} onChange={()=>toggleArrayField('operadoras', o.id_empresa)} /> {o.nombre_empresa}</label></div>)}
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
