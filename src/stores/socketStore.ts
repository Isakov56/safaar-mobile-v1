import { create } from 'zustand';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface SocketState {
  isConnected: boolean;
  onlineUsers: Set<string>;
  unreadMessages: number;
  unreadNotifications: number;
  error: string | null;
}

interface SocketActions {
  connect: (token: string) => void;
  disconnect: () => void;
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  incrementUnreadMessages: () => void;
  incrementUnreadNotifications: () => void;
  resetUnreadMessages: () => void;
  resetUnreadNotifications: () => void;
}

type SocketStore = SocketState & SocketActions;

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useSocketStore = create<SocketStore>((set, get) => ({
  // State
  isConnected: false,
  onlineUsers: new Set<string>(),
  unreadMessages: 0,
  unreadNotifications: 0,
  error: null,

  // Actions
  connect: (token: string) => {
    // Mock connection — in production, use socket.io-client
    // const socket = io(SOCKET_URL, { auth: { token } });
    // socket.on('connect', () => set({ isConnected: true }));
    // socket.on('disconnect', () => set({ isConnected: false }));
    // socket.on('users:online', (users) => set({ onlineUsers: new Set(users) }));
    // socket.on('message:new', () => get().incrementUnreadMessages());
    // socket.on('notification:new', () => get().incrementUnreadNotifications());

    // Mock: simulate connected after a short delay
    setTimeout(() => {
      set({ isConnected: true, error: null });
    }, 300);
  },

  disconnect: () => {
    // Mock disconnection — in production, socket.disconnect()
    set({
      isConnected: false,
      onlineUsers: new Set<string>(),
    });
  },

  setOnlineUsers: (users: string[]) => {
    set({ onlineUsers: new Set(users) });
  },

  addOnlineUser: (userId: string) => {
    const { onlineUsers } = get();
    const updated = new Set(onlineUsers);
    updated.add(userId);
    set({ onlineUsers: updated });
  },

  removeOnlineUser: (userId: string) => {
    const { onlineUsers } = get();
    const updated = new Set(onlineUsers);
    updated.delete(userId);
    set({ onlineUsers: updated });
  },

  incrementUnreadMessages: () => {
    set((state) => ({ unreadMessages: state.unreadMessages + 1 }));
  },

  incrementUnreadNotifications: () => {
    set((state) => ({ unreadNotifications: state.unreadNotifications + 1 }));
  },

  resetUnreadMessages: () => set({ unreadMessages: 0 }),

  resetUnreadNotifications: () => set({ unreadNotifications: 0 }),
}));
