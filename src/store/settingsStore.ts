import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appStorage } from '../storage/appStorage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SearchEngine = 'DuckDuckGo' | 'Google' | 'Bing';

interface SettingsState {
  blockTrackers: boolean;
  blockAds: boolean;
  blockCookies: boolean;
  dnsOverHttps: boolean;
  forceHttps: boolean;
  searchSuggestions: boolean;
  searchEngine: SearchEngine;
  theme: ThemeMode;
  fontScale: number;
  onboardingCompleted: boolean;
  isHydrated: boolean;
  setBlockTrackers: (value: boolean) => void;
  setBlockAds: (value: boolean) => void;
  setBlockCookies: (value: boolean) => void;
  setDnsOverHttps: (value: boolean) => void;
  setForceHttps: (value: boolean) => void;
  setSearchSuggestions: (value: boolean) => void;
  setSearchEngine: (value: SearchEngine) => void;
  setTheme: (theme: ThemeMode) => void;
  setFontScale: (value: number) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
}

type PersistedSettings = Omit<
  SettingsState,
  | 'setBlockTrackers'
  | 'setBlockAds'
  | 'setBlockCookies'
  | 'setDnsOverHttps'
  | 'setForceHttps'
  | 'setSearchSuggestions'
  | 'setSearchEngine'
  | 'setTheme'
  | 'setFontScale'
  | 'setOnboardingCompleted'
  | 'setHydrated'
>;

const defaultSettings: PersistedSettings = {
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
  isHydrated: false,
};

const isSearchEngine = (value: unknown): value is SearchEngine =>
  value === 'DuckDuckGo' || value === 'Google' || value === 'Bing';

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setBlockTrackers: (value) => set({ blockTrackers: value }),
      setBlockAds: (value) => set({ blockAds: value }),
      setBlockCookies: (value) => set({ blockCookies: value }),
      setDnsOverHttps: (value) => set({ dnsOverHttps: value }),
      setForceHttps: (value) => set({ forceHttps: value }),
      setSearchSuggestions: (value) => set({ searchSuggestions: value }),
      setSearchEngine: (value) => set({ searchEngine: value }),
      setTheme: (theme) => set({ theme }),
      setFontScale: (value) => set({ fontScale: Math.min(1.3, Math.max(0.85, value)) }),
      setOnboardingCompleted: (value) => set({ onboardingCompleted: value }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'probaho-settings-v1',
      storage: appStorage,
      version: 1,
      partialize: (state) => ({
        blockTrackers: state.blockTrackers,
        blockAds: state.blockAds,
        blockCookies: state.blockCookies,
        dnsOverHttps: state.dnsOverHttps,
        forceHttps: state.forceHttps,
        searchSuggestions: state.searchSuggestions,
        searchEngine: state.searchEngine,
        theme: state.theme,
        fontScale: state.fontScale,
        onboardingCompleted: state.onboardingCompleted,
      }),
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<PersistedSettings> | undefined;
        return {
          ...defaultSettings,
          blockTrackers:
            typeof persisted?.blockTrackers === 'boolean'
              ? persisted.blockTrackers
              : defaultSettings.blockTrackers,
          blockAds:
            typeof persisted?.blockAds === 'boolean'
              ? persisted.blockAds
              : defaultSettings.blockAds,
          blockCookies:
            typeof persisted?.blockCookies === 'boolean'
              ? persisted.blockCookies
              : defaultSettings.blockCookies,
          dnsOverHttps:
            typeof persisted?.dnsOverHttps === 'boolean'
              ? persisted.dnsOverHttps
              : defaultSettings.dnsOverHttps,
          forceHttps:
            typeof persisted?.forceHttps === 'boolean'
              ? persisted.forceHttps
              : defaultSettings.forceHttps,
          searchSuggestions:
            typeof persisted?.searchSuggestions === 'boolean'
              ? persisted.searchSuggestions
              : defaultSettings.searchSuggestions,
          searchEngine: isSearchEngine(persisted?.searchEngine)
            ? persisted.searchEngine
            : defaultSettings.searchEngine,
          theme: isThemeMode(persisted?.theme) ? persisted.theme : defaultSettings.theme,
          fontScale:
            typeof persisted?.fontScale === 'number'
              ? Math.min(1.3, Math.max(0.85, persisted.fontScale))
              : defaultSettings.fontScale,
          onboardingCompleted:
            typeof persisted?.onboardingCompleted === 'boolean'
              ? persisted.onboardingCompleted
              : defaultSettings.onboardingCompleted,
          isHydrated: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
