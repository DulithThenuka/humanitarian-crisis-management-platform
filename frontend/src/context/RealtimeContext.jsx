import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { API_BASE_URL } from '../services/apiClient';

const RealtimeContext = createContext({
  connected: false,
  lastEvent: null,
  subscribe: () => () => {}
});

export const RealtimeProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const listenersRef = useRef(new Set());

  const notifyListeners = useCallback((evt) => {
    setLastEvent(evt);
    listenersRef.current.forEach((listener) => {
      try {
        listener(evt);
      } catch {
        // Ignore subscriber errors so other listeners continue
      }
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let es = null;
    let reconnectTimer = null;
    let closed = false;

    const connect = () => {
      if (closed || typeof EventSource === 'undefined') return;
      const streamUrl = `${API_BASE_URL.replace(/\/$/, '')}/realtime/stream`;
      es = new EventSource(streamUrl);

      es.onopen = () => {
        setConnected(true);
      };

      es.addEventListener('data-changed', (messageEvent) => {
        try {
          const parsed = JSON.parse(messageEvent.data);
          notifyListeners(parsed);
        } catch {
          notifyListeners({ type: 'data-changed', domain: '*', timestamp: new Date().toISOString() });
        }
      });

      es.onerror = () => {
        setConnected(false);
        if (es) {
          es.close();
          es = null;
        }
        if (!closed) {
          reconnectTimer = setTimeout(connect, 4000);
        }
      };
    };

    connect();

    // Cross-tab instant sync via BroadcastChannel
    let channel = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel('humanaid-realtime');
      channel.onmessage = (msg) => {
        if (msg?.data?.domain) {
          notifyListeners(msg.data);
        }
      };
    }

    // Same-tab local mutation fallback
    const handleLocalMutation = (e) => {
      if (e?.detail?.domain) {
        notifyListeners(e.detail);
      }
    };
    window.addEventListener('humanaid:local-mutation', handleLocalMutation);

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (es) es.close();
      if (channel) channel.close();
      window.removeEventListener('humanaid:local-mutation', handleLocalMutation);
    };
  }, [notifyListeners]);

  const subscribe = useCallback((domains, callback) => {
    const domainList = Array.isArray(domains)
      ? domains.map((d) => String(d).toLowerCase())
      : [String(domains || '*').toLowerCase()];

    const wrapped = (evt) => {
      const evtDomain = String(evt?.domain || '*').toLowerCase();
      if (domainList.includes('*') || evtDomain === '*' || domainList.includes(evtDomain)) {
        callback(evt);
      }
    };

    listenersRef.current.add(wrapped);
    return () => {
      listenersRef.current.delete(wrapped);
    };
  }, []);

  return (
    <RealtimeContext.Provider value={{ connected, lastEvent, subscribe }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
