import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const defaultCoordinator = {
  id: 'usr-001',
  fullName: 'Amara Chen',
  role: 'Coordinator',
  email: 'amara.chen@reliefcore.org',
  token: 'reliefcore-session-token'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultCoordinator;
      }
    }
    return defaultCoordinator;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'reliefcore-session-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(defaultCoordinator));
      localStorage.setItem('token', 'reliefcore-session-token');
    }
  }, []);

  const login = (data) => {
    setToken(data.token);
    setUser(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
