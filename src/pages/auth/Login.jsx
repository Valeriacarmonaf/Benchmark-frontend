import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail } from './_authUtils';

export default function Login({ onGoRegister, onGoForgot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    const em = normalizeEmail(email);
    if (!isAllowedDomain(em)) {
      setError('Solo se permiten correos @androvent.com o @conectium.com.');
      return;
    }

    setLoading(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: em,
      password,
    });

    console.log('Login.signInWithPassword ->', { data, signInError });

    if (signInError) {
      const msg = (signInError.message || '').toLowerCase();
      if (msg.includes('email not confirmed')) {
        setError('Tu correo aún no está verificado. Revisa tu email y confirma la cuenta.');
      } else {
        setError('Correo o contraseña inválidos.');
      }
      setLoading(false);
      return;
    }

    // Si recibimos sesión, forzamos recarga para que AuthProvider la detecte correctamente
    if (data?.session) {
      console.log('Login: sesión creada, recargando para aplicar sesión');
      // redirige a la raíz; reload garantiza que AuthProvider haga el bootstrap
      window.location.href = '/';
      return; // no continuar
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}>
      <h2>Iniciar sesión</h2>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <form onSubmit={handleLogin}>
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

        <label>Contraseña</label>
        <input
          style={{ width: '100%', padding: 10, margin: '6px 0 12px' }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onGoForgot} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          ¿Olvidaste tu contraseña?
        </button>
        <button onClick={onGoRegister} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
