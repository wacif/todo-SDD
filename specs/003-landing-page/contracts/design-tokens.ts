/**
 * Design Token Contracts
 * 
 * TypeScript definitions for design system tokens (colors, typography, spacing, etc.)
 */

// ============================================================================
// Color System
// ============================================================================

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

export interface ColorPalette {
  primary: ColorScale
  neutral: ColorScale
  success: ColorScale
  error: ColorScale
  warning: ColorScale
  info: ColorScale
}

export interface SemanticColors {
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  ring: string
}

// ============================================================================
// Typography System
// ============================================================================

export interface FontFamily {
  sans: string[]
  mono: string[]
}

export interface FontSize {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
  '6xl': string
}

export interface FontWeight {
  normal: number
  medium: number
  semibold: number
  bold: number
}

export interface LineHeight {
  tight: number
  normal: number
  relaxed: number
}

export interface Typography {
  fontFamily: FontFamily
  fontSize: FontSize
  fontWeight: FontWeight
  lineHeight: LineHeight
}

// ============================================================================
// Spacing System
// ============================================================================

export interface SpacingScale {
  0: string
  0.5: string
  1: string
  2: string
  3: string
  4: string
  5: string
  6: string
  8: string
  10: string
  12: string
  16: string
  20: string
  24: string
  32: string
}

// ============================================================================
// Shadow System
// ============================================================================

export interface BoxShadow {
  soft: string
  medium: string
  strong: string
  none: string
}

// ============================================================================
// Border Radius
// ============================================================================

export interface BorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  full: string
}

// ============================================================================
// Complete Design Tokens
// ============================================================================

export interface DesignTokens {
  colors: ColorPalette
  semanticColors: SemanticColors
  typography: Typography
  spacing: SpacingScale
  shadow: BoxShadow
  borderRadius: BorderRadius
}

// ============================================================================
// Theme Definition
// ============================================================================

export type ThemeMode = 'light' | 'dark'

export interface Theme {
  mode: ThemeMode
  tokens: DesignTokens
}
