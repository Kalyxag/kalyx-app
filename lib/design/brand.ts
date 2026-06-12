// ============================================================
// KALYX — White-Label Brand Theme (Laufzeit)
// ============================================================
// Macht die Akzentfarbe eines Mandanten plattformweit produktiv.
//
// Mechanik:
//   Die App definiert in globals.css abstrakte Marken-Variablen
//   (--kx-brand, --kx-brand-pale, --kx-brand-strong, ...). Default ist
//   KALYX-Grün. Setzt ein Mandant eine eigene Akzentfarbe, schreibt
//   applyBrandTheme() die abgeleiteten Varianten auf <html>, und JEDE
//   Stelle, die var(--kx-brand) bzw. die getheemten Konstanten nutzt,
//   übernimmt die Farbe automatisch (Buttons, Links, aktive Navigation,
//   Fortschrittsbalken, Fokus-Rahmen, Logo-Quadrat …).
//
// Ist keine gültige Farbe gesetzt, werden die Inline-Variablen wieder
// entfernt und die globals.css-Defaults (KALYX-Grün) greifen.
//
// Bewusst ohne Abhängigkeiten und ohne Datenbank — reine Farbmathematik.
// ============================================================

const HEX6 = /^#([0-9a-fA-F]{6})$/
const HEX3 = /^#([0-9a-fA-F]{3})$/

const BRAND_VARS = [
  '--kx-brand',
  '--kx-brand-strong',
  '--kx-brand-pale',
  '--kx-brand-light',
  '--kx-brand-contrast',
  '--kx-brand-glow',
  '--kx-brand-focus',
  '--kx-brand-active-bg',
  '--kx-brand-rgb',
] as const

type Rgb = { r: number; g: number; b: number }

/** Akzeptiert #RGB oder #RRGGBB (Gross-/Kleinschreibung egal). Sonst null. */
export function normalizeHex(input: string | null | undefined): string | null {
  if (!input) return null
  const s = input.trim()
  if (HEX6.test(s)) return s.toLowerCase()
  const m3 = s.match(HEX3)
  if (m3) {
    const [r, g, b] = m3[1].split('')
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return null
}

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function rgbToHex({ r, g, b }: Rgb): string {
  const to = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** Mischt Farbe in Richtung Weiss (amount 0..1 = Anteil Weiss). */
function mixWhite(c: Rgb, amount: number): Rgb {
  return {
    r: c.r + (255 - c.r) * amount,
    g: c.g + (255 - c.g) * amount,
    b: c.b + (255 - c.b) * amount,
  }
}

/** Mischt Farbe in Richtung Schwarz (amount 0..1 = Anteil Schwarz). */
function mixBlack(c: Rgb, amount: number): Rgb {
  return { r: c.r * (1 - amount), g: c.g * (1 - amount), b: c.b * (1 - amount) }
}

/** Relative Helligkeit (WCAG) zur Wahl von Kontrasttext. */
function luminance({ r, g, b }: Rgb): number {
  const ch = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)
}

/** Berechnet alle abgeleiteten Markenwerte aus einer Basisfarbe. */
export function deriveBrand(hex: string) {
  const base = hexToRgb(hex)
  const lum = luminance(base)
  // Heller Akzent → dunkler Text, dunkler Akzent → weisser Text.
  const contrast = lum > 0.55 ? '#0B1929' : '#FFFFFF'
  return {
    brand: rgbToHex(base),
    strong: rgbToHex(mixBlack(base, 0.16)),       // Hover / Druckzustand
    pale: rgbToHex(mixWhite(base, 0.9)),          // helle Tönung (Karten, aktive Tabs)
    light: rgbToHex(mixWhite(base, 0.45)),        // mittlere Tönung / Mint-Ersatz
    contrast,
    glow: `rgba(${base.r}, ${base.g}, ${base.b}, 0.28)`,      // Button-Schatten
    focus: `rgba(${base.r}, ${base.g}, ${base.b}, 0.14)`,     // Fokus-Ring
    activeBg: `rgba(${base.r}, ${base.g}, ${base.b}, 0.16)`,  // aktive Nav auf dunkel
    rgb: `${base.r} ${base.g} ${base.b}`,
  }
}

/**
 * Setzt die Markenfarbe plattformweit. Bei ungültiger/leerer Farbe wird
 * zurückgesetzt (KALYX-Grün aus globals.css greift dann wieder).
 */
export function applyBrandTheme(primary: string | null | undefined): boolean {
  if (typeof document === 'undefined') return false
  const root = document.documentElement
  const hex = normalizeHex(primary)
  if (!hex) {
    clearBrandTheme()
    return false
  }
  const d = deriveBrand(hex)
  root.style.setProperty('--kx-brand', d.brand)
  root.style.setProperty('--kx-brand-strong', d.strong)
  root.style.setProperty('--kx-brand-pale', d.pale)
  root.style.setProperty('--kx-brand-light', d.light)
  root.style.setProperty('--kx-brand-contrast', d.contrast)
  root.style.setProperty('--kx-brand-glow', d.glow)
  root.style.setProperty('--kx-brand-focus', d.focus)
  root.style.setProperty('--kx-brand-active-bg', d.activeBg)
  root.style.setProperty('--kx-brand-rgb', d.rgb)
  return true
}

/** Entfernt die Laufzeit-Überschreibungen → Defaults (KALYX-Grün). */
export function clearBrandTheme(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  for (const v of BRAND_VARS) root.style.removeProperty(v)
}
