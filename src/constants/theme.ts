export const COLORS = {
  background: '#15121B',
  backgroundRaised: '#1D1A24',
  surface: '#221E28',
  surfaceHigh: '#2C2833',
  surfaceHighest: '#37333E',
  surfaceMuted: '#100D16',
  primary: '#D3BBFF',
  primaryStrong: '#7C3AED',
  primaryContainer: '#6D28D9',
  secondary: '#4CD7F6',
  secondaryContainer: '#123947',
  text: '#E8E0EE',
  textMuted: '#CCC3D7',
  textSubtle: '#958DA1',
  border: '#4A4455',
  borderSoft: 'rgba(232, 224, 238, 0.12)',
  danger: '#FFB4AB',
  dangerContainer: '#542323',
  success: '#91E4B2',
  warning: '#FFB68B',
  privateBackground: '#100D16',
  privateSurface: '#1C1628',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const TYPOGRAPHY = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: '700' as const, letterSpacing: -0.68 },
  largeTitleMobile: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.56,
  },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '600' as const, letterSpacing: -0.24 },
  headline: { fontSize: 20, lineHeight: 25, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: '500' as const },
  subhead: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const },
  footnote: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  caption: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const, letterSpacing: 0.11 },
  tabLabel: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const RADII = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  sheet: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 12,
  },
};
export const QUICK_LINKS = [
  { label: 'Web', icon: 'globe-outline' as const, query: '' },
  { label: 'Media', icon: 'play-circle-outline' as const, query: 'media' },
  { label: 'Shop', icon: 'bag-handle-outline' as const, query: 'shopping' },
  { label: 'News', icon: 'newspaper-outline' as const, query: 'news' },
  { label: 'Mail', icon: 'mail-outline' as const, query: 'mail' },
  { label: 'Maps', icon: 'map-outline' as const, query: 'maps' },
  { label: 'Drive', icon: 'cloud-outline' as const, query: 'drive' },
];
export const SEARCH_ENGINE_URL = 'https://duckduckgo.com';
