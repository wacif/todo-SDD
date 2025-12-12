/**
 * Design System Spacing Tokens
 * Consistent spacing scale for margins, padding, gaps
 */

export const spacing = {
  xs: 'var(--spacing-xs)',    // 4px
  sm: 'var(--spacing-sm)',    // 8px
  md: 'var(--spacing-md)',    // 16px
  lg: 'var(--spacing-lg)',    // 24px
  xl: 'var(--spacing-xl)',    // 32px
  '2xl': 'var(--spacing-2xl)', // 48px
  '3xl': 'var(--spacing-3xl)', // 64px
} as const

/**
 * Spacing values in rem for cases where CSS variables can't be used
 */
export const spacingValues = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const

/**
 * Border radius scale
 */
export const radius = {
  sm: 'var(--radius-sm)',  // 4px
  md: 'var(--radius-md)',  // 8px
  lg: 'var(--radius-lg)',  // 12px
  xl: 'var(--radius-xl)',  // 16px
  full: '9999px',          // Pill shape
} as const

/**
 * Box shadow scale
 */
export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  none: 'none',
} as const

/**
 * Z-index scale for layering
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
} as const

export type Spacing = keyof typeof spacing
export type Radius = keyof typeof radius
export type Shadow = keyof typeof shadows
export type ZIndex = keyof typeof zIndex
