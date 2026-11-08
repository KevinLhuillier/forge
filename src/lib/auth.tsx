import { isAuthRetryableFetchError, type Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { storedSession, supabase } from './supabase';

type AuthContextValue = {
  session: Session | null;
  /** False until the stored session has been restored. */
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue>({ session: null, ready: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data, error }) => {
      // Offline with an expired access token, supabase-js answers "no session" but keeps
      // it and refreshes it once the network is back (TOKEN_REFRESHED below): stay signed in.
      const offline = !data.session && isAuthRetryableFetchError(error);
      setSession(offline ? await storedSession() : data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      // The initial session comes from getSession above, which handles the offline case.
      if (event !== 'INITIAL_SESSION') setSession(next);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ session, ready }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
