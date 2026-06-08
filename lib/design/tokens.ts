// ============================================================
// KALYX — Design Tokens (Single Source of Truth)
// ============================================================
// Diese Datei ist die eine Wahrheit für alle visuellen Konstanten.
// Heute in jeder Komponente dupliziert (NAVY='#0B1929' etc.) —
// ab sofort: hier ändern, überall greift.
//
// Verwendung:
//   import { tokens } from '@/lib/design/tokens'
//   <div style={{ color: tokens.color.navy }}>...</div>
//
// Oder besser via Tailwind:
//   <div className="text-kx-navy bg-kx-cream">...</div>
//   (Tailwind-Klassen kommen aus tailwind.config.ts, die diese Datei liest)
//
// Oder via CSS-Variable im globals.css:
//   color: var(--kx-navy);
// ============================================================

export const tokens = {
  // ---------- Farben ----------
  color: {
    // Marke (KALYX CI)
    navy: '#0B1929',
    green: '#14613E',
    gold: '#B8904A',
    cream: '#F5F4EF',

    // Tinten / Hellvarianten
    greenPale: '#E6F0EB',
    greenLight: '#7FD4A8',
    goldPale: '#F8F1E4',
    navyElev: '#162338', // erhöhte Fläche im Dark Mode

    // Semantische Statusfarben
    success: '#28C840',
    warning: '#E5A33A',
    danger: '#E5484D',
    info: '#3B8BD4',

    // Neutrale Töne
    line: '#E4E0D8',
    lineLight: '#EDEAE2',
    grayDark: '#3D3D3A',
    gray: '#6B7280',
    grayLight: '#9CA3AF',
    grayPale: '#D1D5DB',
    white: '#FFFFFF',
    black: '#000000',

    // Dark Mode (vorbereitend — wird Welle 2 voll ausgenutzt)
    darkBg: '#0B1929',
    darkBgElev: '#162338',
    darkText: 'rgba(255, 255, 255, 0.85)',
    darkTextMuted: 'rgba(255, 255, 255, 0.55)',
    darkTextSubtle: 'rgba(255, 255, 255, 0.40)',
    darkBorder: 'rgba(255, 255, 255, 0.07)',
    darkBorderStrong: 'rgba(255, 255, 255, 0.14)',
  },

  // ---------- Typografie ----------
  font: {
    serif: '"Cormorant", Georgia, "Times New Roman", serif',
    sans: '"Albert Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
    mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, "Cascadia Code", monospace',
  },

  fontSize: {
    xs: '11px',     // mono eyebrows, Status-Chips
    sm: '12px',     // Hilfstexte
    base: '13px',   // Sekundärtext
    md: '14px',     // Standardgrösse Body
    lg: '16px',     // hervorgehobene Stellen
    xl: '18px',     // H4
    '2xl': '22px',  // H3
    '3xl': '28px',  // H2
    '4xl': '34px',  // H1 / Hero-Zahlen
    display: '48px',// Display
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  letterSpacing: {
    tight: '-0.01em',
    normal: '0',
    wide: '0.04em',
    wider: '0.08em',
    widest: '0.14em',
    eyebrow: '0.18em', // für Eyebrow-Labels (UPPERCASE GOLD-Texte)
  },

  lineHeight: {
    none: 1,
    tight: 1.2,
    snug: 1.4,
    normal: 1.55,
    relaxed: 1.7,
  },

  // ---------- Spacing-Skala (4px Basis) ----------
  space: {
    0: '0',
    px: '1px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
  },

  // ---------- Border Radius ----------
  radius: {
    none: '0',
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '20px',
    pill: '999px',
  },

  // ---------- Schatten ----------
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,.03)',
    md: '0 1px 2px rgba(0,0,0,.03), 0 10px 28px rgba(0,0,0,.05)',
    lg: '0 14px 34px rgba(0,0,0,.10)',
    xl: '0 20px 50px rgba(0,0,0,.15)',
    btnPrimaryHover: '0 10px 24px rgba(20,97,62,.28)',
    focus: '0 0 0 3px rgba(20,97,62,.12)',
  },

  // ---------- Animation ----------
  duration: {
    fast: '120ms',
    base: '150ms',
    slow: '250ms',
    slower: '400ms',
    bar: '600ms',
  },

  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    linear: 'linear',
  },

  // ---------- Layout ----------
  layout: {
    sidebarWidth: '248px',
    headerHeight: '52px',
    contentMaxWidth: '1280px',
    mobileBreak: '860px',
    formFieldHeight: '42px',
  },

  // ---------- Z-Index-Skala ----------
  z: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    modal: 30,
    toast: 40,
    tooltip: 50,
  },
} as const

export type Tokens = typeof tokens

// ---------- Convenience-Exporte (Kurzschreibweisen) ----------
// Damit alter Code, der bisher NAVY/GREEN/GOLD/CREAM lokal definiert hat,
// mit minimaler Änderung migriert werden kann.
export const NAVY = tokens.color.navy
export const GREEN = tokens.color.green
export const GOLD = tokens.color.gold
export const CREAM = tokens.color.cream
export const GREEN_PALE = tokens.color.greenPale
export const LINE = tokens.color.line
export const GRAY = tokens.color.gray
export const FH = tokens.font.serif
export const FB = tokens.font.sans
export const FM = tokens.font.mono
