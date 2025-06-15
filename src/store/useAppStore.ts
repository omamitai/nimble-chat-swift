
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice';
import { createContactsSlice, ContactsSlice, Contact } from './slices/contactsSlice';
import { createCallSlice, CallSlice } from './slices/callSlice';

// Re-export types for convenience
export type { Contact } from './slices/contactsSlice';
export type { CallRecord, ActiveCall } from './slices/callSlice';
export type { Screen } from './slices/uiSlice';
export type { User } from './slices/authSlice';

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  callNotifications: boolean;
  messageNotifications: boolean;
}

interface AppState extends AuthSlice, UiSlice, ContactsSlice, CallSlice {
  notifications: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  initializeApp: () => void;
}

// Mock data for development - will be replaced by API calls
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
];

export const useAppStore = create<AppState>((set, get, api) => ({
  // Combine all slices
  ...createAuthSlice(set, get, api),
  ...createUiSlice(set, get, api),
  ...createContactsSlice(set, get, api),
  ...createCallSlice(set, get, api),
  
  // Initial notification settings
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    callNotifications: true,
    messageNotifications: true,
  },
  
  // Initialize with mock data for development
  contacts: mockContacts,
  
  updateNotificationSettings: (settings) => {
    const { notifications } = get();
    const updated = { ...notifications, ...settings };
    localStorage.setItem('notificationSettings', JSON.stringify(updated));
    set({ notifications: updated });
  },
  
  initializeApp: () => {
    // Load saved settings
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      set({ notifications: JSON.parse(savedNotifications) });
    }
  },
}));
