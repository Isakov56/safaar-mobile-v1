import { create } from 'zustand';
import { secureStorage as SecureStore } from '../utils/secureStorage';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type UserRole = 'traveler' | 'host' | 'both';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  interests: string[];
  city: string | null;
  bio: string | null;
  joinedAt: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  setToken: (token: string) => Promise<void>;
  hydrateAuth: () => Promise<void>;
  clearError: () => void;
  setOnboardingData: (role: UserRole, interests: string[], city?: string) => void;
}

type AuthStore = AuthState & AuthActions;

const TOKEN_KEY = 'safaar_auth_token';

// ──────────────────────────────────────────────
// Mock helpers
// ──────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createMockUser = (name: string, email: string): User => ({
  id: `user_${Date.now()}`,
  name,
  email,
  avatar: null,
  role: 'traveler',
  interests: [],
  city: null,
  bio: null,
  joinedAt: new Date().toISOString(),
  isVerified: false,
});

const MOCK_TOKEN = 'mock_jwt_token_safaar_2026';

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,

  // Actions
  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await delay(1200);

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const user = createMockUser('Traveler', email);
      const token = MOCK_TOKEN;

      await SecureStore.setItemAsync(TOKEN_KEY, token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign in failed. Please try again.';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  signUp: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock API call
      await delay(1500);

      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }

      const user = createMockUser(name, email);
      const token = MOCK_TOKEN;

      await SecureStore.setItemAsync(TOKEN_KEY, token);

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Sign up failed. Please try again.';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // Ignore secure store errors during sign out
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  updateProfile: (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, ...data } });
  },

  setToken: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token });
  },

  hydrateAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        // Mock: rehydrate user from token
        await delay(500);
        const user = createMockUser('Returning User', 'user@safaar.app');
        set({
          user,
          token,
          isAuthenticated: true,
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
      }
    } catch {
      set({ isHydrated: true });
    }
  },

  clearError: () => set({ error: null }),

  setOnboardingData: (role: UserRole, interests: string[], city?: string) => {
    const { user } = get();
    if (!user) return;
    set({
      user: {
        ...user,
        role,
        interests,
        city: city ?? user.city,
      },
    });
  },
}));
