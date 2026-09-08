import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SEARCH_ENGINE_URL } from '../constants/theme';
import { appStorage } from '../storage/appStorage';

export interface Tab {
  id: string;
  url: string;
  title: string;
  isPrivate: boolean;
  blockedCount: number;
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
  lastVisitedAt: number;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  isPrivateMode: boolean;
  isHydrated: boolean;
  addTab: (url?: string, title?: string, isPrivate?: boolean) => string;
  closeTab: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setPrivateMode: (isPrivate: boolean) => void;
  clearPrivateData: () => void;
  setHydrated: (value: boolean) => void;
}

type PersistedBrowserState = Pick<BrowserState, 'tabs' | 'activeTabId' | 'isPrivateMode'>;

const MAX_PERSISTED_TABS = 20;

const makeTab = (url = SEARCH_ENGINE_URL, title = 'New Tab', isPrivate = false): Tab => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  url,
  title,
  isPrivate,
  blockedCount: 0,
  progress: 0,
  canGoBack: false,
  canGoForward: false,
  lastVisitedAt: Date.now(),
});

const normalizeTab = (tab: Partial<Tab>, index: number): Tab => ({
  id: typeof tab.id === 'string' && tab.id.length > 0 ? tab.id : `restored-${index}`,
  url: typeof tab.url === 'string' && tab.url.length > 0 ? tab.url : SEARCH_ENGINE_URL,
  title: typeof tab.title === 'string' && tab.title.length > 0 ? tab.title : 'New Tab',
  isPrivate: Boolean(tab.isPrivate),
  blockedCount: Number.isFinite(tab.blockedCount) ? Math.max(0, Number(tab.blockedCount)) : 0,
  progress: Number.isFinite(tab.progress) ? Math.min(1, Math.max(0, Number(tab.progress))) : 0,
  canGoBack: Boolean(tab.canGoBack),
  canGoForward: Boolean(tab.canGoForward),
  lastVisitedAt: Number.isFinite(tab.lastVisitedAt) ? Number(tab.lastVisitedAt) : Date.now(),
});

const makeDefaultState = (): PersistedBrowserState => {
  const initialTab = makeTab();
  return {
    tabs: [initialTab],
    activeTabId: initialTab.id,
    isPrivateMode: false,
  };
};

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set) => ({
      ...makeDefaultState(),
      isHydrated: false,
      addTab: (url = SEARCH_ENGINE_URL, title = 'New Tab', isPrivate) => {
        const tab = makeTab(url, title, isPrivate ?? false);
        set((state) => ({
          tabs: [...state.tabs, tab].slice(-MAX_PERSISTED_TABS),
          activeTabId: tab.id,
        }));
        return tab.id;
      },
      closeTab: (id) =>
        set((state) => {
          const remaining = state.tabs.filter((tab) => tab.id !== id);
          const nextTabs =
            remaining.length > 0
              ? remaining
              : [makeTab(SEARCH_ENGINE_URL, 'New Tab', state.isPrivateMode)];
          const currentIndex = Math.max(0, state.tabs.findIndex((tab) => tab.id === id) - 1);
          const nextActive =
            state.activeTabId === id
              ? nextTabs[Math.min(currentIndex, nextTabs.length - 1)].id
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
      setActiveTab: (id) =>
        set((state) => (state.tabs.some((tab) => tab.id === id) ? { activeTabId: id } : state)),
      updateTab: (id, updates) =>
        set((state) => ({
          tabs: state.tabs.map((tab) =>
            tab.id === id
              ? {
                  ...tab,
                  ...updates,
                  lastVisitedAt:
                    updates.url !== undefined || updates.title !== undefined
                      ? Date.now()
                      : tab.lastVisitedAt,
                }
              : tab,
          ),
        })),
      setPrivateMode: (isPrivate) => set({ isPrivateMode: isPrivate }),
      clearPrivateData: () =>
        set((state) => {
          const normalTabs = state.tabs.filter((tab) => !tab.isPrivate);
          const nextTabs =
            normalTabs.length > 0 ? normalTabs : [makeTab(SEARCH_ENGINE_URL, 'New Tab', false)];
          return { tabs: nextTabs, activeTabId: nextTabs[0].id, isPrivateMode: false };
        }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'probaho-browser-session-v1',
      storage: appStorage,
      version: 1,
      partialize: (state) => ({
        tabs: state.tabs.filter((tab) => !tab.isPrivate).slice(-MAX_PERSISTED_TABS),
        activeTabId: state.activeTabId,
        isPrivateMode: state.isPrivateMode,
      }),
      migrate: (persistedState) => {
        const fallback = makeDefaultState();
        const persisted = persistedState as Partial<PersistedBrowserState> | undefined;
        const tabs = Array.isArray(persisted?.tabs)
          ? persisted.tabs
              .map((tab, index) => normalizeTab(tab, index))
              .filter((tab) => !tab.isPrivate)
          : fallback.tabs;
        const restoredTabs = tabs.length > 0 ? tabs.slice(-MAX_PERSISTED_TABS) : fallback.tabs;
        const activeTabId = restoredTabs.some((tab) => tab.id === persisted?.activeTabId)
          ? (persisted?.activeTabId ?? restoredTabs[0].id)
          : restoredTabs[0].id;
        return {
          tabs: restoredTabs,
          activeTabId,
          isPrivateMode: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
