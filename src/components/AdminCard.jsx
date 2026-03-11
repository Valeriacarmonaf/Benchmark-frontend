import React, { useState } from 'react';
import styles from './AdminCard.module.css';
import ConfirmDialog from './ConfirmDialog';
import editIcon from '../assets/icons/edit_icon.png';
import deleteIcon from '../assets/icons/delete_icon.png';

export default function AdminCard({ item, renderView, renderEdit, onUpdate, onDelete, fixedSize = false }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState(() => ({ ...item }));
  const [confirmOpen, setConfirmOpen] = useState(false);

  function startEditing() {
    setValues({ ...item });
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(item, values);
      setEditing(false);
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
    setSaving(false);
  }

  function handleDelete() {
    setConfirmOpen(true);
  }

  function doDelete() {
    setConfirmOpen(false);
    onDelete(item);
  }

  // renderEdit is a function that receives (values, setValues, controls)
  return (
    <div className={`${styles.card} ${fixedSize && !editing ? styles.fixedCard : ''}`}>
      <div className={styles.topRight}>
        <button className={styles.iconBtn} title="Editar" onClick={() => (editing ? setEditing(false) : startEditing())}>
          <img src={editIcon} alt="Editar" style={{width:20,height:20, display:'block'}} />
        </button>
        <button className={styles.iconBtn} title="Eliminar" onClick={handleDelete}>
          <img src={deleteIcon} alt="Eliminar" style={{width:20,height:20, display:'block'}} />
        </button>
      </div>

      <div className={styles.body}>
        {!editing && renderView(item)}
        {editing && (
          <div className={styles.editArea}>
            {renderEdit(values, setValues, { onCancel: () => setEditing(false), onSave: handleSave, saving })}
          </div>
        )}
      </div>

      <ConfirmDialog open={confirmOpen} title="Eliminar elemento" message={`¿Deseas eliminar "${item.nombre_proveedor || item.nombre_empresa || item.nombre_pais || item.nombre_producto || 'este elemento'}"?`} onCancel={()=>setConfirmOpen(false)} onConfirm={doDelete} />
    </div>
  );
}
