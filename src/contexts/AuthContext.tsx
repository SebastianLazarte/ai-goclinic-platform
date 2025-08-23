import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AuthState } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const convertUser = (user: SupabaseUser): User => ({
      id: user.id,
      email: user.email ?? '',
      name: (user.user_metadata?.name as string) || '',
      createdAt: user.created_at
    });

    const initialize = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (sessionUser) {
        setAuthState({
          user: convertUser(sessionUser),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      if (authUser) {
        setAuthState({
          user: convertUser(authUser),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      throw error || new Error('Invalid credentials');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email ?? '',
      name: (data.user.user_metadata?.name as string) || '',
      createdAt: data.user.created_at
    };

    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error || !data.user) {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      throw error || new Error('Failed to create account');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email ?? '',
      name: (data.user.user_metadata?.name as string) || '',
      createdAt: data.user.created_at
    };

    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};