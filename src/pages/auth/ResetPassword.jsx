import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPassword({ onGoLogin }) {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // Asegura que haya sesión temporal tras el redirect
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        setError('El enlace no es válido o expiró. Solicita uno nuevo.');
      }
    })();
  }, []);

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setMsg('');

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error: updError } = await supabase.auth.updateUser({ password });

    if (updError) {
      setError('No se pudo actualizar la contraseña. Solicita un nuevo enlace.');
    } else {
      setMsg('Contraseña actualizada. Ya puedes iniciar sesión.');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Restablecer contraseña</h2>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      <form onSubmit={handleUpdate}>
        <label>Nueva contraseña</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <label>Confirmar contraseña</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Guardando…' : 'Guardar nueva contraseña'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={onGoLogin} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          Volver al login
        </button>
      </div>
    </div>
  );
}
