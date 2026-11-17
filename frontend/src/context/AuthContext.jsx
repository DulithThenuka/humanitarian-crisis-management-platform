
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser || storedToken === 'reliefcore-session-token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    return storedToken;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken || storedToken === 'reliefcore-session-token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading] = useState(false);

  const login = (data) => {
    if (!data || !data.token) return;
    setUser(data);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = Boolean(user && token && token !== 'reliefcore-session-token');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
