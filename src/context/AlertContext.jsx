import React, { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, type = 'info', timeout = 4000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, timeout);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts.map(alert => (
          <div
            key={alert.id}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              backgroundColor: alert.type === 'error' ? '#ef4444' : alert.type === 'success' ? '#10b981' : '#3b82f6',
              color: '#ffffff'
            }}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
