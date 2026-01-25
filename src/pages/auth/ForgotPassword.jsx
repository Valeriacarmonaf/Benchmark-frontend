import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail, getSiteUrl } from './_authUtils';

export default function ForgotPassword({ onGoLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function handleSend(e) {
    e.preventDefault();
    setError('');
    setMsg('');

    const em = normalizeEmail(email);
    if (!isAllowedDomain(em)) {
      setError('Solo se permiten correos @androvent.com o @conectium.com.');
      return;
    }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(em, {
      redirectTo: `${getSiteUrl()}/`,
    });

    if (resetError) setError('No se pudo enviar el correo de recuperación.');
    else setMsg('Listo. Revisa tu correo para restablecer la contraseña.');

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Recuperar contraseña</h2>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      <form onSubmit={handleSend}>
        <label>Correo</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@androvent.com"
          autoComplete="email"
          required
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Enviando…' : 'Enviar link de recuperación'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={onGoLogin} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}
