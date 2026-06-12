// KALYX REST-API v1 — Pflichtschulungs-Abdeckung je Abteilung (aggregiert).
// GET /api/v1/abdeckung · Authorization: Bearer kalyx_…
// Gleiche Datengrundlage und Rechenweise wie der Audit-Report
// (app/api/audit-report) — gedacht für BI-Werkzeuge.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { pruefeApiKey, apiJson, API_CORS } from '@/lib/api/key-auth'

export async function OPTIONS() { return new Response(null, { status: 204, headers: API_CORS }) }

function istPflicht(c: any): boolean {
  return c?.mandatory === true || c?.category === 'Pflichtschulung'
}

export async function GET(req: Request) {
  const auth = await pruefeApiKey(req)
  if (auth.ok === false) return apiJson({ ok: false, error: auth.error }, auth.status)
  try {
    const admin = getAdminClient()
    const tid = auth.tenant_id

    const { data: courses } = await admin.from('courses').select('*').or('tenant_id.eq.' + tid + ',tenant_id.is.null')
    const pflicht = ((courses as any[]) || []).filter(istPflicht).map(c => ({ id: c.id as string, titel: c.title as string }))
    const total = pflicht.length

    const { data: users } = await admin.from('app_users').select('*').eq('tenant_id', tid)
    const personenRaw = ((users as any[]) || []).filter(u => u.status !== 'inactive' && u.status !== 'gesperrt')

    const { data: att } = await admin.from('exam_attempts').select('user_id,course_id,passed').eq('tenant_id', tid).eq('passed', true)
    const bestanden: Record<string, Set<string>> = {}
    ;((att as any[]) || []).forEach(a => {
      if (!bestanden[a.user_id]) bestanden[a.user_id] = new Set()
      bestanden[a.user_id].add(a.course_id)
    })

    const personen = personenRaw.map(p => ({
      abteilung: p.department || 'Ohne Abteilung',
      done: pflicht.filter(c => bestanden[p.id]?.has(c.id)).length,
      hat: (cid: string) => bestanden[p.id]?.has(cid) === true,
    }))

    const deptNames = Array.from(new Set(personen.map(p => p.abteilung)))
    const abteilungen = deptNames.map(name => {
      const leute = personen.filter(p => p.abteilung === name)
      const kurse = pflicht.map(c => ({
        kurs_id: c.id,
        kurs: c.titel,
        abdeckung_prozent: leute.length > 0 ? Math.round((leute.filter(p => p.hat(c.id)).length / leute.length) * 100) : 0,
      }))
      const schnitt = total > 0 && leute.length > 0 ? Math.round((leute.reduce((s, p) => s + p.done, 0) / (leute.length * total)) * 100) : 100
      return { abteilung: name, personen: leute.length, schnitt_prozent: schnitt, kurse }
    }).sort((a, b) => a.schnitt_prozent - b.schnitt_prozent)

    const gesamtPersonen = personen.length
    const doneGesamt = personen.reduce((s, p) => s + p.done, 0)
    const gesamt = total > 0 && gesamtPersonen > 0 ? Math.round((doneGesamt / (gesamtPersonen * total)) * 100) : 100

    return apiJson({
      ok: true,
      stichdatum: new Date().toISOString().slice(0, 10),
      personen_anzahl: gesamtPersonen,
      pflicht_anzahl: total,
      gesamt_abdeckung_prozent: gesamt,
      abteilungen,
    })
  } catch {
    return apiJson({ ok: false, error: 'Abruf nicht möglich.' }, 500)
  }
}
