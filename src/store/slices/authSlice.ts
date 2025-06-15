
import { StateCreator } from 'zustand';

export interface AuthSlice {
  isAuthenticated: boolean;
  user: any | null;
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: any) => void;
  clearAuth: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  user: null,
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ isAuthenticated: false, user: null }),
});
