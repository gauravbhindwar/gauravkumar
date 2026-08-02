// Shared tuning knobs for every R3F canvas: keeps dpr/particle counts consistent
// and centralizes the theme -> hex color mapping (three.js materials can't read
// daisyUI's `hsl(var(--p))` CSS custom properties directly).

export const CANVAS_DPR = [1, 1.5]

export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

export const getParticleCount = (desktop, mobile) => (isMobileViewport() ? mobile : desktop)

// Mirrors the daisyUI theme colors defined in src/app/globals.css. Both the
// "dark" and "light" themes share the same accent palette, so a single map
// covers both; kept theme-keyed in case that changes.
const THEME_COLORS = {
  dark: {
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#06b6d4',
    success: '#10b981',
    info: '#6366f1',
    base: '#0b0a0e',
  },
  light: {
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#06b6d4',
    success: '#10b981',
    info: '#6366f1',
    base: '#faf9f6',
  },
}

export const getThemeColors = (theme) => THEME_COLORS[theme] || THEME_COLORS.light

export const hasWebGL = () => {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}
