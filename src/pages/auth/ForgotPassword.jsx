import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { isAllowedDomain, normalizeEmail, getSiteUrl } from './_authUtils';
import './Auth.css';

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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="/conectium_logo.png" alt="conectium" className="auth-logo-img" />
        </div>

        <div className="auth-title">Recuperar contraseña</div>

        {error && <p className="auth-error">{error}</p>}
        {msg && <p className="auth-success">{msg}</p>}

        <form onSubmit={handleSend}>
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

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar link de recuperación'}
          </button>
        </form>

        <div className="auth-small-center">
          <button className="auth-link" onClick={onGoLogin} type="button">Volver a iniciar sesión</button>
        </div>
      </div>
    </div>
  );
}
