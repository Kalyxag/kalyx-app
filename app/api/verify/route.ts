// Ziel-Pfad im Repo: app/api/verify/route.ts  (NEU)
//
// Öffentliche Zertifikats-Verifizierung. Aufruf: GET /api/verify?nr=<cert_number>
// Liest serverseitig über den Service-Key (RLS umgangen) und gibt nur unbedenkliche
// Felder zurück. Von kalyx.ag (verify-Seite) per fetch aufrufbar (CORS offen, read-only).

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'

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
      .select('cert_number,title,recipient_name,issued_at,status')
      .eq('cert_number', nr)
      .maybeSingle()

    if (!data || (data as any).status !== 'gueltig') {
      return json({ valid: false, cert_number: nr }, 200)
    }
    const c = data as any
    return json({
      valid: true,
      cert_number: c.cert_number,
      title: c.title,
      recipient_name: c.recipient_name,
      issued_at: c.issued_at,
      note: 'KALYX-Abschlusszertifikat. Kein offizieller Branchenabschluss.',
    }, 200)
  } catch (e: any) {
    return json({ valid: false, error: 'Verifizierung nicht möglich.' }, 500)
  }
}

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...CORS } })
}
