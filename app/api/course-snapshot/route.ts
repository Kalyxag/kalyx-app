// Ziel-Pfad im Repo: app/api/course-snapshot/route.ts  (NEU)
//
// Friert die aktuelle Kursfassung ein und verankert sie in der
// Audit-Hash-Kette. Wird beim Ausstellen eines Zertifikats serverseitig
// aufgerufen. Idempotent: Gibt es zur Fassung (content_hash) bereits
// einen Snapshot, wird dieser zurückgegeben statt ein zweiter angelegt.
//
// POST { access_token, course_id }  ->  { ok, content_hash, course_type, course_level }

export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { kanonisch, contentHash } from '@/lib/snapshots/snapshot'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    const courseId = String(body.course_id || '')
    if (!token || !courseId) return NextResponse.json({ ok: false, error: 'fehlende Angaben' }, { status: 400 })

    const admin = getAdminClient()
    const { data: ures } = await admin.auth.getUser(token)
    const user = ures?.user
    if (!user) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('tenant_id').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id || null

    // Kurs laden (eigener Mandant oder globaler Vorlagenkurs)
    const { data: course } = await admin.from('courses').select('*').eq('id', courseId).maybeSingle()
    if (!course) return NextResponse.json({ ok: false, error: 'Unbekannter Kurs.' }, { status: 404 })
    const c: any = course

    const input = {
      course_id: c.id,
      title: c.title,
      course_type: c.course_type,
      course_level: c.course_level,
      passing_score: c.passing_score,
      learning_objectives: c.learning_objectives || [],
      modules: c.modules || [],
      quiz: c.quiz || [],
    }
    const hash = contentHash(input)
    const { content, module_count, question_count } = kanonisch(input)

    // Existiert die Fassung schon? Dann nichts Neues schreiben.
    const { data: vorhanden } = await admin.from('course_snapshots').select('content_hash').eq('content_hash', hash).maybeSingle()
    if (vorhanden) {
      return NextResponse.json({ ok: true, content_hash: hash, course_type: c.course_type, course_level: c.course_level, neu: false })
    }

    const { error: insErr } = await admin.from('course_snapshots').insert({
      content_hash: hash, tenant_id: tid, course_id: c.id, title: c.title,
      course_type: c.course_type || null, course_level: c.course_level || null,
      passing_score: c.passing_score ?? null, module_count, question_count, content,
    })
    if (insErr) {
      // Race: zwei erste Absolventen gleichzeitig → der zweite findet den Snapshot nun vor.
      const { data: nochmal } = await admin.from('course_snapshots').select('content_hash').eq('content_hash', hash).maybeSingle()
      if (!nochmal) return NextResponse.json({ ok: false, error: 'Snapshot nicht möglich. Migration eingespielt? ' + insErr.message }, { status: 500 })
    } else {
      // Erstmalige Verankerung in der Audit-Hash-Kette
      await admin.from('audit_log').insert({
        tenant_id: tid, actor_id: user.id, action: 'course_snapshot_created', entity: 'course_snapshots',
        entity_id: hash, payload: { course_id: c.id, title: c.title, course_type: c.course_type, course_level: c.course_level, module_count, question_count },
      })
    }

    return NextResponse.json({ ok: true, content_hash: hash, course_type: c.course_type, course_level: c.course_level, neu: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Fehler beim Einfrieren des Inhalts.' }, { status: 500 })
  }
}
