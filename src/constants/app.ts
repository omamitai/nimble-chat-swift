
export const APP_CONFIG = {
  NAME: 'SecureCall',
  VERSION: '1.0.0',
  DESCRIPTION: 'End-to-end encrypted calling app',
  SUPPORT_EMAIL: 'support@securecall.app',
  PRIVACY_URL: 'https://securecall.app/privacy',
  TERMS_URL: 'https://securecall.app/terms',
} as const;

export const ROUTES = {
  HOME: '/',
  CONTACTS: '/contacts',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  CALL: '/call',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
  },
  PROFILE: '/profile',
  CONTACTS: '/contacts',
  CALLS: {
    INITIATE: '/calls/initiate',
    END: '/calls/end',
    HISTORY: '/calls/history',
  },
} as const;
