// Ziel-Pfad im Repo: app/api/verify/route.ts  (NEU)
//
// Öffentliche Zertifikats-Verifizierung. Aufruf: GET /api/verify?nr=<cert_number>
// Liest serverseitig über den Service-Key (RLS umgangen) und gibt nur unbedenkliche
// Felder zurück. Von kalyx.ag (verify-Seite) per fetch aufrufbar (CORS offen, read-only).

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { oeffentlicheSicht, typLabel, niveauLabel } from '@/lib/snapshots/snapshot'

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': 'content-type',
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export async function GET(req: Request) {
  const nr = new URL(req.url).searchParams.get('nr')?.trim() || ''
  if (!nr) return json({ valid: false, error: 'Keine Nummer angegeben.' }, 400)

  try {
    const admin = getAdminClient()
    const { data } = await admin
      .from('certificates')
      .select('cert_number,title,recipient_name,issued_at,status,content_hash,course_type,course_level')
      .eq('cert_number', nr)
      .maybeSingle()

    if (!data || (data as any).status !== 'gueltig') {
      return json({ valid: false, cert_number: nr }, 200)
    }
    const c = data as any

    // Eingefrorenen Inhalt (falls vorhanden) als öffentliche Sicht beilegen:
    // Lernziele, Module, Niveau/Art — ohne Prüfungsfragen.
    let inhalt: any = null
    if (c.content_hash) {
      const { data: snap } = await admin
        .from('course_snapshots')
        .select('content,content_hash,first_certified_at,module_count,question_count')
        .eq('content_hash', c.content_hash)
        .maybeSingle()
      if (snap) {
        const s = snap as any
        inhalt = {
          ...oeffentlicheSicht(s.content),
          content_hash: s.content_hash,
          eingefroren_am: s.first_certified_at,
        }
      }
    }

    return json({
      valid: true,
      cert_number: c.cert_number,
      title: c.title,
      recipient_name: c.recipient_name,
      issued_at: c.issued_at,
      art: typLabel(c.course_type),
      niveau: niveauLabel(c.course_level),
      inhalt,
      note: 'KALYX-Abschlusszertifikat. Kein offizieller Branchenabschluss.',
    }, 200)
  } catch (e: any) {
    return json({ valid: false, error: 'Verifizierung nicht möglich.' }, 500)
  }
}

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...CORS } })
}
