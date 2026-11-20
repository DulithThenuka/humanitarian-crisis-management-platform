import { useEffect, useRef } from 'react';
import { useRealtime } from '../context/RealtimeContext';

/**
 * Subscribes a view or portal to real-time backend updates for the given API domains.
 * Also refreshes on tab focus and falls back to polling if SSE is disconnected.
 */
export const useRealtimeRefresh = (
  domains,
  refreshFn,
  { enabled = true, debounceMs = 250, fallbackPollMs = 30000 } = {}
) => {
  const { connected, subscribe } = useRealtime();
  const refreshRef = useRef(refreshFn);
  refreshRef.current = refreshFn;

  const domainKey = Array.isArray(domains) ? domains.join(',') : String(domains || '*');

  useEffect(() => {
    if (!enabled) return undefined;

    let timer = null;
    const scheduleRefresh = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (typeof refreshRef.current === 'function') {
          refreshRef.current();
        }
      }, debounceMs);
    };

    const unsubscribe = subscribe(domainKey.split(','), scheduleRefresh);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        scheduleRefresh();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Fallback polling only if SSE is disconnected
    let pollTimer = null;
    if (!connected && fallbackPollMs > 0) {
      pollTimer = setInterval(() => {
        if (document.visibilityState === 'visible' && typeof refreshRef.current === 'function') {
          refreshRef.current();
        }
      }, fallbackPollMs);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (pollTimer) clearInterval(pollTimer);
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, domainKey, connected, debounceMs, fallbackPollMs, subscribe]);

  return { connected };
};
