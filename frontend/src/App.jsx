import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppRoutes } from './routes/AppRoutes';
import './assets/styles.css';

function AppLayout() {
  const location = useLocation();
  const isDedicatedLayout = 
    location.pathname === '/' || 
    location.pathname === '/home' ||
    location.pathname === '/landing' ||
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/coordinator') || 
    location.pathname.startsWith('/audit') ||
    location.pathname.startsWith('/ai-operations') ||
    location.pathname.startsWith('/ai-workspaces') ||
    location.pathname.startsWith('/ai-governance') ||
    location.pathname.startsWith('/map') ||
    location.pathname.startsWith('/citizen') || 
    location.pathname.startsWith('/citize') || 
    location.pathname.startsWith('/alerts') || 
    location.pathname.startsWith('/shelters') || 
    location.pathname.startsWith('/track') || 
    location.pathname.startsWith('/emergency') || 
    location.pathname.startsWith('/assistance') || 
    location.pathname.startsWith('/requests') ||
    location.pathname === '/request-detail' ||
    location.pathname === '/reports' ||
    location.pathname === '/analytics' || 
    location.pathname === '/login' || 
    location.pathname === '/register';

  if (isDedicatedLayout) {
    return (
      <main style={{ minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
        <AppRoutes />
      </main>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, backgroundColor: '#0b1120', minHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <AppRoutes />
        </main>
      </div>
    </div>
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
