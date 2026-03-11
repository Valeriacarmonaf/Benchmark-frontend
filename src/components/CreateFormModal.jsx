import React from 'react';
import styles from './CreateFormModal.module.css';

export default function CreateFormModal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h4>{title}</h4>
          <button onClick={onClose} className={styles.close}>✕</button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
