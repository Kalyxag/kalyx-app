// KALYX REST-API v1 — Pflichtschulungs-Stand je Person.
// GET /api/v1/abschluesse?limit=&offset= · Authorization: Bearer kalyx_…
// Enthält Name/E-Mail/Abteilung: es sind die eigenen Mitarbeiterdaten
// des Mandanten (Zugriff durch dessen Admin via Mandanten-Schlüssel),
// gedacht für den Abgleich mit HR-Systemen.
// Datengrundlage identisch zum Audit-Report (app/api/audit-report):
// Pflichtkurse = mandatory oder Kategorie "Pflichtschulung";
// bestanden = früheste bestandene Prüfung.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { pruefeApiKey, apiJson, pagination, API_CORS } from '@/lib/api/key-auth'

export async function OPTIONS() { return new Response(null, { status: 204, headers: API_CORS }) }

function istPflicht(c: any): boolean {
  return c?.mandatory === true || c?.category === 'Pflichtschulung'
}

export async function GET(req: Request) {
  const auth = await pruefeApiKey(req)
  if (auth.ok === false) return apiJson({ ok: false, error: auth.error }, auth.status)
  const { limit, offset } = pagination(req)
  try {
    const admin = getAdminClient()
    const tid = auth.tenant_id

    const { data: courses } = await admin.from('courses').select('*').or('tenant_id.eq.' + tid + ',tenant_id.is.null')
    const pflicht = ((courses as any[]) || []).filter(istPflicht).map(c => ({ id: c.id as string, titel: c.title as string }))

    const { data: users } = await admin.from('app_users').select('*').eq('tenant_id', tid)
    const personenRaw = ((users as any[]) || [])
      .filter(u => u.status !== 'inactive' && u.status !== 'gesperrt')
      .sort((a, b) => String(a.full_name || a.email).localeCompare(String(b.full_name || b.email), 'de'))

    const { data: att } = await admin.from('exam_attempts').select('user_id,course_id,passed,completed_at').eq('tenant_id', tid).eq('passed', true)
    const datum: Record<string, Record<string, string>> = {}
    ;((att as any[]) || []).forEach(a => {
      if (!datum[a.user_id]) datum[a.user_id] = {}
      const d = (a.completed_at || '').slice(0, 10)
      const cur = datum[a.user_id][a.course_id]
      if (!cur || (d && d < cur)) datum[a.user_id][a.course_id] = d || cur || ''
    })

    const seite = personenRaw.slice(offset, offset + limit)
    const personen = seite.map(p => {
      const kurse = pflicht.map(c => {
        const d = datum[p.id]?.[c.id]
        return { kurs_id: c.id, kurs: c.titel, bestanden: d !== undefined, bestanden_am: d || null }
      })
      const erfuellt = kurse.filter(k => k.bestanden).length
      return {
        person_id: p.id,
        name: p.full_name || null,
        email: p.email || null,
        abteilung: p.department || null,
        erfuellt,
        soll: pflicht.length,
        quote_prozent: pflicht.length > 0 ? Math.round((erfuellt / pflicht.length) * 100) : 100,
        kurse,
      }
    })

    return apiJson({ ok: true, gesamt: personenRaw.length, limit, offset, pflicht_anzahl: pflicht.length, personen })
  } catch {
    return apiJson({ ok: false, error: 'Abruf nicht möglich.' }, 500)
  }
}
