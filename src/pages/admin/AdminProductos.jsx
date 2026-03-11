import { useEffect, useState } from 'react';
import styles from './AdminIndex.module.css';
import cardStyles from '../../components/AdminCard.module.css';
import AdminCard from '../../components/AdminCard';
import { fetchProductos, fetchCategorias, fetchOperadoras, createProducto, updateProducto, deleteProducto } from '../../lib/api';

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

export default function AdminProductos() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [operadoras, setOperadoras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [openCreate, setOpenCreate] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [cats, ops] = await Promise.all([fetchCategorias(), fetchOperadoras()]);

      const pageSize = 200;
      let offset = 0;
      let total = 0;
      const allItems = [];

      do {
        const page = await fetchProductos({ limit: pageSize, offset });
        const pageItems = page?.items || [];
        total = Number(page?.total || 0);
        allItems.push(...pageItems);
        offset += pageItems.length;

        if (pageItems.length === 0) break;
      } while (offset < total);

      setItems(allItems);
      setCategorias(cats || []);
      setOperadoras(ops || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUpdate(item, values) {
    const payload = {
      nombre_producto: values.nombre_producto,
      descripcion: values.descripcion,
      categorias: normalizeIdSelection(values.categorias, categorias, 'id_categoria', 'nombre_categoria'),
      operadoras: normalizeIdSelection(values.operadoras, operadoras, 'id_empresa', 'nombre_empresa'),
    };
    await updateProducto(item.id_producto, payload);
    await load();
  }

  async function handleDelete(item) {
    try { await deleteProducto(item.id_producto); await load(); } catch (e) { console.error(e); alert('Error eliminando'); }
  }

  async function handleCreate(payload) {
    await createProducto(payload);
    await load();
    setOpenCreate(false);
  }

  const filtered = items.filter(i => i.nombre_producto.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <h3>Productos</h3>
      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Buscar..." value={query} onChange={(e)=>setQuery(e.target.value)} />
      </div>

      {loading ? <div>Cargando...</div> : (
        <div className={styles.gridWrapper}>
          <div className={styles.grid}>
            <div className={styles.plusCard} onClick={()=>setOpenCreate(true)}>+</div>
            {openCreate && (
              <div className={cardStyles.card}>
                <h4 style={{marginTop:0}}>Crear producto</h4>
                <CreateProductoInline categorias={categorias} operadoras={operadoras} onCreate={handleCreate} onCancel={()=>setOpenCreate(false)} />
              </div>
            )}
            {filtered.map(i => (
              <AdminCard
                key={i.id_producto}
                item={i}
                fixedSize
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                renderView={(it)=> (
                  <div className={styles.productoView}>
                    <strong className={styles.productoTitle}>{it.nombre_producto}</strong>
                    <div className={styles.productoLine}>{it.descripcion || 'Sin descripción'}</div>
                    <div className={styles.productoLine}>Categorías: {it.categorias?.join(', ') || '-'}</div>
                    <div className={styles.productoLine}>Operadoras: {it.operadoras?.join(', ') || '-'}</div>
                  </div>
                )}
                renderEdit={(values, setValues, { onCancel, onSave, saving }) => (
                  <div>
                    <div className="row"><label>Nombre</label><input value={values.nombre_producto || ''} onChange={(e)=>setValues({...values, nombre_producto: e.target.value})} /></div>
                    <div className="row"><label>Descripción</label><textarea value={values.descripcion || ''} onChange={(e)=>setValues({...values, descripcion: e.target.value})} /></div>
                    <div className="row"><label>Categorías</label>
                      <div className={styles.multiSelectList} style={{ maxHeight: 120, overflow: 'auto' }}>
                        {categorias.map(c => (
                          <div key={c.id_categoria}><label className={styles.multiSelectOption}><input type="checkbox" checked={normalizeIdSelection(values.categorias, categorias, 'id_categoria', 'nombre_categoria').includes(c.id_categoria)} onChange={()=>{
                            const set = new Set(normalizeIdSelection(values.categorias, categorias, 'id_categoria', 'nombre_categoria'));
                            if (set.has(c.id_categoria)) set.delete(c.id_categoria); else set.add(c.id_categoria);
                            setValues({...values, categorias: Array.from(set)});
                          }} /> {c.nombre_categoria}</label></div>
                        ))}
                      </div>
                    </div>
                    <div className="row"><label>Operadoras</label>
                      <div className={styles.multiSelectList} style={{ maxHeight: 120, overflow: 'auto' }}>
                        {operadoras.map(o => (
                          <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={normalizeIdSelection(values.operadoras, operadoras, 'id_empresa', 'nombre_empresa').includes(o.id_empresa)} onChange={()=>{
                            const set = new Set(normalizeIdSelection(values.operadoras, operadoras, 'id_empresa', 'nombre_empresa'));
                            if (set.has(o.id_empresa)) set.delete(o.id_empresa); else set.add(o.id_empresa);
                            setValues({...values, operadoras: Array.from(set)});
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

      {/* inline create shown next to + */}
    </div>
  );
}

function CreateProductoForm({ categorias, operadoras, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_producto: '', descripcion: '', categorias: [], operadoras: [] });
  function toggle(field, id) {
    const set = new Set(form[field] || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, [field]: Array.from(set) });
  }
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_producto} onChange={(e)=>setForm({...form, nombre_producto: e.target.value})} required /></div>
      <div><label>Descripción</label><textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} /></div>
      <div><label>Categorías</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {categorias.map(c => <div key={c.id_categoria}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.categorias.includes(c.id_categoria)} onChange={()=>toggle('categorias', c.id_categoria)} /> {c.nombre_categoria}</label></div>)}
        </div>
      </div>
      <div><label>Operadoras</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {operadoras.map(o => <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.operadoras.includes(o.id_empresa)} onChange={()=>toggle('operadoras', o.id_empresa)} /> {o.nombre_empresa}</label></div>)}
        </div>
      </div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}

function CreateProductoInline({ categorias, operadoras, onCreate, onCancel }) {
  const [form, setForm] = useState({ nombre_producto: '', descripcion: '', categorias: [], operadoras: [] });
  function toggle(field, id) {
    const set = new Set(form[field] || []);
    if (set.has(id)) set.delete(id); else set.add(id);
    setForm({ ...form, [field]: Array.from(set) });
  }
  async function submit(e) {
    e.preventDefault();
    await onCreate(form);
  }
  return (
    <form onSubmit={submit}>
      <div><label>Nombre</label><input value={form.nombre_producto} onChange={(e)=>setForm({...form, nombre_producto: e.target.value})} required /></div>
      <div><label>Descripción</label><textarea value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} /></div>
      <div><label>Categorías</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {categorias.map(c => <div key={c.id_categoria}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.categorias.includes(c.id_categoria)} onChange={()=>toggle('categorias', c.id_categoria)} /> {c.nombre_categoria}</label></div>)}
        </div>
      </div>
      <div><label>Operadoras</label>
        <div className={styles.multiSelectList} style={{ maxHeight: 160, overflow: 'auto' }}>
          {operadoras.map(o => <div key={o.id_empresa}><label className={styles.multiSelectOption}><input type="checkbox" checked={form.operadoras.includes(o.id_empresa)} onChange={()=>toggle('operadoras', o.id_empresa)} /> {o.nombre_empresa}</label></div>)}
        </div>
      </div>
      <div style={{ marginTop: 8 }}><button type="submit">Crear</button> <button type="button" onClick={onCancel}>Cancelar</button></div>
    </form>
  );
}
