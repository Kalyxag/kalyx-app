// ============================================================
// KALYX — White-Label / Co-Branding: zentrale Helfer
// ============================================================
// Eine Quelle der Wahrheit für gebrandete Oberflächen (Arbeitsbereich,
// Zertifikat, öffentliche /verify-Seite). Modell: Co-Branding —
// Kundenmarke vorn, KALYX als dezentes, abschaltbares Prüfsiegel.
//
// Regeln:
//   * Branding wirkt nur, wenn das white_label-Add-on aktiv ist.
//   * KALYX-Prüfsiegel auf Nachweis/Verify ist standardmässig sichtbar
//     (Vertrauensanker) und nur bei aktivem White-Label abschaltbar.
//   * Logo-Auswahl je nach Hintergrund: dunkle Fläche → helles Logo,
//     helle Fläche → dunkles Logo. Fällt sauber auf logo_url zurück.

export interface BrandingRow {
  brand_name?: string | null
  logo_url?: string | null
  logo_dark_url?: string | null
  logo_light_url?: string | null
  favicon_url?: string | null
  primary_color?: string | null
  secondary_color?: string | null
  login_image_url?: string | null
  email_from_name?: string | null
  support_email?: string | null
  support_url?: string | null
  verify_show_kalyx?: boolean | null
  hide_kalyx_chrome?: boolean | null
  tagline?: string | null
}

export interface BrandView {
  hasWhiteLabel: boolean
  brandName: string | null
  primaryColor: string | null
  tagline: string | null
  // Logo passend zum Hintergrund
  logoFor: (background: 'light' | 'dark') => string | null
  faviconUrl: string | null
  loginImageUrl: string | null
  // Co-Branding-Steuerung (nur wirksam bei aktivem White-Label)
  showKalyxSeal: boolean
  hideKalyxChrome: boolean
  // Support-Angaben (nutzerseitig statt KALYX)
  supportEmail: string | null
  supportUrl: string | null
}

/**
 * Baut aus der branding-Zeile und dem Add-on-Status eine konsistente
 * Sicht. `hasWhiteLabel` entscheidet, ob die Anpassungen überhaupt greifen.
 */
export function buildBrandView(b: BrandingRow | null | undefined, hasWhiteLabel: boolean): BrandView {
  const row = b || {}
  const wl = !!hasWhiteLabel

  const logoFor = (background: 'light' | 'dark'): string | null => {
    if (!wl) return null
    if (background === 'dark') {
      return clean(row.logo_light_url) || clean(row.logo_url) || null
    }
    return clean(row.logo_dark_url) || clean(row.logo_url) || null
  }

  return {
    hasWhiteLabel: wl,
    brandName: wl ? (clean(row.brand_name) || null) : null,
    primaryColor: wl ? (clean(row.primary_color) || null) : null,
    tagline: wl ? (clean(row.tagline) || null) : null,
    logoFor,
    faviconUrl: wl ? (clean(row.favicon_url) || null) : null,
    loginImageUrl: wl ? (clean(row.login_image_url) || null) : null,
    // KALYX-Prüfsiegel auf Nachweis/Verify ist fester Vertrauensanker und
    // bewusst NICHT abschaltbar: Es garantiert die Echtheit gegenüber Dritten.
    showKalyxSeal: true,
    hideKalyxChrome: wl ? row.hide_kalyx_chrome === true : false,
    supportEmail: wl ? (clean(row.support_email) || null) : null,
    supportUrl: wl ? (clean(row.support_url) || null) : null,
  }
}

function clean(v: any): string {
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Text des KALYX-Prüfsiegels. Bewusst nüchtern und vertrauensbildend —
 * KALYX tritt als Echtheits-Garant auf, nicht als Werbung.
 */
export const KALYX_SEAL_TEXT = 'Verifiziert über KALYX'
export const KALYX_SEAL_SUB = 'Fälschungssicher geprüft'
