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
  background: '#050508',
  surface: '#0d0d14',
  surfaceAlt: '#111118',
  textPrimary: '#e2e2f0',
  textSecondary: '#8888aa',
  accent: '#22d3ee',
  accentSoft: '#a78bfa',
  border: '#1e1e2e',
  muted: '#4a4a6a',
  overlay: 'rgba(5, 5, 8, 0.72)',
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
