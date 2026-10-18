import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppRoutes } from './routes/AppRoutes';
import './assets/styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0f172a' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1 }}>
              <Sidebar />
              <main style={{ flex: 1, backgroundColor: '#0b1120', minHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                <AppRoutes />
              </main>
            </div>
          </div>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
