import { ColorScheme } from '../types';

export const lightColors: ColorScheme = {
  background: '#F0F4FF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#1A237E',
  accent: '#FF6D00',
  text: '#0D0D0D',
  textSecondary: '#555F7A',
  border: '#DDE3F0',
  danger: '#D32F2F',
  success: '#2E7D32',
  tabBar: '#FFFFFF',
  tabBarBorder: '#DDE3F0',
};

export const darkColors: ColorScheme = {
  background: '#080C1A',
  surface: '#0F1729',
  card: '#131D35',
  primary: '#7986CB',
  accent: '#FF8F00',
  text: '#E8EAF6',
  textSecondary: '#8F9BBF',
  border: '#1E2D4D',
  danger: '#EF5350',
  success: '#66BB6A',
  tabBar: '#0F1729',
  tabBarBorder: '#1E2D4D',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  h4: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8 },
};
