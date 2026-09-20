'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthApi, setAuthToken } from '@/lib/api';
import { AuthPayload, AuthUser, LoginPayload, PasswordChangePayload, RegisterPayload } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: LoginPayload, adminPortal?: boolean) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => Promise<AuthUser>;
  changePassword: (payload: PasswordChangePayload) => Promise<void>;
}

const TOKEN_KEY = 'sheojol_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    AuthApi.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
      setUser(null);
    };
    window.addEventListener('sheojol:unauthorized', onUnauthorized);
    return () => window.removeEventListener('sheojol:unauthorized', onUnauthorized);
  }, []);

  const persistSession = useCallback((payload: AuthPayload) => {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setAuthToken(payload.token);
    setUser(payload.user);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload, adminPortal = false) => {
      const resolved = adminPortal ? await AuthApi.loginAdmin(payload) : await AuthApi.login(payload);
      persistSession(resolved);
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const resolved = await AuthApi.register(payload);
      persistSession(resolved);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await AuthApi.logout();
    } catch {
      return;
    }
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (payload: Partial<Pick<AuthUser, 'name' | 'phone' | 'vehicle' | 'app'>>) => {
      const updated = await AuthApi.updateProfile(payload);
      setUser(updated);
      return updated;
    },
    [],
  );

  const changePassword = useCallback(async (payload: PasswordChangePayload) => {
    await AuthApi.changePassword(payload);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }),
    [user, loading, login, register, logout, updateProfile, changePassword],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return context;
}