// ============================================================
// KALYX — REST-API v1: Schlüssel-Erzeugung und -Prüfung
// ============================================================
// Schlüsselformat: kalyx_<43 Zeichen base64url> (256 Bit Zufall).
// In der Datenbank liegt nur der SHA-256-Hash; der Klartext wird
// genau einmal bei der Erstellung angezeigt.
// Jeder Schlüssel gehört zu genau einem Mandanten und sieht
// ausschliesslich dessen Daten.

import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'

export const API_CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type',
}

export function apiJson(obj: any, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...API_CORS },
  })
}

const KEY_RE = /^kalyx_[A-Za-z0-9_-]{43}$/

export function neuerSchluessel(): { key: string; hash: string; prefix: string; last4: string } {
  const key = 'kalyx_' + crypto.randomBytes(32).toString('base64url')
  return { key, hash: hasheSchluessel(key), prefix: key.slice(0, 12), last4: key.slice(-4) }
}

export function hasheSchluessel(key: string): string {
  return crypto.createHash('sha256').update(key, 'utf8').digest('hex')
}

export function gueltigesFormat(key: string): boolean {
  return KEY_RE.test(key)
}

export type ApiAuth =
  | { ok: true; tenant_id: string; key_id: string; key_name: string }
  | { ok: false; status: number; error: string }

/**
 * Prüft den Bearer-Schlüssel eines v1-Requests.
 * Fehlermeldungen verraten bewusst nicht, ob ein Schlüssel existiert,
 * widerrufen oder falsch ist — nach aussen ist alles "ungültig".
 */
export async function pruefeApiKey(req: Request): Promise<ApiAuth> {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer\s+(\S+)$/i)
  if (!m) return { ok: false, status: 401, error: 'Kein API-Schlüssel. Erwartet: Authorization: Bearer kalyx_…' }
  const key = m[1]
  if (!gueltigesFormat(key)) return { ok: false, status: 401, error: 'Ungültiger API-Schlüssel.' }

  try {
    const admin = getAdminClient()
    const { data } = await admin
      .from('api_keys')
      .select('id,tenant_id,name,revoked_at')
      .eq('key_hash', hasheSchluessel(key))
      .maybeSingle()

    if (!data || (data as any).revoked_at) return { ok: false, status: 401, error: 'Ungültiger API-Schlüssel.' }

    // Add-on-Gate: Die REST-API ist ein kostenpflichtiges Add-on ('api').
    // Ohne gebuchtes Add-on wird der Zugriff verweigert (402), auch wenn der
    // Schlüssel technisch gültig ist. So ist die Verrechnung im Code verankert.
    const tid = (data as any).tenant_id
    try {
      const { data: ten } = await admin.from('tenants').select('addons').eq('id', tid).maybeSingle()
      const addons = (ten as any)?.addons || []
      if (!Array.isArray(addons) || !addons.includes('api')) {
        return { ok: false, status: 402, error: 'Die API-Anbindung ist für diesen Mandanten nicht aktiv. Bitte das Add-on „API-Anbindung“ buchen.' }
      }
    } catch {
      return { ok: false, status: 500, error: 'Prüfung nicht möglich.' }
    }

    // "Zuletzt benutzt" pflegen — Fehler hier dürfen den Request nie stören.
    admin.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', (data as any).id)
      .then(() => {}, () => {})

    return { ok: true, tenant_id: tid, key_id: (data as any).id, key_name: (data as any).name }
  } catch {
    return { ok: false, status: 500, error: 'Prüfung nicht möglich.' }
  }
}

/** Begrenzte, defensive Pagination aus Query-Parametern. */
export function pagination(req: Request): { limit: number; offset: number } {
  const u = new URL(req.url)
  const limit = Math.min(Math.max(parseInt(u.searchParams.get('limit') || '500', 10) || 500, 1), 1000)
  const offset = Math.max(parseInt(u.searchParams.get('offset') || '0', 10) || 0, 0)
  return { limit, offset }
}
