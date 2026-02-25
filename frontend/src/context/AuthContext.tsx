import { createContext, useContext, useEffect, useState } from 'react';
import { setApiToken } from '../api/client';

type AuthContextValue = {
  token: string;
  isAuthenticated: boolean;
  setToken: (value: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, updateToken] = useState<string>(() => localStorage.getItem('memorise_token') ?? '');

  const setToken = (value: string) => {
    updateToken(value);
    localStorage.setItem('memorise_token', value);
    setApiToken(value);
  };

  const logout = () => {
    updateToken('');
    localStorage.removeItem('memorise_token');
    setApiToken('');
  };

  useEffect(() => {
    setApiToken(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
