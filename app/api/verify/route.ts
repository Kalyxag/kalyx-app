// Ziel-Pfad im Repo: app/api/verify/route.ts  (NEU)
//
// Öffentliche Zertifikats-Verifizierung. Aufruf: GET /api/verify?nr=<cert_number>
// Liest serverseitig über den Service-Key (RLS umgangen) und gibt nur unbedenkliche
// Felder zurück. Von kalyx.ag (verify-Seite) per fetch aufrufbar (CORS offen, read-only).

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { oeffentlicheSicht, typLabel, niveauLabel } from '@/lib/snapshots/snapshot'
import { effektiverStatus, STATUS_LABEL, tageBisAblauf, istAktuell } from '@/lib/certs/status'

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
      .select('cert_number,title,recipient_name,issued_at,status,content_hash,course_type,course_level,expires_at,recert_interval,tenant_id')
      .eq('cert_number', nr)
      .maybeSingle()

    // Nicht vorhanden oder widerrufen → ungültig
    if (!data || (data as any).status === 'widerrufen') {
      return json({ valid: false, cert_number: nr }, 200)
    }
    const c = data as any
    const eff = effektiverStatus({ status: c.status, expires_at: c.expires_at })

    // Eingefrorenen Inhalt (öffentliche Sicht, ohne Fragen) beilegen
    let inhalt: any = null
    if (c.content_hash) {
      const { data: snap } = await admin
        .from('course_snapshots')
        .select('content,content_hash,first_certified_at,module_count,question_count')
        .eq('content_hash', c.content_hash)
        .maybeSingle()
      if (snap) {
        const s = snap as any
        inhalt = { ...oeffentlicheSicht(s.content), content_hash: s.content_hash, eingefroren_am: s.first_certified_at }
      }
    }

    // Co-Branding: nur die nutzerseitig nötigen, unkritischen Felder
    // öffentlich beilegen, und nur wenn das white_label-Add-on aktiv ist.
    let branding: any = null
    if (c.tenant_id) {
      try {
        const [{ data: br }, { data: ten }] = await Promise.all([
          admin.from('branding').select('brand_name,logo_dark_url,logo_url,primary_color,verify_show_kalyx,support_email,support_url,tagline').eq('tenant_id', c.tenant_id).maybeSingle(),
          admin.from('tenants').select('addons').eq('id', c.tenant_id).maybeSingle(),
        ])
        const addons = (ten as any)?.addons || []
        const hasWL = Array.isArray(addons) && addons.includes('white_label')
        if (hasWL && br) {
          const b = br as any
          branding = {
            brand_name: (b.brand_name || '').trim() || null,
            logo_url: (b.logo_dark_url || b.logo_url || '').trim() || null,
            primary_color: (b.primary_color || '').trim() || null,
            show_kalyx: true,
            support_email: (b.support_email || '').trim() || null,
            support_url: (b.support_url || '').trim() || null,
            tagline: (b.tagline || '').trim() || null,
          }
        }
      } catch { /* Branding ist optional; Verify funktioniert auch ohne. */ }
    }

    return json({
      valid: istAktuell(eff),               // gültig oder läuft bald ab → anerkennbar
      status: eff,
      status_label: STATUS_LABEL[eff],
      cert_number: c.cert_number,
      title: c.title,
      recipient_name: c.recipient_name,
      issued_at: c.issued_at,
      expires_at: c.expires_at || null,
      tage_bis_ablauf: tageBisAblauf(c.expires_at),
      art: typLabel(c.course_type),
      niveau: niveauLabel(c.course_level),
      inhalt,
      branding,
      note: 'KALYX-Abschlusszertifikat. Kein offizieller Branchenabschluss.',
    }, 200)
  } catch (e: any) {
    return json({ valid: false, error: 'Verifizierung nicht möglich.' }, 500)
  }
}

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...CORS } })
}
