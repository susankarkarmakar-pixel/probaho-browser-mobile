import { create } from 'zustand';
import { SEARCH_ENGINE_URL } from '../constants/theme';

export interface Tab {
  id: string;
  url: string;
  title: string;
  isPrivate: boolean;
  blockedCount: number;
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  isPrivateMode: boolean;
  addTab: (url?: string, title?: string, isPrivate?: boolean) => string;
  closeTab: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setPrivateMode: (isPrivate: boolean) => void;
  clearPrivateData: () => void;
}

const makeTab = (url = SEARCH_ENGINE_URL, title = 'New Tab', isPrivate = false): Tab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  url,
  title,
  isPrivate,
  blockedCount: 0,
  progress: 0,
  canGoBack: false,
  canGoForward: false,
});

const initialTab = makeTab();

export const useBrowserStore = create<BrowserState>((set) => ({
  tabs: [initialTab],
  activeTabId: initialTab.id,
  isPrivateMode: false,
  addTab: (url = SEARCH_ENGINE_URL, title = 'New Tab', isPrivate) => {
    const tab = makeTab(url, title, isPrivate ?? false);
    set((state) => ({ tabs: [...state.tabs, tab], activeTabId: tab.id }));
    return tab.id;
  },
  closeTab: (id) =>
    set((state) => {
      const remaining = state.tabs.filter((tab) => tab.id !== id);
      const nextTabs =
        remaining.length > 0
          ? remaining
          : [makeTab(SEARCH_ENGINE_URL, 'New Tab', state.isPrivateMode)];
      const nextActive =
        state.activeTabId === id
          ? nextTabs[Math.max(0, remaining.length - 1)].id
          : state.activeTabId;
      return { tabs: nextTabs, activeTabId: nextActive };
    }),
  closeAllTabs: () =>
    set((state) => {
      const normalTabs = state.tabs.filter((tab) => !tab.isPrivate);
      const nextTabs =
        normalTabs.length > 0
          ? normalTabs
          : [makeTab(SEARCH_ENGINE_URL, 'New Tab', state.isPrivateMode)];
      return { tabs: nextTabs, activeTabId: nextTabs[0].id };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
  updateTab: (id, updates) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
    })),
  setPrivateMode: (isPrivate) => set({ isPrivateMode: isPrivate }),
  clearPrivateData: () =>
    set((state) => {
      const normalTabs = state.tabs.filter((tab) => !tab.isPrivate);
      const nextTabs =
        normalTabs.length > 0 ? normalTabs : [makeTab(SEARCH_ENGINE_URL, 'New Tab', false)];
      return { tabs: nextTabs, activeTabId: nextTabs[0].id, isPrivateMode: false };
    }),
}));
