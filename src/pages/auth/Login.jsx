import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail } from './_authUtils';
import './Auth.css';

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
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: em,
      password,
    });

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
    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/conectium_logo.png" alt="conectium" className="auth-logo-img" />
        </div>

        <div className="auth-title">Iniciar sesión</div>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <label className="auth-label">Correo</label>
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
            autoComplete="current-password"
            required
          />

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Entrando…' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-links">
          <button className="auth-link" onClick={onGoForgot} type="button">¿Olvidaste tu contraseña?</button>
          <button className="auth-link" onClick={onGoRegister} type="button">Crear cuenta</button>
        </div>
      </div>
    </div>
  );
}
