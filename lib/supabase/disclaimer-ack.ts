// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: lib/supabase/disclaimer-ack.ts
// ============================================================
// Helper für Disclaimer-Acknowledgements gegen die Supabase-
// Tabelle course_disclaimer_acks.
// ============================================================

import { supabase } from '@/lib/supabase/client'
import type { DisclaimerLevel } from '@/types/disclaimer'

/**
 * Prüft, ob ein User die aktuelle Version eines Kurses
 * bereits bestätigt hat.
 *
 * Bei Versions-Erhöhung des Kurses gibt diese Funktion
 * automatisch `false` zurück — das Modal wird erneut gezeigt.
 */
export async function hasAcknowledgedDisclaimer(params: {
  userId:        string
  courseId:      string
  courseVersion: string
}): Promise<boolean> {
  const { userId, courseId, courseVersion } = params

  const { data, error } = await supabase
    .from('course_disclaimer_acks')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('course_version', courseVersion)
    .maybeSingle()

  if (error) {
    // Fehler nicht verschlucken, aber Modal zur Sicherheit zeigen
    console.warn('[disclaimer-ack] Lookup fehlgeschlagen:', error.message)
    return false
  }
  return !!data
}

/**
 * Speichert eine Disclaimer-Bestätigung.
 * Wird beim Klick auf "Verstanden & Fortfahren" aufgerufen.
 */
export async function acknowledgeDisclaimer(params: {
  userId:           string
  tenantId:         string
  courseId:         string
  courseVersion:    string
  disclaimerLevel:  DisclaimerLevel
}): Promise<{ ok: boolean; error?: string }> {
  const { userId, tenantId, courseId, courseVersion, disclaimerLevel } = params

  // User-Agent erfassen (Browser-seitig)
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null

  const { error } = await supabase
    .from('course_disclaimer_acks')
    .insert({
      user_id:          userId,
      tenant_id:        tenantId,
      course_id:        courseId,
      course_version:   courseVersion,
      disclaimer_level: disclaimerLevel,
      user_agent:       userAgent,
      // ip_address wird serverseitig durch Supabase nicht gesetzt;
      // optional in Phase 2 über eine Edge Function nachrüsten.
    })

  if (error) {
    // Falls UNIQUE-Verletzung: User hat schon bestätigt — OK
    if (error.code === '23505') return { ok: true }
    return { ok: false, error: error.message }
  }
  return { ok: true }
}
