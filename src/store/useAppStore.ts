
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice';
import { createContactsSlice, ContactsSlice, Contact } from './slices/contactsSlice';
import { createCallSlice, CallSlice } from './slices/callSlice';

// Re-export types for convenience
export type { Contact } from './slices/contactsSlice';
export type { CallRecord, ActiveCall } from './slices/callSlice';
export type { Screen } from './slices/uiSlice';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  about: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

interface AppState extends AuthSlice, UiSlice, ContactsSlice, CallSlice {
  currentUser: UserProfile;
  notifications: NotificationSettings;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

// Mock data for development
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: '@sarah_chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isOnline: true,
    isFavorite: true,
  },
  {
    id: '2', 
    name: 'Mike Johnson',
    username: '@mike_j',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000),
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: '@emma_w',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isOnline: true,
    isFavorite: false,
  },
  {
    id: '4',
    name: 'David Kim',
    username: '@david_kim',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    isOnline: false,
    isFavorite: true,
  },
  {
    id: '5',
    name: 'Chris Lee',
    username: '@chris_lee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isOnline: true,
    isFavorite: true,
  },
  {
    id: '6',
    name: 'Laura Martinez',
    username: '@laura_m',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1.8e+6),
    isFavorite: false,
  },
];

export const useAppStore = create<AppState>((set, get, api) => ({
  // Combine all slices
  ...createAuthSlice(set, get, api),
  ...createUiSlice(set, get, api),
  ...createContactsSlice(set, get, api),
  ...createCallSlice(set, get, api),
  
  // Initial data
  currentUser: {
    id: 'me',
    name: 'You',
    username: '@you',
    about: 'Secure calling made simple',
  },
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  
  // Initialize with mock data
  contacts: mockContacts,
  
  // Profile actions
  updateProfile: (updates) => {
    const { currentUser } = get();
    set({ currentUser: { ...currentUser, ...updates } });
  },
  
  updateNotificationSettings: (settings) => {
    const { notifications } = get();
    set({ notifications: { ...notifications, ...settings } });
  },
}));
