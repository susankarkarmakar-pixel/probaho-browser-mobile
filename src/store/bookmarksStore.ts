import { create } from 'zustand';

export interface BookmarkFolder {
  id: string;
  name: string;
  icon: string;
  itemCount: number;
  itemText: string;
  color: string;
  backgroundColor: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  domain: string;
  iconType?: 'github' | 'youtube' | 'globe';
}

interface BookmarksState {
  folders: BookmarkFolder[];
  recentBookmarks: Bookmark[];
}

export const useBookmarksStore = create<BookmarksState>(() => ({
  folders: [
    {
      id: '1',
      name: 'Mobile Bookmarks',
      icon: 'phone-portrait-outline',
      itemCount: 24,
      itemText: '24 items',
      color: '#D3BBFF',
      backgroundColor: '#2A1F45',
    },
    {
      id: '2',
      name: 'Reading List',
      icon: 'book-outline',
      itemCount: 5,
      itemText: '5 unread',
      color: '#FFB4AB',
      backgroundColor: '#3E2421',
    },
    {
      id: '3',
      name: 'Work',
      icon: 'briefcase-outline',
      itemCount: 12,
      itemText: '12 items',
      color: '#4CD7F6',
      backgroundColor: '#193946',
    },
  ],
  recentBookmarks: [
    {
      id: 'b1',
      title: 'GitHub - Build software be...',
      url: 'https://github.com',
      domain: 'github.com',
      iconType: 'github',
    },
    {
      id: 'b2',
      title: 'YouTube',
      url: 'https://youtube.com',
      domain: 'youtube.com',
      iconType: 'youtube',
    },
    {
      id: 'b3',
      title: 'Tailwind CSS - Rapidly buil...',
      url: 'https://tailwindcss.com',
      domain: 'tailwindcss.com',
      iconType: 'globe',
    },
  ],
}));
