import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail, getSiteUrl } from './_authUtils';

export default function Register({ onGoLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setMsg('');

    const em = normalizeEmail(email);
    if (!isAllowedDomain(em)) {
      setError('Solo se permiten correos @androvent.com o @conectium.com.');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: em,
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/`,
      },
    });

    if (signUpError) {
      setError('No se pudo crear la cuenta. Verifica el correo o intenta con otra contraseña.');
    } else {
      setMsg('Cuenta creada. Revisa tu correo si Supabase requiere verificación.');
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Crear cuenta</h2>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {msg && <p style={{ color: 'green' }}>{msg}</p>}

      <div style={{ margin: '16px 0', textAlign: 'center', opacity: 0.7 }}>o</div>

      <form onSubmit={handleRegister}>
        <label>Correo corporativo</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@androvent.com"
          autoComplete="email"
          required
        />

        <label>Contraseña</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Creando…' : 'Crear cuenta'}
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
