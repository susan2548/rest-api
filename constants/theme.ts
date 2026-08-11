/**
 * Black & Gold theme shared across the app.
 */

export const colors = {
  // Layered blacks — background sits lowest, surfaceElevated highest.
  background: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1E1E1E',
  surfaceAlt: '#201B12',

  border: 'rgba(212, 175, 55, 0.16)',
  borderStrong: 'rgba(212, 175, 55, 0.5)',

  gold: '#D4AF37',
  goldBright: '#FFD700',
  goldDeep: '#B8860B',
  goldMuted: '#8A7226',
  goldGlow: 'rgba(212, 175, 55, 0.45)',
  goldWash: 'rgba(212, 175, 55, 0.12)',

  platinum: '#D6D6D6',
  platinumMuted: '#8A8A8A',
  platinumGlow: 'rgba(214, 214, 214, 0.35)',
  platinumWash: 'rgba(214, 214, 214, 0.10)',

  text: '#F5E9C8',
  textMuted: '#B8A66A',
  textDim: '#7A7263',

  white: '#FFFFFF',
  black: '#000000',

  success: '#4CAF50',
  danger: '#E5484D',
  dangerMuted: '#5C2323',
  dangerWash: 'rgba(229, 72, 77, 0.12)',
  overlay: 'rgba(0, 0, 0, 0.7)',
} as const;

/** Gradient stops for LinearGradient — bright to deep, used on buttons, avatars, FAB, header. */
export const gradients = {
  gold: ['#F4D35E', '#D4AF37', '#B8860B'] as [string, string, string],
  goldSubtle: ['rgba(212, 175, 55, 0.28)', 'rgba(212, 175, 55, 0)'] as [string, string],
  platinum: ['#F2F2F2', '#D6D6D6', '#9C9C9C'] as [string, string, string],
  header: ['#1E1E1E', '#141414'] as [string, string],
  surface: ['#1E1E1E', '#141414'] as [string, string],
} as const;

/** Accent per student section, layered on top of the gold/black base. */
export const sectionColors = {
  CED: {
    accent: colors.gold,
    accentBright: colors.goldBright,
    wash: colors.goldWash,
    glow: colors.goldGlow,
    gradient: gradients.gold,
  },
  TCT: {
    accent: colors.platinum,
    accentBright: colors.white,
    wash: colors.platinumWash,
    glow: colors.platinumGlow,
    gradient: gradients.platinum,
  },
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 30,
    fontWeight: '800' as const,
    color: colors.goldBright,
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: colors.goldBright,
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textMuted,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    color: colors.text,
  },
  label: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: colors.gold,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: colors.textDim,
  },
} as const;

export const shadow = {
  /** Soft ambient lift for cards and surfaces. */
  card: {
    boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.5)',
    elevation: 4,
  },
  /** Warm gold glow for primary actions (FAB, primary button, avatar). */
  gold: {
    boxShadow: '0px 4px 16px rgba(212, 175, 55, 0.35)',
    elevation: 6,
  },
  goldStrong: {
    boxShadow: '0px 6px 22px rgba(212, 175, 55, 0.55)',
    elevation: 10,
  },
} as const;

export const theme = { colors, gradients, sectionColors, spacing, radius, typography, shadow } as const;

export default theme;
