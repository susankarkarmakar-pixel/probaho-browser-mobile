import { create } from 'zustand';

interface SettingsState {
  blockTrackers: boolean;
  dnsOverHttps: boolean;
  theme: 'light' | 'dark' | 'system';
  setBlockTrackers: (value: boolean) => void;
  setDnsOverHttps: (value: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  blockTrackers: true,
  dnsOverHttps: true,
  theme: 'system',

  setBlockTrackers: (value) => set({ blockTrackers: value }),
  setDnsOverHttps: (value) => set({ dnsOverHttps: value }),
  setTheme: (theme) => set({ theme }),
}));
