import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

/**
 * Validates that a token string is a well-formed, non-expired JWT (3 dot-separated base64url parts)
 * and never a placeholder token.
 */
export const isValidJwtToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return false;
  const trimmed = rawToken.replace(/^Bearer\s+/i, '').trim();
  if (!trimmed || trimmed === 'reliefcore-session-token') return false;

  const segments = trimmed.split('.');
  if (segments.length !== 3 || segments.some((s) => !s)) return false;

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));
    if (payload && typeof payload.exp === 'number') {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp <= nowSeconds) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('humanaid:auth-cleared'));
  }
};

export const getStoredAuthToken = () => {
  const raw = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!raw) return null;

  const normalized = raw.replace(/^Bearer\s+/i, '').trim();
  if (!isValidJwtToken(normalized)) {
    clearStoredAuth();
    return null;
  }

  return normalized;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const reqUrl = (error.config?.url || '').toLowerCase();
      const isAuthEndpoint = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

      clearStoredAuth();

      if (!isAuthEndpoint && typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        const redirectTarget = `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login?redirect=${encodeURIComponent(redirectTarget)}`;
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
