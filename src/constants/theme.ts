export const COLORS = {
  primary: '#007AFF',
  background: {
    light: '#FFFFFF',
    dark: '#1C1C1E',
  },
  text: {
    light: '#000000',
    dark: '#FFFFFF',
  },
  privateBackground: '#2C2C2E', // Darker background for private mode
  privateText: '#E5E5EA',
  border: '#C6C6C8',
  darkBorder: '#38383A',
  omnibox: {
    light: '#F2F2F7',
    dark: '#2C2C2E',
  },
  danger: '#FF3B30',
  success: '#34C759',
  inactiveText: '#8E8E93',
};

export const TYPOGRAPHY = {
  header: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
  },
};
