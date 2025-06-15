import { create } from 'zustand';

export type Screen = 'home' | 'contacts' | 'settings' | 'profile' | 'call' | 'notification_settings' | 'font_size_settings' | 'theme_settings';

export interface Contact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isBlocked?: boolean;
  isFavorite?: boolean;
}

export interface CallRecord {
  id: string;
  contactId: string;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
  duration?: number;
}

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

export interface ActiveCall {
  id: string;
  contactId: string;
  type: 'voice' | 'video';
  status: 'connecting' | 'ringing' | 'connected' | 'ended';
  startTime: Date;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoOff: boolean;
}

interface AppState {
  // UI State
  activeScreen: Screen;
  searchQuery: string;
  isSearching: boolean;
  showSearchBar: boolean;
  theme: 'light' | 'dark' | 'auto';
  
  // Data State
  contacts: Contact[];
  callHistory: CallRecord[];
  currentUser: UserProfile;
  activeCall: ActiveCall | null;
  
  // Settings
  fontSize: 'small' | 'medium' | 'large';
  notifications: NotificationSettings;
  
  // Actions
  setActiveScreen: (screen: Screen) => void;
  setSearchQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setShowSearchBar: (show: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleContactBlock: (contactId: string) => void;
  toggleFavorite: (contactId: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  addCallRecord: (record: CallRecord) => void;
  
  // Call Actions
  startCall: (contactId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleVideo: () => void;
}

// Mock data with usernames
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

const mockCallHistory: CallRecord[] = [
  {
    id: 'call1',
    contactId: '1',
    type: 'video',
    direction: 'outgoing',
    timestamp: new Date(Date.now() - 3600000),
    duration: 120,
  },
  {
    id: 'call2',
    contactId: '2',
    type: 'voice',
    direction: 'incoming',
    timestamp: new Date(Date.now() - 7200000),
    duration: 45,
  },
  {
    id: 'call3',
    contactId: '3',
    type: 'voice',
    direction: 'missed',
    timestamp: new Date(Date.now() - 86400000),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activeScreen: 'home',
  searchQuery: '',
  isSearching: false,
  showSearchBar: false,
  theme: 'auto',
  
  contacts: mockContacts,
  callHistory: mockCallHistory,
  currentUser: {
    id: 'me',
    name: 'You',
    username: '@you',
    about: 'Secure calling made simple',
  },
  activeCall: null,
  
  fontSize: 'medium',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  
  // Actions
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearching: (searching) => set({ isSearching: searching }),
  
  setShowSearchBar: (show) => set({ showSearchBar: show }),
  
  setTheme: (theme) => set({ theme }),
  
  setFontSize: (size) => set({ fontSize: size }),
  
  updateProfile: (updates) => {
    const { currentUser } = get();
    set({
      currentUser: { ...currentUser, ...updates },
    });
  },
  
  toggleContactBlock: (contactId) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(contact =>
        contact.id === contactId 
          ? { ...contact, isBlocked: !contact.isBlocked }
          : contact
      ),
    });
  },
  
  toggleFavorite: (contactId) => {
    const { contacts } = get();
    set({
      contacts: contacts.map(contact =>
        contact.id === contactId
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      ),
    });
  },
  
  updateNotificationSettings: (settings) => {
    const { notifications } = get();
    set({
      notifications: { ...notifications, ...settings },
    });
  },
  
  addCallRecord: (record) => {
    const { callHistory } = get();
    set({
      callHistory: [record, ...callHistory],
    });
  },
  
  startCall: (contactId, type) => {
    const newCall: ActiveCall = {
      id: `call-${Date.now()}`,
      contactId,
      type,
      status: 'connecting',
      startTime: new Date(),
      isMuted: false,
      isSpeakerOn: false,
      isVideoOff: false,
    };
    
    set({ activeCall: newCall });
    
    setTimeout(() => {
      const { activeCall } = get();
      if (activeCall?.id === newCall.id) {
        set({ 
          activeCall: { ...activeCall, status: 'ringing' }
        });
      }
    }, 1000);
    
    setTimeout(() => {
      const { activeCall } = get();
      if (activeCall?.id === newCall.id) {
        set({ 
          activeCall: { ...activeCall, status: 'connected' }
        });
      }
    }, 3000);
  },
  
  endCall: () => {
    const { activeCall, addCallRecord } = get();
    if (activeCall) {
      const duration = Math.floor((Date.now() - activeCall.startTime.getTime()) / 1000);
      addCallRecord({
        id: `record-${Date.now()}`,
        contactId: activeCall.contactId,
        type: activeCall.type,
        direction: 'outgoing',
        timestamp: activeCall.startTime,
        duration: activeCall.status === 'connected' ? duration : undefined,
      });
    }
    set({ activeCall: null });
  },
  
  toggleMute: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({
        activeCall: { ...activeCall, isMuted: !activeCall.isMuted }
      });
    }
  },
  
  toggleSpeaker: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({
        activeCall: { ...activeCall, isSpeakerOn: !activeCall.isSpeakerOn }
      });
    }
  },
  
  toggleVideo: () => {
    const { activeCall } = get();
    if (activeCall) {
      set({
        activeCall: { ...activeCall, isVideoOff: !activeCall.isVideoOff }
      });
    }
  },
}));
