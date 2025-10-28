import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { supabase } from '../services/supabase';
import type { User, Theme } from '../types';
import type { AuthError } from '@supabase/supabase-js';

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppProvider');
  }
  return context;
};

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    fullName: string,
    email: string,
    password: string,
    mobile: string,
    address: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<string | null>;
  loading: boolean;
  initialLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};

// --- App Provider ---
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setInitialLoading(true);
    const getSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        } catch (e) {
            console.error("Error getting session:", e);
        } finally {
            setInitialLoading(false);
        }
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthAction = async (
    action: () => Promise<{ error: AuthError | null }>,
  ): Promise<string | null> => {
    setLoading(true);
    const { error } = await action();
    setLoading(false);
    if (error) {
      console.error('Auth Error:', error.message);
      return error.message;
    }
    return null;
  };

  const login = useCallback(
    (email: string, password: string) =>
      handleAuthAction(() =>
        supabase.auth.signInWithPassword({ email, password }),
      ),
    [],
  );

  const register = useCallback(
    (
      fullName: string,
      email: string,
      password: string,
      mobile: string,
      address: string,
    ) =>
      handleAuthAction(() =>
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullName,
              mobile,
              address,
            },
          },
        }),
      ),
    [],
  );

  const loginWithGoogle = useCallback(
    () =>
      handleAuthAction(() =>
        supabase.auth.signInWithOAuth({
          provider: 'google',
        }),
      ),
    [],
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const authValue = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      loginWithGoogle,
      loading,
      initialLoading,
    }),
    [user, loading, initialLoading, login, register, logout, loginWithGoogle],
  );

  return (
    <AuthContext.Provider value={authValue}>
      <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
    </AuthContext.Provider>
  );
};
