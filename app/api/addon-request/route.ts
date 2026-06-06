// Ziel-Pfad im Repo: app/api/addon-request/route.ts  (NEU)
//
// Kundenbackend-Schnittstelle für Erweiterungen (Add-ons):
//   action 'status'        -> liefert { addons, angefragt } des eigenen Mandanten
//   action 'anfragen'      -> setzt ein Add-on auf "angefragt" (nur Admin)
//   action 'zurücknehmen' -> nimmt eine Anfrage zurück (nur Admin)
//
// Die Freigabe selbst macht ausschliesslich der KALYX-Support. Hier wird nur
// angefragt. Mandant und Berechtigung werden serverseitig geprueft.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { ADDON_KATALOG } from '@/lib/billing/preise'

export const runtime = 'nodejs'

const GUELTIGE_KEYS = ADDON_KATALOG.map(a => a.key)

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    const action = String(body.action || 'status')
    if (!token) return NextResponse.json({ ok: false, error: 'fehlende Angaben' }, { status: 400 })

    const admin = getAdminClient()
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const user = ures?.user
    if (uerr || !user) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('*').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    const level = (me as any)?.access_level
    if (!tid) return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })

    // Aktuellen Billing-Stand lesen
    const { data: bill } = await admin.from('tenant_billing').select('addons,feature_flags').eq('tenant_id', tid).maybeSingle()
    const addons: string[] = Array.isArray((bill as any)?.addons) ? (bill as any).addons : []
    const ff: any = (bill as any)?.feature_flags || {}
    let angefragt: string[] = Array.isArray(ff.angefragt) ? ff.angefragt : []

    if (action === 'status') {
      return NextResponse.json({ ok: true, addons, angefragt })
    }

    // Ändernde Aktionen nur für Admins
    if (level !== 'admin') return NextResponse.json({ ok: false, error: 'nur Admins können Erweiterungen anfragen' }, { status: 403 })

    const key = String(body.addon_key || '')
    if (!GUELTIGE_KEYS.includes(key)) return NextResponse.json({ ok: false, error: 'unbekannte Erweiterung' }, { status: 400 })

    if (action === 'anfragen') {
      if (addons.includes(key)) return NextResponse.json({ ok: true, addons, angefragt }) // schon aktiv
      if (!angefragt.includes(key)) angefragt = [...angefragt, key]
    } else if (action === 'zurücknehmen') {
      angefragt = angefragt.filter(k => k !== key)
    } else {
      return NextResponse.json({ ok: false, error: 'unbekannte Aktion' }, { status: 400 })
    }

    const neu = { ...ff, angefragt }
    const up = await admin.from('tenant_billing')
      .upsert({ tenant_id: tid, feature_flags: neu, updated_at: new Date().toISOString() }, { onConflict: 'tenant_id' })
    if (up.error) return NextResponse.json({ ok: false, error: 'Speichern fehlgeschlagen' }, { status: 500 })

    return NextResponse.json({ ok: true, addons, angefragt })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler' }, { status: 500 })
  }
}
