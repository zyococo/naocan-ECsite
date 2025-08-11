import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Tables = Database["public"]["Tables"];
type Profile = Tables["profiles"]["Row"];

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await loadUserProfile(session.user.id);
          }
        }
      } catch (error) {
        console.warn('Session check failed:', error);
      }
    };

    checkSession();

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            await loadUserProfile(session.user.id);
          } else {
            // Create profile for new users (especially OAuth users)
            const userData = {
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
            };
            
            const success = await createUserProfile(session.user.id, userData);
            if (success) {
              await loadUserProfile(session.user.id);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'LOGOUT' });
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error);
        return;
      }

      if (profile) {
        const user: User = {
          id: profile.id,
          name: profile.name,
          email: '', // Email is not stored in profiles table
          phone: profile.phone || '',
          address: profile.address || '',
          avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=6B46C1&color=fff`
        };

        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      console.warn('Load profile error:', error);
    }
  };

  const createUserProfile = async (userId: string, userData: { name: string; email: string; avatar?: string }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: userData.name,
          phone: null,
          address: null,
          avatar_url: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6B46C1&color=fff`
        });

      if (error) {
        console.error('Profile creation error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Profile creation error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user.id);
        return true;
      }

      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }

      // OAuth認証はリダイレクトが発生するため、ここでは成功として扱う
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Create user account
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) {
        console.error('Registration error:', error);
        dispatch({ type: 'LOGIN_FAILURE' });
        return false;
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: userData.name,
            phone: userData.phone || null,
            address: null,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6B46C1&color=fff`
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Delete the user account if profile creation fails
          await supabase.auth.admin.deleteUser(data.user.id);
          dispatch({ type: 'LOGIN_FAILURE' });
          return false;
        }

        await loadUserProfile(data.user.id);
        return true;
      }

      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.warn('Logout error:', error);
    }
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!state.user || !supabase) {
        return false;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone || null,
          address: userData.address || null,
          avatar_url: userData.avatar || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.user.id);

      if (error) {
        console.error('Profile update error:', error);
        return false;
      }

      dispatch({ type: 'UPDATE_PROFILE', payload: userData });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, loginWithGoogle, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};