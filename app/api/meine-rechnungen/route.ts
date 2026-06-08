// Ziel-Pfad im Repo: app/api/meine-rechnungen/route.ts  (NEU)
//
// Liefert dem angemeldeten Administrator die Zahlungen seines eigenen Mandanten
// und die Empfaengerdaten, damit das Kundenkonto die Rechnungen anzeigen und als
// PDF erzeugen kann. Nur fuer Administratoren, nur fuer den eigenen Mandanten.
//
// Die Positionen (Lizenzen, Add-ons) werden aus der aktuellen Paketeinstellung
// abgeleitet und dienen als Aufstellung. Der verbindliche Betrag je Rechnung ist
// der tatsaechlich bezahlte Betrag aus tenant_payments.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { rechnePaket, type BillingMandant } from '@/lib/billing/preise'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    if (!token) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const admin = getAdminClient()
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const user = ures?.user
    if (uerr || !user) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('tenant_id,access_level').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    const level = (me as any)?.access_level
    if (!tid) return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })
    if (level !== 'admin') return NextResponse.json({ ok: false, error: 'nur fuer Administratoren' }, { status: 403 })

    // Mandant (Demo-Kennzeichen)
    const { data: t } = await admin.from('tenants').select('slug,is_demo').eq('id', tid).maybeSingle()

    // Empfaengerdaten (defensiv, falls einzelne Felder fehlen)
    let cp: any = {}
    try {
      const r = await admin.from('company_profiles')
        .select('display_name,legal_name,country,uid_handelsregister,contact_name,contact_email')
        .eq('tenant_id', tid).maybeSingle()
      cp = r.data || {}
    } catch {}

    // Aktuelle Paketzusammensetzung als Grundlage der Positionen
    let billing: BillingMandant = { paket: null, lizenzen: 0, addons: [], abrechnung: 'monatlich' }
    try {
      const { data: b } = await admin.from('tenant_billing').select('plan,seats,addons,billing_interval').eq('tenant_id', tid).maybeSingle()
      if (b) billing = {
        paket: (b as any).plan || null,
        lizenzen: typeof (b as any).seats === 'number' ? (b as any).seats : 0,
        addons: Array.isArray((b as any).addons) ? (b as any).addons : [],
        abrechnung: (b as any).billing_interval || 'monatlich',
      }
    } catch {}
    const rechnung = rechnePaket(billing)

    // Zahlungen des Mandanten
    let zahlungen: any[] = []
    try {
      const { data: pays } = await admin.from('tenant_payments')
        .select('id,created_at,amount_rappen,currency,interval,status,stripe_session_id,email')
        .eq('tenant_id', tid).order('created_at', { ascending: false })
      zahlungen = (pays as any[]) || []
    } catch {}

    return NextResponse.json({
      ok: true,
      is_demo: !!(t as any)?.is_demo,
      empfaenger: {
        name: cp.legal_name || cp.display_name || 'Mandant',
        uid: cp.uid_handelsregister || null,
        land: cp.country || null,
        kontakt_name: cp.contact_name || null,
        kontakt_email: cp.contact_email || null,
      },
      paket: billing.paket,
      lizenzen: billing.lizenzen,
      positionen: rechnung.posten,
      zahlungen,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler bei der Auswertung' }, { status: 500 })
  }
}
