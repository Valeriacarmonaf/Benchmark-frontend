import React from 'react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ open, title = 'Confirmar', message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e)=>e.stopPropagation()}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>Cancelar</button>
          <button className={styles.confirm} onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
