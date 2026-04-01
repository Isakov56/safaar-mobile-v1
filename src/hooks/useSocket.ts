import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { useSocketStore } from '../stores/socketStore';

const SOCKET_URL = __DEV__ ? 'http://localhost:3000' : 'https://api.safaar.app';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { setConnected, setDisconnected } = useSocketStore();

  useEffect(() => {
    let socket: Socket;

    async function connect() {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) return;

      socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      socket.on('connect', () => {
        setConnected();
      });

      socket.on('disconnect', () => {
        setDisconnected();
      });

      socketRef.current = socket;
    }

    connect();

    return () => {
      socket?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return socketRef;
}

export function useSocketEvent<T>(
  socketRef: React.RefObject<Socket | null>,
  event: string,
  handler: (data: T) => void
) {
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socketRef, event, handler]);
}
