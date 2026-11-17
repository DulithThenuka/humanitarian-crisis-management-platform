import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getStoredAuthToken, isValidJwtToken, clearStoredAuth } from '../services/apiClient';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

const normalizeUserObject = (payload, token) => {
  if (!payload) return null;
  const fullName = payload.fullName || payload.name || '';
  const initials = fullName
    ? fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : 'CM';

  return {
    userId: payload.userId || payload.id,
    id: payload.userId || payload.id,
    fullName,
    name: fullName,
    initials,
    email: payload.email || '',
    role: payload.role || 'CaseManager',
    expiresAt: payload.expiresAt || null,
    token
  };
};

const readStoredUser = (validToken) => {
  if (!validToken) return null;
  const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return normalizeUserObject(parsed, validToken);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredAuthToken());
  const [user, setUser] = useState(() => {
    const initialToken = getStoredAuthToken();
    return readStoredUser(initialToken);
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleAuthCleared = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('humanaid:auth-cleared', handleAuthCleared);
    return () => {
      window.removeEventListener('humanaid:auth-cleared', handleAuthCleared);
    };
  }, []);

  const login = useCallback((authResponse, rememberMe = true) => {
    const payload = authResponse?.data || authResponse;
    const rawToken = (payload?.token || '').replace(/^Bearer\s+/i, '').trim();

    if (!isValidJwtToken(rawToken)) {
      clearStoredAuth();
      setToken(null);
      setUser(null);
      return false;
    }

    const normalizedUser = normalizeUserObject(payload, rawToken);
    setToken(rawToken);
    setUser(normalizedUser);

    localStorage.setItem('token', rawToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    if (rememberMe) {
      sessionStorage.setItem('token', rawToken);
      sessionStorage.setItem('user', JSON.stringify(normalizedUser));
    }

    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local session cleanup even if backend is offline
    }
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token && isValidJwtToken(token));

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
