// Ziel-Pfad im Repo: app/api/badge/assertion/route.ts  (NEU)
//
// Open Badges v2 — Assertion je Zertifikat (hosted verification).
// Aufruf: GET /api/badge/assertion?nr=<cert_number>
//
// Datenschutz: Die Identität der Person erscheint NIE im Klartext,
// sondern als gesalzener SHA-256-Hash (Open-Badges-Standard für
// geschützte Identitäten). Widerrufene/ungültige Zertifikate liefern
// gemäss Spezifikation HTTP 410 mit "revoked": true.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { baseUrl, jsonLd, hashedRecipient, OB_CONTEXT, OB_CORS } from '@/lib/badges/openbadge'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: OB_CORS })
}

export async function GET(req: Request) {
  const nr = new URL(req.url).searchParams.get('nr')?.trim() || ''
  if (!nr) return jsonLd({ error: 'Keine Nummer angegeben.' }, 400)

  try {
    const admin = getAdminClient()
    const { data } = await admin
      .from('certificates')
      .select('cert_number,title,recipient_name,issued_at,status,course_id,user_id')
      .eq('cert_number', nr)
      .maybeSingle()

    if (!data) return jsonLd({ error: 'Unbekanntes Zertifikat.', cert_number: nr }, 404)
    const c = data as any
    const base = baseUrl(req)
    const assertionId = `${base}/api/badge/assertion?nr=${encodeURIComponent(c.cert_number)}`

    // Widerrufen / nicht (mehr) gültig → Spezifikation: 410 + revoked
    if (c.status !== 'gueltig') {
      return jsonLd({ '@context': OB_CONTEXT, id: assertionId, revoked: true }, 410)
    }

    // Empfänger-Identität: E-Mail der Person (aus app_users; Rückfall auf
    // recipient_name, falls dort eine E-Mail steht) — gehasht, nie Klartext.
    // Ist keine E-Mail auffindbar, dient die öffentliche Zertifikats-URL als
    // Identität (von der Spezifikation erlaubter IdentityType "url").
    let email = ''
    if (c.user_id) {
      const { data: u } = await admin.from('app_users').select('email').eq('id', c.user_id).maybeSingle()
      email = String((u as any)?.email || '')
    }
    if (!email && c.recipient_name && String(c.recipient_name).includes('@')) email = String(c.recipient_name)

    const recipient = email
      ? hashedRecipient(email, c.cert_number) // Salz = Zertifikatsnummer (öffentlich, je Badge einzigartig)
      : { type: 'url', hashed: false, identity: `${base}/zertifikat?nr=${encodeURIComponent(c.cert_number)}` }

    return jsonLd({
      '@context': OB_CONTEXT,
      type: 'Assertion',
      id: assertionId,
      recipient,
      badge: `${base}/api/badge/class?kurs=${encodeURIComponent(c.course_id)}`,
      issuedOn: new Date(c.issued_at).toISOString(),
      verification: { type: 'hosted' },
      image: `${base}/api/badge/image?nr=${encodeURIComponent(c.cert_number)}`,
      evidence: `${base}/zertifikat?nr=${encodeURIComponent(c.cert_number)}`,
    })
  } catch {
    return jsonLd({ error: 'Abruf nicht möglich.' }, 500)
  }
}
