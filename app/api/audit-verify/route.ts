// Ziel-Pfad im Repo: app/api/audit-verify/route.ts  (NEU)
//
// Prüft die Integrität der revisionssicheren Audit-Kette des eigenen
// Mandanten. Die eigentliche Prüfung macht die Datenbankfunktion
// audit_verify() (Migration 2026-06-11_audit-hash-chain.sql): sie läuft
// die Hash-Kette Eintrag für Eintrag durch und rechnet jeden Hash nach.
// Nur für Admins und Manager, nur für den eigenen Mandanten.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

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

    const { data, error } = await admin.rpc('audit_verify', { p_tenant: tid })
    if (error) {
      // Funktion fehlt → Migration noch nicht eingespielt
      return NextResponse.json({ ok: false, error: 'Prüfung nicht möglich. Ist die Audit-Migration eingespielt? ' + error.message }, { status: 500 })
    }

    const row = Array.isArray(data) ? data[0] : data
    return NextResponse.json({
      ok: true,
      integritaet: row?.ok === true,
      eintraege: row?.eintraege ?? 0,
      defekt_bei: row?.defekt_bei ?? null,
      fehler: row?.fehler ?? null,
      geprueft_am: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler bei der Prüfung' }, { status: 500 })
  }
}
