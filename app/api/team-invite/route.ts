// Ziel-Pfad im Repo: app/api/team-invite/route.ts  (NEU)
//
// Einladungen für Mitarbeitende. Alles serverseitig mit service_role, die
// Sitzung des aufrufenden Admins wird geprüft.
//
//   action 'liste'    -> Team-Liste mit abgeleitetem Status (eingeladen/aktiv)
//   action 'einladen' -> legt Person an. per:'mail' verschickt eine Einladung
//                        über Supabase, per:'link' gibt einen Einladungslink
//                        zum Weitergeben zurück (funktioniert ohne Mailversand)
//   action 'erneut'   -> neuer Einladungslink für eine bereits angelegte Person
//
// Der Status wird aus den Anmeldedaten abgeleitet: wer sich noch nie angemeldet
// hat, gilt als "eingeladen", sonst als "aktiv". So braucht es kein neues
// Statuswort in der Datenbank.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LEVELS = ['admin', 'manager', 'learner']

function siteOrigin(req: Request): string {
  return req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://kalyx.academy'
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    const action = String(body.action || 'liste')
    if (!token) return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401 })

    const admin = getAdminClient()
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const caller = ures?.user
    if (uerr || !caller) return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('tenant_id,access_level').eq('id', caller.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    const myLevel = (me as any)?.access_level
    if (!tid) return NextResponse.json({ ok: false, error: 'Kein Mandant.' }, { status: 403 })

    // ---- LISTE: für Admin und Manager sichtbar ----
    if (action === 'liste') {
      if (myLevel !== 'admin' && myLevel !== 'manager') {
        return NextResponse.json({ ok: false, error: 'Keine Berechtigung.' }, { status: 403 })
      }
      const { data: rows } = await admin.from('app_users')
        .select('*').eq('tenant_id', tid)
      const users = (rows as any[]) || []
      // Anmeldedaten je Person abrufen (für den abgeleiteten Status).
      const authByEmail = new Map<string, any>()
      try {
        const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
        for (const u of (list.data?.users || [])) authByEmail.set((u.email || '').toLowerCase(), u)
      } catch {}
      const team = users.map(u => {
        const au = authByEmail.get(String(u.email || '').toLowerCase())
        const angemeldet = !!au?.last_sign_in_at
        return {
          id: u.id, email: u.email, full_name: u.full_name || '', access_level: u.access_level,
          department: u.department || null, position: u.position || null,
          status: angemeldet ? 'aktiv' : 'eingeladen',
        }
      }).sort((a, b) => (a.full_name || a.email).localeCompare(b.full_name || b.email, 'de'))
      return NextResponse.json({ ok: true, team })
    }

    // ---- Ab hier nur Admins ----
    if (myLevel !== 'admin') return NextResponse.json({ ok: false, error: 'Nur Administratoren können einladen.' }, { status: 403 })

    const origin = siteOrigin(req)
    const redirectTo = origin + '/willkommen'

    if (action === 'erneut') {
      const email = String(body.email || '').trim().toLowerCase()
      if (!email) return NextResponse.json({ ok: false, error: 'E-Mail fehlt.' }, { status: 400 })
      const link = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo } })
      if (link.error) return NextResponse.json({ ok: false, error: 'Link konnte nicht erzeugt werden.' }, { status: 500 })
      return NextResponse.json({ ok: true, link: (link.data as any)?.properties?.action_link || null })
    }

    if (action === 'einladen') {
      const email = String(body.email || '').trim().toLowerCase()
      const full_name = String(body.full_name || '').trim()
      const access_level = LEVELS.includes(body.access_level) ? body.access_level : 'learner'
      const department = body.department ? String(body.department).trim() : null
      const position = body.position ? String(body.position).trim() : null
      const per = body.per === 'link' ? 'link' : 'mail'
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ ok: false, error: 'Bitte eine gültige E-Mail angeben.' }, { status: 400 })
      if (!full_name) return NextResponse.json({ ok: false, error: 'Bitte einen Namen angeben.' }, { status: 400 })

      // Schon im Team?
      const { data: exists } = await admin.from('app_users').select('id').eq('tenant_id', tid).eq('email', email).maybeSingle()
      if (exists) return NextResponse.json({ ok: false, error: 'Diese Person ist bereits im Team.' }, { status: 409 })

      let userId: string | null = null
      let link: string | null = null
      let versendet = false

      if (per === 'mail') {
        // Kontext fuer die E-Mail: Firmenname und einladende Person.
        let firma = ''
        try {
          const cp = await admin.from('company_profiles').select('display_name').eq('tenant_id', tid).maybeSingle()
          firma = (cp.data as any)?.display_name || ''
        } catch {}
        let eingeladen_von = ''
        try {
          const c = await admin.from('app_users').select('full_name,email').eq('id', caller.id).maybeSingle()
          eingeladen_von = (c.data as any)?.full_name || (c.data as any)?.email || ''
        } catch {}
        // Weg 1: Einladung per Supabase verschicken (braucht aktiven Mailversand).
        const inv = await admin.auth.admin.inviteUserByEmail(email, { redirectTo, data: { full_name, firma, eingeladen_von } })
        if (!inv.error && inv.data?.user) {
          userId = inv.data.user.id
          versendet = true
        } else {
          // Mailversand nicht möglich. Der Aufrufer kann es per Link erneut versuchen.
          return NextResponse.json({ ok: false, code: 'mail', error: 'Der Mailversand ist noch nicht eingerichtet. Du kannst stattdessen einen Einladungslink erzeugen und ihn selbst weitergeben.' }, { status: 200 })
        }
      } else {
        // Weg 2: Konto anlegen und einen Einladungslink zum Weitergeben erzeugen.
        const cu = await admin.auth.admin.createUser({ email, email_confirm: true })
        if (cu.error || !cu.data?.user) {
          // Eventuell existiert das Konto bereits (anderer Mandant). Id über die Liste suchen.
          try {
            const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
            const found = (list.data?.users || []).find(u => (u.email || '').toLowerCase() === email)
            userId = found?.id || null
          } catch {}
          if (!userId) return NextResponse.json({ ok: false, error: 'Konto konnte nicht angelegt werden.' }, { status: 500 })
        } else {
          userId = cu.data.user.id
        }
        const gl = await admin.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo } })
        link = (gl.data as any)?.properties?.action_link || null
      }

      if (!userId) return NextResponse.json({ ok: false, error: 'Konto konnte nicht angelegt werden.' }, { status: 500 })

      // app_users-Eintrag anlegen. Fehlt eine optionale Profil-Spalte im Schema,
      // wird sie automatisch weggelassen, damit das Einladen nicht scheitert.
      // Sauber wird es mit dem beiliegenden SQL app-users-spalten.sql.
      const fullRow: any = { id: userId, tenant_id: tid, email, access_level, status: 'active', full_name, language: 'de' }
      if (department) fullRow.department = department
      if (position) fullRow.position = position
      const droppable = ['position', 'department', 'language', 'full_name']
      let row: any = { ...fullRow }
      let saved = false, lastErr = ''
      for (let i = 0; i <= droppable.length; i++) {
        const r = await admin.from('app_users').upsert(row, { onConflict: 'id' })
        if (!r.error) { saved = true; break }
        lastErr = r.error.message
        const miss = (lastErr.match(/'([a-z_]+)' column/) || [])[1]
        if (miss && miss in row && droppable.includes(miss)) { delete row[miss]; continue }
        break
      }
      if (!saved) return NextResponse.json({ ok: false, error: 'Eintrag konnte nicht gespeichert werden: ' + lastErr }, { status: 500 })

      return NextResponse.json({ ok: true, versendet, link })
    }

    return NextResponse.json({ ok: false, error: 'Unbekannte Aktion.' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Fehler: ' + (e?.message || 'unbekannt') }, { status: 500 })
  }
}
