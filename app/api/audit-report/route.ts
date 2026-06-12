// Ziel-Pfad im Repo: app/api/audit-report/route.ts  (NEU)
//
// Liefert die Datengrundlage für den Audit-Report und die Heatmap:
// je Abteilung mal Pflichtthema die Abdeckung, dazu eine Detailtabelle je Person
// für den Export. Nur für Admins und Manager, nur für den eigenen Mandanten.
//
// Modell (kurs-basiert): Pflichtkurse sind die verlangten Kompetenzen (Soll),
// bestandene Prüfungen das Ist.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export const runtime = 'nodejs'

function istPflicht(c: any): boolean {
  return c?.mandatory === true || c?.category === 'Pflichtschulung'
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    if (!token) return NextResponse.json({ ok: false, error: 'fehlende Angaben' }, { status: 400 })

    const admin = getAdminClient()
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const user = ures?.user
    if (uerr || !user) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('*').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    const level = (me as any)?.access_level
    if (!tid) return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })
    if (level !== 'admin' && level !== 'manager') return NextResponse.json({ ok: false, error: 'keine Berechtigung' }, { status: 403 })

    // Mandantname
    const { data: cp } = await admin.from('company_profiles').select('*').eq('tenant_id', tid).maybeSingle()
    const mandant = (cp as any)?.company_name || (cp as any)?.legal_name || (cp as any)?.name || 'Mandant'

    // Pflichtkurse
    const { data: courses } = await admin.from('courses').select('*').or('tenant_id.eq.' + tid + ',tenant_id.is.null')
    const pflicht = ((courses as any[]) || []).filter(istPflicht).map(c => ({ id: c.id as string, titel: c.title as string }))
    const total = pflicht.length

    // Personen
    const { data: users } = await admin.from('app_users').select('*').eq('tenant_id', tid)
    const personenRaw = ((users as any[]) || []).filter(u => u.status !== 'inactive' && u.status !== 'gesperrt')

    // Bestanden + Datum je Person/Kurs (fruehestes Bestehdatum)
    const { data: att } = await admin.from('exam_attempts').select('user_id,course_id,passed,completed_at').eq('tenant_id', tid).eq('passed', true)
    const datum: Record<string, Record<string, string>> = {}
    ;((att as any[]) || []).forEach(a => {
      if (!datum[a.user_id]) datum[a.user_id] = {}
      const d = (a.completed_at || '').slice(0, 10)
      const cur = datum[a.user_id][a.course_id]
      if (!cur || (d && d < cur)) datum[a.user_id][a.course_id] = d || cur || ''
    })

    // Personen mit Ergebnissen
    const personen = personenRaw.map(p => {
      const ergebnisse = pflicht.map(c => {
        const d = datum[p.id]?.[c.id]
        return { kurs_id: c.id, bestanden: d !== undefined, datum: d || null }
      })
      const done = ergebnisse.filter(e => e.bestanden).length
      return { name: p.full_name || p.email || 'Unbekannt', abteilung: p.department || 'Ohne Abteilung', ergebnisse, done }
    })

    // Heatmap je Abteilung
    const deptNames = Array.from(new Set(personen.map(p => p.abteilung)))
    const heatmap = deptNames.map(name => {
      const leute = personen.filter(p => p.abteilung === name)
      const zellen = pflicht.map(c => {
        const bestanden = leute.filter(p => p.ergebnisse.find(e => e.kurs_id === c.id)?.bestanden).length
        return { kurs_id: c.id, prozent: leute.length > 0 ? Math.round((bestanden / leute.length) * 100) : 0 }
      })
      const schnitt = total > 0 ? Math.round((leute.reduce((s, p) => s + p.done, 0) / (leute.length * total)) * 100) : 100
      return { name, personen: leute.length, zellen, schnitt }
    }).sort((a, b) => a.schnitt - b.schnitt)

    const gesamtPersonen = personen.length
    const doneGesamt = personen.reduce((s, p) => s + p.done, 0)
    const gesamtAbdeckung = total > 0 && gesamtPersonen > 0 ? Math.round((doneGesamt / (gesamtPersonen * total)) * 100) : 100

    const stichdatum = new Date().toISOString().slice(0, 10)

    // Prüfsumme über die Datengrundlage des Berichts (feste Feldreihenfolge,
    // serverseitig berechnet). Wer den Export später prüft, kann denselben
    // Hash aus den Daten nachrechnen bzw. ihn gegen den Audit-Log-Eintrag halten.
    const reportHash = crypto.createHash('sha256').update(JSON.stringify({
      mandant, stichdatum, pflicht, personen, gesamt_abdeckung: gesamtAbdeckung,
    }), 'utf8').digest('hex')

    // Bei zweck='export' wird der Export selbst revisionssicher verankert:
    // ein Eintrag in der Hash-Kette des Mandanten (audit_log, DB-Trigger
    // verkettet und schützt ihn). Reines Ansehen der Seite wird nicht geloggt.
    let kette: { seq: number; entry_hash: string } | null = null
    if (String(body.zweck || '') === 'export') {
      const { data: logRow } = await admin.from('audit_log').insert({
        tenant_id: tid,
        actor_id: user.id,
        action: 'audit_report_export',
        entity: 'audit_report',
        payload: {
          report_hash: reportHash,
          stichdatum,
          personen_anzahl: gesamtPersonen,
          pflicht_anzahl: total,
          gesamt_abdeckung: gesamtAbdeckung,
        },
      }).select('seq,entry_hash').maybeSingle()
      if (logRow) kette = { seq: (logRow as any).seq, entry_hash: (logRow as any).entry_hash }
    }

    return NextResponse.json({
      ok: true,
      mandant,
      stichdatum,
      pflicht,
      personen,
      heatmap,
      gesamt_abdeckung: gesamtAbdeckung,
      personen_anzahl: gesamtPersonen,
      pflicht_anzahl: total,
      report_hash: reportHash,
      kette,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler bei der Auswertung' }, { status: 500 })
  }
}
