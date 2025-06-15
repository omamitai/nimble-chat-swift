
import { StateCreator } from 'zustand';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  about?: string;
  createdAt?: string;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: (() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  })(),
  
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  
  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user });
  },
  
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
  
  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },
});
