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
  // authLoading: only for initial auth/session bootstrap (fast)
  const [authLoading, setAuthLoading] = useState(true);
  // profileLoading: true while fetching profile in background
  const [profileLoading, setProfileLoading] = useState(false);

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

  // Apply auth session quickly (do not wait for profile)
  async function applyAuthSession(newSession) {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    // auth bootstrap finished
    setAuthLoading(false);

    // start loading profile in background
    const uid = newSession?.user?.id;
    if (uid) {
      setProfileLoading(true);
      const p = await loadProfileSafe(uid);
      setProfile(p);
      setProfileLoading(false);
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('getSession error:', error);
        if (!mounted) return;
        await applyAuthSession(data?.session ?? null);
      } catch (e) {
        console.error('Bootstrap auth error:', e);
        // ensure authLoading is cleared so app can render
        if (mounted) setAuthLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      // update auth session and reload profile in background
      await applyAuthSession(newSession);
    });

    return () => {
      mounted = false;
      try {
        sub?.subscription?.unsubscribe?.();
      } catch (e) {
        console.warn('AuthProvider: error during unsubscribe', e);
      }
    };
  }, []);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    // expose auth loading as `loading` for backwards compatibility
    loading: authLoading,
    profileLoading,
    isAdmin: profile?.role === 'admin' && profile?.is_active === true,
    isActive: profile?.is_active === true,
    email: profile?.email ?? user?.email ?? null,
    signOut: () => supabase.auth.signOut(),
  }), [session, user, profile, authLoading, profileLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
