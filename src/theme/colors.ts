export type AppThemeMode = 'light' | 'dark';

export type AppTheme = {
  background: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentSoft: string;
  border: string;
  muted: string;
  overlay: string;
};

export const darkTheme: AppTheme = {
  background: '#171613',
  surface: '#24221e',
  surfaceAlt: '#302d27',
  textPrimary: '#f5f0e8',
  textSecondary: '#b9b0a2',
  accent: '#e99555',
  accentSoft: '#f2bb80',
  border: '#484239',
  muted: '#8e8578',
  overlay: 'rgba(23, 22, 19, 0.72)',
};

export const lightTheme: AppTheme = {
  background: '#f4efe7',
  surface: '#fffdf8',
  surfaceAlt: '#ebe3d6',
  textPrimary: '#24211d',
  textSecondary: '#665e54',
  accent: '#c76535',
  accentSoft: '#e7a27b',
  border: '#d9cec0',
  muted: '#93887b',
  overlay: 'rgba(36, 33, 29, 0.48)',
};

export const colors = darkTheme;

export const getThemeColors = (mode: AppThemeMode) => (mode === 'dark' ? darkTheme : lightTheme);
