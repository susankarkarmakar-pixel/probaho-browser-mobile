import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { appStorage } from '../storage/appStorage';

export interface LibraryEntry {
  id: string;
  url: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface DownloadItem {
  id: string;
  url: string;
  filename: string;
  status: 'queued' | 'downloading' | 'complete' | 'failed';
  progress: number;
  createdAt: number;
  updatedAt: number;
}

interface LibraryState {
  bookmarks: LibraryEntry[];
  history: LibraryEntry[];
  downloads: DownloadItem[];
  readingList: LibraryEntry[];
  isHydrated: boolean;
  addBookmark: (entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (url: string) => void;
  addHistory: (entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  clearHistory: () => void;
  addReadingList: (entry: Omit<LibraryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeReadingList: (url: string) => void;
  addDownload: (item: Omit<DownloadItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDownload: (id: string, updates: Partial<DownloadItem>) => void;
  clearPrivateData: () => void;
  setHydrated: (value: boolean) => void;
}

const MAX_HISTORY = 200;
const MAX_BOOKMARKS = 100;
const MAX_READING_LIST = 100;
const MAX_DOWNLOADS = 100;

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const normalizeEntry = (entry: Partial<LibraryEntry>, index: number): LibraryEntry => ({
  id: typeof entry.id === 'string' && entry.id.length > 0 ? entry.id : `entry-${index}`,
  url: typeof entry.url === 'string' ? entry.url : '',
  title: typeof entry.title === 'string' ? entry.title : 'Untitled page',
  createdAt: Number.isFinite(entry.createdAt) ? Number(entry.createdAt) : Date.now(),
  updatedAt: Number.isFinite(entry.updatedAt) ? Number(entry.updatedAt) : Date.now(),
});

const defaultState = {
  bookmarks: [] as LibraryEntry[],
  history: [] as LibraryEntry[],
  downloads: [] as DownloadItem[],
  readingList: [] as LibraryEntry[],
  isHydrated: false,
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      ...defaultState,
      addBookmark: (entry) =>
        set((state) => {
          const now = Date.now();
          const existing = state.bookmarks.find((item) => item.url === entry.url);
          const next = existing
            ? state.bookmarks.map((item) =>
                item.url === entry.url ? { ...item, title: entry.title, updatedAt: now } : item,
              )
            : [
                {
                  ...entry,
                  id: createId('bookmark'),
                  createdAt: now,
                  updatedAt: now,
                },
                ...state.bookmarks,
              ];
          return { bookmarks: next.slice(0, MAX_BOOKMARKS) };
        }),
      removeBookmark: (url) =>
        set((state) => ({ bookmarks: state.bookmarks.filter((item) => item.url !== url) })),
      addHistory: (entry) =>
        set((state) => {
          const now = Date.now();
          const withoutDuplicate = state.history.filter((item) => item.url !== entry.url);
          return {
            history: [
              { ...entry, id: createId('history'), createdAt: now, updatedAt: now },
              ...withoutDuplicate,
            ].slice(0, MAX_HISTORY),
          };
        }),
      clearHistory: () => set({ history: [] }),
      addReadingList: (entry) =>
        set((state) => {
          const now = Date.now();
          if (state.readingList.some((item) => item.url === entry.url)) return state;
          return {
            readingList: [
              { ...entry, id: createId('reading'), createdAt: now, updatedAt: now },
              ...state.readingList,
            ].slice(0, MAX_READING_LIST),
          };
        }),
      removeReadingList: (url) =>
        set((state) => ({ readingList: state.readingList.filter((item) => item.url !== url) })),
      addDownload: (item) =>
        set((state) => ({
          downloads: [
            {
              ...item,
              id: createId('download'),
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            ...state.downloads,
          ].slice(0, MAX_DOWNLOADS),
        })),
      updateDownload: (id, updates) =>
        set((state) => ({
          downloads: state.downloads.map((item) =>
            item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item,
          ),
        })),
      clearPrivateData: () => set({ history: [] }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'probaho-library-v1',
      storage: appStorage,
      version: 1,
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        history: state.history,
        downloads: state.downloads,
        readingList: state.readingList,
      }),
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<LibraryState> | undefined;
        return {
          bookmarks: Array.isArray(persisted?.bookmarks)
            ? persisted.bookmarks
                .map(normalizeEntry)
                .filter((entry) => entry.url)
                .slice(0, MAX_BOOKMARKS)
            : [],
          history: Array.isArray(persisted?.history)
            ? persisted.history
                .map(normalizeEntry)
                .filter((entry) => entry.url)
                .slice(0, MAX_HISTORY)
            : [],
          downloads: Array.isArray(persisted?.downloads)
            ? persisted.downloads.slice(0, MAX_DOWNLOADS)
            : [],
          readingList: Array.isArray(persisted?.readingList)
            ? persisted.readingList
                .map(normalizeEntry)
                .filter((entry) => entry.url)
                .slice(0, MAX_READING_LIST)
            : [],
          isHydrated: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
