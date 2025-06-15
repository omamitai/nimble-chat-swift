
import { StateCreator } from 'zustand';

export type Screen = 'home' | 'contacts' | 'settings' | 'profile' | 'call' | 'notification_settings' | 'font_size_settings' | 'theme_settings' | 'privacy_security' | 'data_usage' | 'storage' | 'help' | 'about';

export interface UiSlice {
  activeScreen: Screen;
  searchQuery: string;
  isSearching: boolean;
  showSearchBar: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  setActiveScreen: (screen: Screen) => void;
  setSearchQuery: (query: string) => void;
  setSearching: (searching: boolean) => void;
  setShowSearchBar: (show: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  activeScreen: 'home',
  searchQuery: '',
  isSearching: false,
  showSearchBar: false,
  theme: 'auto',
  fontSize: 'medium',
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearching: (searching) => set({ isSearching: searching }),
  setShowSearchBar: (show) => set({ showSearchBar: show }),
  setTheme: (theme) => set({ theme }),
  setFontSize: (size) => set({ fontSize: size }),
});
