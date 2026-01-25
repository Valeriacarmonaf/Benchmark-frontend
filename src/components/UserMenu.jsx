import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth_new';

export default function UserMenu({ open, onClose }) {
  const { email, signOut } = useAuth();
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        onClose?.();
      }
    }

    function handleEsc(e) {
      if (e.key === 'Escape') onClose?.();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={boxRef}
      style={{
        position: 'absolute',
        top: '58px',
        right: 0,
        background: '#fff',
        borderRadius: 18,
        padding: 14,
        boxShadow: '0 10px 24px rgba(0,0,0,.12)',
        minWidth: 260,
        zIndex: 9999,
      }}
    >
      <div style={{ fontSize: 14, marginBottom: 10, color: '#111' }}>
        {email || '—'}
      </div>

      <button
        type="button"
        onClick={async () => {
          await signOut();
          onClose?.();
        }}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ↪ Salir
      </button>
    </div>
  );
}
