// AuthProvider.tsx
//
// AuthProvider
//  → defines value = { user, session, initialized, signOut }
//  → wraps your app with <AuthContext.Provider value={value}>

// AuthContext
//  → is the storage for that value

// useAuth()
//  → is a helper to read that value from AuthContext
//  → returns { user, session, initialized, signOut }
//

import React, { useState, useEffect, createContext, PropsWithChildren } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '../supabase/supabaseClient';

type AuthProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  signOut?: () => void;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

// Custom hook to read the context values
export function useAuth() {
  return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Log out the user
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const value = {
    user,
    session,
    initialized,
    signOut,
  };

  // Wrap the children with the AuthContext.Provider
  // now when we call useAuth() in any child component, it will return { user, session, initialized, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
