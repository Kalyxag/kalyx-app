// Ziel-Pfad im Repo: app/api/stripe-checkout/route.ts  (NEU)
//
// Erzeugt einen Stripe-Zahlungslink (Checkout Session) für einen Mandanten.
// Aufruf von der Admin-/Support-Seite:
//
//   POST /api/stripe-checkout?token=GEHEIM   Body: { slug: "mandant-slug" }
//   Antwort bei Erfolg:  { ok: true, url: "https://checkout.stripe.com/..." }
//   Antwort bei Fehler:  { ok: false, error: "Klartext-Grund" }
//
// Logik:
// - Token-Schutz wie bei den anderen Admin-Routen (SEED_SECRET).
// - Mandant über den slug auflösen, Paket und Lizenzen aus tenant_billing lesen.
// - Betrag mit der zentralen Preislogik aus lib/billing/preise.ts berechnen.
// - Daraus eine Stripe Checkout Session bauen (einmalige Zahlung für den Zeitraum).
// - Stripe wird direkt über die REST-Schnittstelle angesprochen, ohne extra Paket.
//
// Voraussetzung: In Vercel muss die Umgebungsvariable STRIPE_SECRET_KEY gesetzt
// sein. Für den Sandbox-Test der Test-Schlüssel (beginnt mit sk_test_), für den
// echten Betrieb später der Live-Schlüssel (beginnt mit sk_live_).
//
// Hinweis zur Verlaengerung: Diese Route deckt die einmalige Zahlung fuer den
// gewaehlten Zeitraum ab (monatlich oder jaehrlich). Das automatische
// Auf-aktiv-Setzen nach der Zahlung und die wiederkehrende Abrechnung sind der
// naechste Schritt und brauchen zusaetzlich eine Webhook-Route.

import { NextResponse } from 'next/server'
import { seedDenied } from '@/lib/api/seed-secret'
import { getAdminClient } from '@/lib/supabase/admin'
import { rechnePaket, type BillingMandant } from '@/lib/billing/preise'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'


function siteOrigin(req: Request): string {
  return req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://kalyx.academy'
}

export async function POST(req: Request) {
  try {
    // 1) Token-Schutz, gleicher Code wie die uebrigen Admin-Routen.
    const denied = seedDenied(req)
    if (denied) return denied

    // 2) Stripe-Schluessel muss konfiguriert sein.
    const stripeKey = process.env.STRIPE_SECRET_KEY || ''
    if (!stripeKey) {
      return NextResponse.json({ ok: false, error: 'Stripe ist noch nicht konfiguriert. Bitte STRIPE_SECRET_KEY in Vercel hinterlegen.' }, { status: 503 })
    }

    // 3) Eingabe lesen.
    const body = await req.json().catch(() => ({}))
    const slug = String(body.slug || '').trim()
    if (!slug) return NextResponse.json({ ok: false, error: 'slug fehlt.' }, { status: 400 })

    let admin
    try { admin = getAdminClient() }
    catch { return NextResponse.json({ ok: false, error: 'Server nicht konfiguriert.' }, { status: 503 }) }

    // 4) Mandant auflösen.
    const t = await admin.from('tenants').select('id,slug').eq('slug', slug).maybeSingle()
    if (t.error || !t.data) return NextResponse.json({ ok: false, error: 'Mandant nicht gefunden.' }, { status: 404 })
    const tenantId = (t.data as any).id

    // 5) Paket und Lizenzen aus tenant_billing lesen.
    const b = await admin.from('tenant_billing')
      .select('plan,seats,addons,billing_interval')
      .eq('tenant_id', tenantId).maybeSingle()
    if (b.error || !b.data) {
      return NextResponse.json({ ok: false, error: 'Für diesen Mandanten ist noch kein Paket gespeichert. Bitte zuerst Paket und Lizenzzahl speichern.' }, { status: 400 })
    }
    const billing: BillingMandant = {
      paket: (b.data as any).plan || null,
      lizenzen: typeof (b.data as any).seats === 'number' ? (b.data as any).seats : 0,
      addons: Array.isArray((b.data as any).addons) ? (b.data as any).addons : [],
      abrechnung: (b.data as any).billing_interval || 'monatlich',
    }

    // 6) Betrag mit der zentralen Preislogik berechnen.
    const rechnung = rechnePaket(billing)
    if (!rechnung.total || rechnung.total <= 0) {
      return NextResponse.json({ ok: false, error: 'Für dieses Paket ergibt sich kein zu zahlender Betrag. Bitte Paket und Lizenzzahl prüfen und speichern.' }, { status: 400 })
    }
    // Stripe erwartet den Betrag in Rappen (kleinste Einheit von CHF).
    const betragRappen = Math.round(rechnung.total * 100)

    // 7) Kontakt-E-Mail des Mandanten laden (optional, zum Vorausfüllen).
    let kundenEmail = ''
    try {
      const cp = await admin.from('company_profiles').select('contact_email,display_name').eq('tenant_id', tenantId).maybeSingle()
      kundenEmail = (cp.data as any)?.contact_email || ''
    } catch {}

    // 8) Beschreibung aus den Einzelposten bauen (für die Stripe-Seite).
    const beschreibung = rechnung.posten.map(p => p.label).join(' | ').slice(0, 480)
    const jaehrlich = rechnung.interval === 'jaehrlich'
    const produktName = 'KALYX Paket ' + (billing.paket || '') + (jaehrlich ? ', jährlich' : ', monatlich')

    // 9) Checkout Session über die Stripe-REST-Schnittstelle erzeugen.
    const origin = siteOrigin(req)
    const form = new URLSearchParams()
    form.set('mode', 'payment')
    form.set('locale', 'de')
    form.set('success_url', origin + '/?checkout=erfolg')
    form.set('cancel_url', origin + '/?checkout=abbruch')
    form.set('payment_method_types[0]', 'card')
    form.set('line_items[0][quantity]', '1')
    form.set('line_items[0][price_data][currency]', 'chf')
    form.set('line_items[0][price_data][unit_amount]', String(betragRappen))
    form.set('line_items[0][price_data][product_data][name]', produktName)
    if (beschreibung) form.set('line_items[0][price_data][product_data][description]', beschreibung)
    if (kundenEmail) form.set('customer_email', kundenEmail)
    // Kennzeichen für eine spätere Webhook-Route (Auf-aktiv-Setzen nach Zahlung).
    form.set('metadata[tenant_slug]', slug)
    form.set('metadata[tenant_id]', String(tenantId))
    form.set('metadata[interval]', rechnung.interval)

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + stripeKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    })
    const j = await resp.json().catch(() => ({}))

    if (!resp.ok || !j?.url) {
      const grund = j?.error?.message || 'Stripe hat keinen Zahlungslink geliefert.'
      return NextResponse.json({ ok: false, error: 'Stripe: ' + grund }, { status: 502 })
    }

    return NextResponse.json({ ok: true, url: j.url })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'Fehler: ' + (e?.message || 'unbekannt') }, { status: 500 })
  }
}
