
import { create } from 'zustand';

export type Screen = 'chatList' | 'conversation' | 'contacts' | 'settings' | 'profile' | 'call';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isBlocked?: boolean;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'voice' | 'file';
  replyTo?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  participants: string[];
  isOnline?: boolean;
  isTyping?: boolean;
  isPinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  about: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  preview: boolean;
}

interface AppState {
  // UI State
  activeScreen: Screen;
  selectedChatId: string | null;
  searchQuery: string;
  isSearching: boolean;
  showSearchBar: boolean;
  theme: 'light' | 'dark' | 'auto';
  
  // Data State
  contacts: Contact[];
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  currentUser: UserProfile;
  
  // Settings
  fontSize: 'small' | 'medium' | 'large';
  notifications: NotificationSettings;
  
  // Actions
  setActiveScreen: (screen: Screen) => void;
  setSelectedChat: (chatId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setShowSearchBar: (show: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  addMessage: (chatId: string, message: Message) => void;
  markMessagesAsRead: (chatId: string) => void;
  updateMessageStatus: (chatId: string, messageId: string, status: Message['status']) => void;
  setTypingStatus: (chatId: string, isTyping: boolean) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleContactBlock: (contactId: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    phone: '+1 555 0101',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    isOnline: true,
  },
  {
    id: '2', 
    name: 'Mike Johnson',
    phone: '+1 555 0102',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    id: '3',
    name: 'Emma Wilson',
    phone: '+1 555 0103', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Design Team',
    phone: '',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    isOnline: false,
  },
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    lastMessage: {
      id: 'm1',
      text: "Hey! How's the new messaging app coming along?",
      senderId: '1',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      status: 'read',
      type: 'text',
    },
    unreadCount: 0,
    isGroup: false,
    participants: ['1'],
    isOnline: true,
    isPinned: true,
  },
  {
    id: '2',
    name: 'Mike Johnson', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    lastMessage: {
      id: 'm2',
      text: 'Perfect! The UI looks really clean',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'delivered',
      type: 'text',
    },
    unreadCount: 2,
    isGroup: false,
    participants: ['2'],
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    lastMessage: {
      id: 'm3',
      text: 'Voice messages coming soon? 🎙️',
      senderId: '3',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: 'sent',
      type: 'text',
    },
    unreadCount: 1,
    isGroup: false,
    participants: ['3'],
    isTyping: true,
  },
  {
    id: '4',
    name: 'Design Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
    lastMessage: {
      id: 'm4',
      text: 'Mobile-first approach is working great!',
      senderId: 'me',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'read',
      type: 'text',
    },
    unreadCount: 0,
    isGroup: true,
    participants: ['1', '2', '3'],
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1-1',
      text: 'Hi there! How are you doing?',
      senderId: '1',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-2',
      text: "I'm doing great! Working on this new messaging app",
      senderId: 'me',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-3',
      text: "That sounds exciting! What's the focus?",
      senderId: '1',
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-4',
      text: 'Mobile-first, privacy-focused messaging. Think Signal meets WhatsApp but cleaner.',
      senderId: 'me',
      timestamp: new Date(Date.now() - 3300000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm1-5',
      text: "Hey! How's the new messaging app coming along?",
      senderId: '1',
      timestamp: new Date(Date.now() - 120000),
      status: 'read',
      type: 'text',
    },
  ],
  '2': [
    {
      id: 'm2-1',
      text: 'The design system looks really solid',
      senderId: '2',
      timestamp: new Date(Date.now() - 7200000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm2-2',
      text: 'Thanks! Spent a lot of time on mobile optimization',
      senderId: 'me',
      timestamp: new Date(Date.now() - 7100000),
      status: 'read',
      type: 'text',
    },
    {
      id: 'm2-3',
      text: 'Perfect! The UI looks really clean',
      senderId: 'me',
      timestamp: new Date(Date.now() - 1800000),
      status: 'delivered',
      type: 'text',
    },
  ],
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activeScreen: 'chatList',
  selectedChatId: null,
  searchQuery: '',
  isSearching: false,
  showSearchBar: false,
  theme: 'light',
  
  contacts: mockContacts,
  conversations: mockConversations,
  messages: mockMessages,
  currentUser: {
    id: 'me',
    name: 'You',
    phone: '+1 555 0100',
    about: 'Building the future of messaging',
  },
  
  fontSize: 'medium',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    preview: true,
  },
  
  // Actions
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  
  setSelectedChat: (chatId) => set({ selectedChatId: chatId }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSearching: (searching) => set({ isSearching: searching }),
  
  setShowSearchBar: (show) => set({ showSearchBar: show }),
  
  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Auto theme - check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
  
  addMessage: (chatId, message) => {
    const { messages, conversations } = get();
    const chatMessages = messages[chatId] || [];
    
    set({
      messages: {
        ...messages,
        [chatId]: [...chatMessages, message],
      },
      conversations: conversations.map(conv => 
        conv.id === chatId 
          ? { ...conv, lastMessage: message, unreadCount: message.senderId === 'me' ? 0 : conv.unreadCount + 1 }
          : conv
      ),
    });
  },
  
  markMessagesAsRead: (chatId) => {
    const { conversations } = get();
    set({
      conversations: conversations.map(conv =>
        conv.id === chatId ? { ...conv, unreadCount: 0 } : conv
      ),
    });
  },
  
  updateMessageStatus: (chatId, messageId, status) => {
    const { messages } = get();
    const chatMessages = messages[chatId] || [];
    
    set({
      messages: {
        ...messages,
        [chatId]: chatMessages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ),
      },
    });
  },
  
  setTypingStatus: (chatId, isTyping) => {
    const { conversations } = get();
    set({
      conversations: conversations.map(conv =>
        conv.id === chatId ? { ...conv, isTyping } : conv
      ),
    });
  },
  
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
  
  updateNotificationSettings: (settings) => {
    const { notifications } = get();
    set({
      notifications: { ...notifications, ...settings },
    });
  },
}));
