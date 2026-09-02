import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  blockTrackers: boolean;
  blockAds: boolean;
  blockCookies: boolean;
  dnsOverHttps: boolean;
  forceHttps: boolean;
  searchSuggestions: boolean;
  searchEngine: 'DuckDuckGo' | 'Google' | 'Bing';
  theme: ThemeMode;
  fontScale: number;
  onboardingCompleted: boolean;
  setBlockTrackers: (value: boolean) => void;
  setBlockAds: (value: boolean) => void;
  setBlockCookies: (value: boolean) => void;
  setDnsOverHttps: (value: boolean) => void;
  setForceHttps: (value: boolean) => void;
  setSearchSuggestions: (value: boolean) => void;
  setSearchEngine: (value: SettingsState['searchEngine']) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontScale: (value: number) => void;
  setOnboardingCompleted: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  blockTrackers: true,
  blockAds: true,
  blockCookies: false,
  dnsOverHttps: true,
  forceHttps: true,
  searchSuggestions: true,
  searchEngine: 'DuckDuckGo',
  theme: 'dark',
  fontScale: 1,
  onboardingCompleted: false,
  setBlockTrackers: (value) => set({ blockTrackers: value }),
  setBlockAds: (value) => set({ blockAds: value }),
  setBlockCookies: (value) => set({ blockCookies: value }),
  setDnsOverHttps: (value) => set({ dnsOverHttps: value }),
  setForceHttps: (value) => set({ forceHttps: value }),
  setSearchSuggestions: (value) => set({ searchSuggestions: value }),
  setSearchEngine: (value) => set({ searchEngine: value }),
  setTheme: (theme) => set({ theme }),
  setFontScale: (value) => set({ fontScale: value }),
  setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
}));
