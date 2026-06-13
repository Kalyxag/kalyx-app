// ============================================================
// KALYX — KI-Budget: Kontingente und Verbrauchsprüfung
// ============================================================
// Eine Quelle der Wahrheit für "darf dieser Mandant noch KI nutzen?".
// Schützt zwei Dinge:
//   1. Die eigene Marge — ohne Limit könnte ein Mandant unbegrenzt
//      KI-Kurse generieren und die Token-Kosten ins Uferlose treiben.
//   2. Das Add-on 'ki_budget' — mit Add-on gilt ein höheres Kontingent.
//
// Bewusst im Code (nicht in der DB) gehalten, damit Kontingente ohne
// Migration anpassbar sind.

import { getAdminClient } from '@/lib/supabase/admin'

// Kostenloses Grundkontingent pro Monat (ohne Add-on).
export const FREI_KONTINGENT = 10
// Kontingent mit gebuchtem 'ki_budget'-Add-on.
export const BUDGET_KONTINGENT = 100

export type BudgetCheck =
  | { ok: true; verbleibend: number; kontingent: number }
  | { ok: false; status: number; error: string; kontingent: number }

/** Aktueller Monat als 'YYYY-MM' (UTC, stabil über Zeitzonen). */
export function aktuellerMonat(d = new Date()): string {
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0')
}

/**
 * Prüft, ob der Mandant im aktuellen Monat noch KI nutzen darf.
 * Zählt NICHT hoch — nur Lesen. Das Hochzählen macht verbrauche()
 * NACH erfolgreicher Generierung.
 *
 * @param tenantId  Mandant
 * @param hatBudget ob das 'ki_budget'-Add-on aktiv ist
 */
export async function pruefeBudget(tenantId: string | null | undefined, hatBudget: boolean): Promise<BudgetCheck> {
  const kontingent = hatBudget ? BUDGET_KONTINGENT : FREI_KONTINGENT
  if (!tenantId) {
    // Kein Mandantenbezug: vorsichtshalber das freie Kontingent annehmen,
    // aber nicht blockieren (z. B. interne Tests). Verbrauch wird nicht gezählt.
    return { ok: true, verbleibend: kontingent, kontingent }
  }
  try {
    const admin = getAdminClient()
    const { data } = await admin
      .from('ki_usage')
      .select('anzahl')
      .eq('tenant_id', tenantId)
      .eq('monat', aktuellerMonat())
      .maybeSingle()
    const verbraucht = (data as any)?.anzahl || 0
    const verbleibend = Math.max(kontingent - verbraucht, 0)
    if (verbleibend <= 0) {
      return {
        ok: false,
        status: 402,
        kontingent,
        error: hatBudget
          ? 'Das monatliche KI-Kontingent ist aufgebraucht. Es erneuert sich zu Monatsbeginn.'
          : 'Das kostenlose KI-Kontingent für diesen Monat ist aufgebraucht. Mit dem Add-on „KI-Kursbudget“ steht ein deutlich höheres Kontingent bereit.',
      }
    }
    return { ok: true, verbleibend, kontingent }
  } catch {
    // Im Fehlerfall NICHT blockieren — eine kaputte Zählung darf die
    // Kernfunktion nicht lahmlegen. Lieber durchlassen als Kunden aussperren.
    return { ok: true, verbleibend: kontingent, kontingent }
  }
}

/**
 * Zählt eine erfolgreiche KI-Generierung hoch (atomar per RPC).
 * Wird NACH der Generierung aufgerufen, niemals davor — sonst zählt auch
 * ein fehlgeschlagener Aufruf gegen das Kontingent.
 */
export async function verbrauche(tenantId: string | null | undefined): Promise<void> {
  if (!tenantId) return
  try {
    const admin = getAdminClient()
    await admin.rpc('ki_usage_inc', { p_tenant: tenantId, p_monat: aktuellerMonat() })
  } catch {
    // Zählfehler dürfen den Request nie stören.
  }
}
