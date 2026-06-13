// ============================================================
// KALYX — Open Badges v2: gemeinsame Helfer
// ============================================================
// Grundlagen für die öffentlichen Badge-Endpoints (Issuer, BadgeClass,
// Assertion, Bild). Open Badges v2 mit "hosted verification": die
// Echtheit eines Badges wird geprüft, indem der Prüfer die hier
// gehosteten JSON-Dokumente abruft.
//
// Datenschutz (Credo "Wir schützen, was wächst"):
// Assertions sind öffentlich. Die Identität der Person steht darin
// NIE im Klartext, sondern als gesalzener SHA-256-Hash, wie es die
// Open-Badges-Spezifikation für geschützte Identitäten vorsieht.
// Ein Prüfer, der die E-Mail kennt, kann sie bestätigen — auslesen
// kann sie niemand.
// ============================================================

import crypto from 'crypto'

export const OB_CONTEXT = 'https://w3id.org/openbadges/v2'

/** Basis-URL der laufenden Instanz aus dem Request ableiten (Proxy-bewusst). */
export function baseUrl(req: Request): string {
  const u = new URL(req.url)
  const proto = (req.headers.get('x-forwarded-proto') || u.protocol.replace(':', '')).split(',')[0].trim()
  const host = (req.headers.get('x-forwarded-host') || req.headers.get('host') || u.host).split(',')[0].trim()
  return `${proto}://${host}`
}

export const OB_CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
}

/** JSON-LD-Antwort (Open-Badge-Dokumente), öffentlich cachebar. */
export function jsonLd(obj: any, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      'content-type': 'application/ld+json; charset=utf-8',
      'cache-control': 'public, max-age=300',
      ...OB_CORS,
    },
  })
}

/**
 * Geschützte Empfänger-Identität nach Open-Badges-Spezifikation:
 * identity = 'sha256$' + hex( sha256( email + salt ) ), hashed=true.
 */
export function hashedRecipient(email: string, salt: string) {
  const h = crypto.createHash('sha256').update(email.trim().toLowerCase() + salt, 'utf8').digest('hex')
  return { type: 'email', hashed: true, salt, identity: 'sha256$' + h }
}

/** Offizielle KALYX-Marken-Triebgrafik (CI, ueber-kalyx.html .kalyx-icon). */
export const KALYX_SPROUT_PATHS = [
  'M12 22V12',
  'M12 12C12 7 7 4 3 6c4 1 7 5 9 6z',
  'M12 12c0-5 5-8 9-6-4 1-7 5-9 6z',
]
