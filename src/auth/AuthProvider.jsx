import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './authContext';

function withTimeout(promise, ms = 6000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout perfil')), ms)),
  ]);
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfileSafe(userId) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('user_profiles')
          .select('email, role, is_active, full_name, avatar_url')
          .eq('id', userId)
          .single(),
        6000
      );

      if (error) {
        console.error('Error cargando perfil:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.error('Perfil no disponible (timeout o error):', e);
      return null;
    }
  }

  // Aplica sesión rápido (sin bloquear UI por perfil)
  async function applySessionFast(newSession) {
    setSession(newSession);
    setUser(newSession?.user ?? null);

    // No bloquea el render
    setLoading(false);

    // Perfil se carga en background
    const uid = newSession?.user?.id;
    if (uid) {
      const p = await loadProfileSafe(uid);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('AuthProvider: getSession ->', { data, error });
        if (error) console.error('getSession error:', error);
        if (!mounted) return;
        await applySessionFast(data?.session ?? null);
      } catch (e) {
        console.error('Bootstrap auth error:', e);
        // Pase lo que pase, no bloquees la app
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('AuthProvider: onAuthStateChange', { event, newSession });
      if (!mounted) return;
      await applySessionFast(newSession);
    });

    return () => {
      mounted = false;
      try {
        sub?.subscription?.unsubscribe?.();
        console.log('AuthProvider: unsubscribed onAuthStateChange');
      } catch (e) {
        console.warn('AuthProvider: error during unsubscribe', e);
      }
    };
  }, []);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' && profile?.is_active === true,
    isActive: profile?.is_active === true,
    email: profile?.email ?? user?.email ?? null,
    signOut: () => supabase.auth.signOut(),
  }), [session, user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
