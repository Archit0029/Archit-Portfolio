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
  background: '#07111f',
  surface: '#0f1b2c',
  surfaceAlt: '#13233a',
  textPrimary: '#f5f7fb',
  textSecondary: '#9fb0cb',
  accent: '#4cc9f0',
  accentSoft: '#7bdff2',
  border: '#233247',
  muted: '#7d8da7',
  overlay: 'rgba(7, 17, 31, 0.65)',
};

export const lightTheme: AppTheme = {
  background: '#f4f7fb',
  surface: '#ffffff',
  surfaceAlt: '#eef4ff',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  accent: '#3b82f6',
  accentSoft: '#93c5fd',
  border: '#dbe6f2',
  muted: '#64748b',
  overlay: 'rgba(15, 23, 42, 0.4)',
};

export const colors = darkTheme;

export const getThemeColors = (mode: AppThemeMode) => (mode === 'dark' ? darkTheme : lightTheme);
