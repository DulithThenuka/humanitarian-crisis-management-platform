import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { AppRoutes } from './routes/AppRoutes';
import './assets/styles.css';

function AppLayout() {
  return (
    <main style={{ minHeight: '100vh', width: '100%', overflowX: 'clip', backgroundColor: '#14291e' }}>
      <AppRoutes />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <AppLayout />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
