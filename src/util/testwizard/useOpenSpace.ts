import { useCallback, useRef, useState } from 'react';
import createApi from 'openspace-api-js';
import type { OpenSpaceLibrary } from 'openspace-api-js/types';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface UseOpenSpaceResult {
  status: ConnectionStatus;
  library: OpenSpaceLibrary | null;
  getProperty: (uri: string) => Promise<unknown>;
  connect: (host?: string, port?: number) => void;
  disconnect: () => void;
}

export function useOpenSpace(): UseOpenSpaceResult {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [library, setLibrary] = useState<OpenSpaceLibrary | null>(null);
  const apiRef = useRef<ReturnType<typeof createApi> | null>(null);

  const disconnect = useCallback(() => {
    apiRef.current?.disconnect();
    apiRef.current = null;
    setLibrary(null);
    setStatus('disconnected');
  }, []);

  const getProperty = useCallback(async (uri: string): Promise<unknown> => {
    if (!apiRef.current) return null;
    const result = await apiRef.current.getProperty(uri);
    return result;
  }, []);
  const connect = useCallback(
    (host = 'localhost', port = 4682) => {
      if (apiRef.current) disconnect();

      setStatus('connecting');
      const api = createApi(host, port);
      apiRef.current = api;

      api.onConnect(async () => {
        try {
          const lib = await api.library<OpenSpaceLibrary>();
          setLibrary(lib);
          setStatus('connected');
        } catch {
          setStatus('error');
        }
      });

      api.onDisconnect(() => {
        setLibrary(null);
        setStatus('disconnected');
      });

      try {
        api.connect();
      } catch {
        setStatus('error');
      }
    },
    [disconnect]
  );

  return { status, library, getProperty, connect, disconnect };
}
