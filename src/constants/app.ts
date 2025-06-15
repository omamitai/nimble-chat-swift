export const APP_CONFIG = {
  name: 'SecureCall',
  version: '1.0.0',
  description: 'End-to-end encrypted calling app',
  company: 'SecureCall Inc.',
  PRIVACY_URL: 'https://securecall.com/privacy',
  TERMS_URL: 'https://securecall.com/terms',
  SUPPORT_EMAIL: 'support@securecall.com',
  // Keep both formats for compatibility
  NAME: 'SecureCall',
  VERSION: '1.0.0',
  DESCRIPTION: 'End-to-end encrypted calling app',
};

export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retries: 3,
};

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
  notifications: 'notificationSettings',
  theme: 'theme',
} as const;

export const ROUTES = {
  home: '/',
  auth: '/auth',
  profile: '/profile',
  settings: '/settings',
  contacts: '/contacts',
  call: '/call',
} as const;

export const THEME_OPTIONS = ['light', 'dark', 'auto'] as const;
export const FONT_SIZE_OPTIONS = ['small', 'medium', 'large'] as const;

export const NOTIFICATION_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;
