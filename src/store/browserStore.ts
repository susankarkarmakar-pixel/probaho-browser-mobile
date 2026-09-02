import { create } from 'zustand';

export interface Tab {
  id: string;
  url: string;
  title: string;
}

interface BrowserState {
  tabs: Tab[];
  activeTabId: string | null;
  isPrivateMode: boolean;
  addTab: (url: string, title?: string) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setPrivateMode: (isPrivate: boolean) => void;
  clearPrivateData: () => void;
}

export const useBrowserStore = create<BrowserState>((set) => ({
  tabs: [{ id: '1', url: 'https://duckduckgo.com', title: 'New Tab' }],
  activeTabId: '1',
  isPrivateMode: false,

  addTab: (url, title = 'New Tab') =>
    set((state) => {
      const newTab = { id: Date.now().toString(), url, title };
      return {
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
      };
    }),

  closeTab: (id) =>
    set((state) => {
      const newTabs = state.tabs.filter((tab) => tab.id !== id);
      let newActiveId = state.activeTabId;
      if (state.activeTabId === id) {
        newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
      }
      return {
        tabs: newTabs,
        activeTabId: newActiveId,
      };
    }),

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, updates) =>
    set((state) => ({
      tabs: state.tabs.map((tab) => (tab.id === id ? { ...tab, ...updates } : tab)),
    })),

  setPrivateMode: (isPrivate) => set({ isPrivateMode: isPrivate }),

  clearPrivateData: () =>
    set(() => {
      // In a real app we'd clear actual webview data here,
      // but for state we clear private tabs regardless of current mode flag
      // since this might be called *right before* disabling private mode.
      return {
        tabs: [{ id: Date.now().toString(), url: 'https://duckduckgo.com', title: 'New Tab' }],
        activeTabId: null, // Reset or setup default
      };
    }),
}));
