import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail, getSiteUrl } from './_authUtils';
import './Auth.css';

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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/conectium_logo.png" alt="conectium" className="auth-logo-img" />
        </div>

        <div className="auth-title">Crear cuenta</div>

        {error && <p className="auth-error">{error}</p>}
        {msg && <p className="auth-success">{msg}</p>}

     

        <form onSubmit={handleRegister}>
          <label className="auth-label">Correo corporativo</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@androvent.com"
            autoComplete="email"
            required
          />

          <label className="auth-label">Contraseña</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-small-center">
          <button className="auth-link" onClick={onGoLogin} type="button">Volver a iniciar sesión</button>
        </div>
      </div>
    </div>
  );
}
