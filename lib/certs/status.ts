// ============================================================
// KALYX — Zertifikats-Status: Ablauf und Rezertifizierung
// ============================================================
// Eine einzige Quelle der Wahrheit für "ist dieser Nachweis aktuell?".
// Wird von Zertifikatsseite, /verify, Open Badge und API genutzt, damit
// alle Stellen denselben Status zeigen.

export type CertStatus = 'gueltig' | 'laeuft_bald_ab' | 'abgelaufen' | 'widerrufen'

export const STATUS_LABEL: Record<CertStatus, string> = {
  gueltig: 'Gültig',
  laeuft_bald_ab: 'Läuft bald ab',
  abgelaufen: 'Abgelaufen',
  widerrufen: 'Widerrufen',
}

// Vorwarnfenster vor Ablauf
export const WARN_TAGE = 30

/** Monate je Rezertifizierungs-Intervall. null = kein Ablauf. */
export function intervalMonate(interval?: string | null): number | null {
  switch (interval) {
    case 'jaehrlich': return 12
    case 'halbjaehrlich': return 6
    case 'alle 2 Jahre': return 24
    case 'keine': return null
    default: return null
  }
}

/** Ablaufdatum aus Ausstelldatum + Intervall. null = läuft nie ab. */
export function ablaufDatum(issuedAtISO: string, interval?: string | null): string | null {
  const m = intervalMonate(interval)
  if (m == null) return null
  const d = new Date(issuedAtISO)
  if (isNaN(d.getTime())) return null
  d.setMonth(d.getMonth() + m)
  return d.toISOString()
}

/**
 * Effektiver Status zur Laufzeit.
 * widerrufen hat Vorrang; danach entscheidet expires_at.
 */
export function effektiverStatus(opts: {
  status?: string | null
  expires_at?: string | null
  now?: Date
}): CertStatus {
  const now = opts.now || new Date()
  if (opts.status === 'widerrufen') return 'widerrufen'
  if (!opts.expires_at) return 'gueltig'
  const exp = new Date(opts.expires_at)
  if (isNaN(exp.getTime())) return 'gueltig'
  if (now >= exp) return 'abgelaufen'
  const warnAb = new Date(exp)
  warnAb.setDate(warnAb.getDate() - WARN_TAGE)
  if (now >= warnAb) return 'laeuft_bald_ab'
  return 'gueltig'
}

/** Tage bis zum Ablauf (negativ = bereits abgelaufen). null = kein Ablauf. */
export function tageBisAblauf(expires_at?: string | null, now?: Date): number | null {
  if (!expires_at) return null
  const exp = new Date(expires_at)
  if (isNaN(exp.getTime())) return null
  const ms = exp.getTime() - (now || new Date()).getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

/** Gilt der Nachweis als aktuell anerkennbar? (gültig oder läuft bald ab) */
export function istAktuell(s: CertStatus): boolean {
  return s === 'gueltig' || s === 'laeuft_bald_ab'
}
