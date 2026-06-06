// Ziel-Pfad im Repo: app/api/skill-graph/route.ts  (NEU)
//
// Liefert die Kompetenz-Abdeckung ueber mehrere Personen: je Abteilung und fuer
// den ganzen Mandanten, plus die groessten Luecken. Nur fuer Admins und Manager.
//
// Modell (kurs-basiert): Pflichtkurse gelten als verlangte Kompetenzen (Soll).
// Bestandene Pflichtkurse sind das Ist. Die Differenz ist die messbare Luecke.
//
// Sicherheit: Aufrufer weist sich mit Access-Token aus, der Mandant und die
// Berechtigung werden serverseitig geprueft. Es werden ausschliesslich Daten
// des eigenen Mandanten ausgewertet.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

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

    const { data: me } = await admin.from('app_users').select('tenant_id,access_level').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    const level = (me as any)?.access_level
    if (!tid) return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })
    if (level !== 'admin' && level !== 'manager') return NextResponse.json({ ok: false, error: 'keine Berechtigung' }, { status: 403 })

    // Pflichtkurse des Mandanten (inkl. globaler Kurse)
    const { data: courses } = await admin.from('courses').select('*').or('tenant_id.eq.' + tid + ',tenant_id.is.null')
    const pflicht = ((courses as any[]) || []).filter(istPflicht)
    const pflichtIds = new Set(pflicht.map(c => c.id))
    const total = pflicht.length

    // Personen des Mandanten
    const { data: users } = await admin.from('app_users').select('id,full_name,department,access_level,status').eq('tenant_id', tid)
    const personen = ((users as any[]) || []).filter(u => u.status !== 'inactive' && u.status !== 'gesperrt')

    // Bestandene Pflicht je Person
    const { data: att } = await admin.from('exam_attempts').select('user_id,course_id,passed').eq('tenant_id', tid).eq('passed', true)
    const bestanden: Record<string, Set<string>> = {}
    ;((att as any[]) || []).forEach(a => {
      if (!pflichtIds.has(a.course_id)) return
      if (!bestanden[a.user_id]) bestanden[a.user_id] = new Set()
      bestanden[a.user_id].add(a.course_id)
    })

    const proPerson = personen.map(p => ({ department: p.department || 'Ohne Abteilung', done: bestanden[p.id]?.size || 0 }))

    // Je Abteilung
    const deptMap: Record<string, { personen: number; doneSum: number }> = {}
    proPerson.forEach(p => {
      if (!deptMap[p.department]) deptMap[p.department] = { personen: 0, doneSum: 0 }
      deptMap[p.department].personen++
      deptMap[p.department].doneSum += p.done
    })
    const abteilungen = Object.entries(deptMap).map(([name, v]) => ({
      name,
      personen: v.personen,
      abdeckung: total > 0 ? Math.round((v.doneSum / (v.personen * total)) * 100) : 100,
    })).sort((a, b) => a.abdeckung - b.abdeckung)

    // Mandant gesamt
    const gesamtPersonen = proPerson.length
    const doneGesamt = proPerson.reduce((s, p) => s + p.done, 0)
    const gesamtAbdeckung = total > 0 && gesamtPersonen > 0 ? Math.round((doneGesamt / (gesamtPersonen * total)) * 100) : 100

    // Groesste Luecken je Pflichtkurs (Anzahl Personen, die ihn offen haben)
    const luecken = pflicht.map(c => ({
      titel: c.title,
      offen: personen.filter(p => !bestanden[p.id]?.has(c.id)).length,
    })).filter(x => x.offen > 0).sort((a, b) => b.offen - a.offen).slice(0, 8)

    return NextResponse.json({
      ok: true,
      pflicht_kurse: total,
      personen: gesamtPersonen,
      gesamt_abdeckung: gesamtAbdeckung,
      abteilungen,
      luecken,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler bei der Auswertung' }, { status: 500 })
  }
}
