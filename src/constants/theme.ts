export const COLORS = {
  primary: '#D3BBFF', // Lavender
  secondary: '#4CD7F6', // Cyan (for active/secure states)
  background: {
    main: '#15121B', // Deep purple-black
    surface1: '#1D1A24',
    surface2: '#221E28',
    surface3: '#2C2833',
    light: '#FFFFFF',
    dark: '#15121B',
  },
  text: {
    primary: '#E8E0EE',
    secondary: '#CCC3D7',
    light: '#000000',
    dark: '#E8E0EE',
  },
  privateBackground: '#1D1A24',
  privateText: '#E8E0EE',
  border: '#2C2833',
  darkBorder: '#2C2833',
  omnibox: {
    main: '#221E28',
    light: '#F2F2F7',
    dark: '#221E28',
  },
  danger: '#FFB4AB', // Coral
  success: '#4CD7F6',
  inactiveText: '#CCC3D7',
};

export const GEOMETRY = {
  radius: {
    controls: 8,
    cards: 12,
    containers: 16,
    omnibox: 24,
  },
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
