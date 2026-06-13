// Ziel-Pfad im Repo: app/api/stripe-webhook/route.ts  (NEU)
//
// Empfaengt die Meldungen von Stripe nach einer Zahlung. Wenn eine Checkout-
// Sitzung bezahlt ist (checkout.session.completed), setzt diese Route den
// Mandanten auf aktiv und haelt die Zahlung fest. Das ist die Gegenstelle zu
// app/api/stripe-checkout/route.ts und schliesst den Bezahlvorgang ab.
//
// Sicherheit:
// - Stripe signiert jede Meldung. Die Route prueft die Signatur mit dem
//   Webhook-Geheimnis (STRIPE_WEBHOOK_SECRET), bevor sie irgendetwas tut.
//   Ohne gueltige Signatur wird mit 400 abgelehnt.
// - Der Mandant kommt aus den Metadaten der Sitzung, die wir beim Erstellen
//   des Zahlungslinks selbst gesetzt haben. Nichts davon kommt aus dem Browser.
//
// Einrichtung in Stripe (einmalig):
// - Im Stripe-Dashboard unter Webhooks ein Ziel auf
//   https://kalyx.academy/api/stripe-webhook anlegen.
// - Als Ereignis mindestens checkout.session.completed auswaehlen.
// - Das dort angezeigte Signing Secret muss in Vercel als
//   STRIPE_WEBHOOK_SECRET hinterlegt sein (hast du bereits gemacht).
//
// Hinweis: Die Zahlung wird zusaetzlich in der Tabelle tenant_payments
// festgehalten, sofern sie existiert. Das beiliegende SQL legt sie an. Fehlt
// die Tabelle, faellt nur das Festhalten weg, der Mandant wird trotzdem aktiv.

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Prueft die Stripe-Signatur gegen den Roh-Text der Anfrage.
function signaturGueltig(raw: string, header: string, secret: string): boolean {
  try {
    const teile: Record<string, string> = {}
    for (const stueck of header.split(',')) {
      const [k, v] = stueck.split('=')
      if (k && v && !(k in teile)) teile[k.trim()] = v.trim()
    }
    const t = teile['t']
    const v1 = teile['v1']
    if (!t || !v1) return false

    // Schutz vor alten, wiederholten Meldungen: hoechstens fuenf Minuten alt.
    const alterSek = Math.abs(Math.floor(Date.now() / 1000) - parseInt(t, 10))
    if (!Number.isFinite(alterSek) || alterSek > 300) return false

    const erwartet = crypto.createHmac('sha256', secret).update(t + '.' + raw, 'utf8').digest('hex')
    const a = Buffer.from(erwartet)
    const b = Buffer.from(v1)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Webhook nicht konfiguriert.' }, { status: 503 })
  }

  // Roh-Text lesen, nicht JSON, damit die Signaturpruefung stimmt.
  const raw = await req.text()
  const sig = req.headers.get('stripe-signature') || ''
  if (!signaturGueltig(raw, sig, secret)) {
    return NextResponse.json({ ok: false, error: 'Signatur ungueltig.' }, { status: 400 })
  }

  let event: any
  try { event = JSON.parse(raw) } catch {
    return NextResponse.json({ ok: false, error: 'Ungueltiger Inhalt.' }, { status: 400 })
  }

  // Nur die Bezahl-Bestaetigung interessiert uns hier.
  if (event?.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, ignoriert: event?.type || 'unbekannt' })
  }

  try {
    const session = event.data?.object || {}
    const meta = session.metadata || {}
    const tenantId = String(meta.tenant_id || '')
    const slug = String(meta.tenant_slug || '')
    const interval = String(meta.interval || 'monatlich')
    // Betrag und Waehrung kommen direkt von Stripe.
    const betragRappen = typeof session.amount_total === 'number' ? session.amount_total : null
    const waehrung = String(session.currency || 'chf').toUpperCase()
    const sessionId = String(session.id || '')
    const bezahltEmail = String(session.customer_details?.email || session.customer_email || '')

    if (!tenantId) {
      // Ohne Mandant koennen wir nichts zuordnen, aber Stripe soll nicht erneut senden.
      return NextResponse.json({ ok: true, hinweis: 'kein Mandant in den Metadaten' })
    }

    const admin = getAdminClient()
    const jetzt = new Date().toISOString()

    // 1) Mandant aktiv setzen.
    await admin.from('tenant_billing')
      .update({ status: 'aktiv', activated_at: jetzt, updated_at: jetzt })
      .eq('tenant_id', tenantId)

    // 1b) Bezahlte Add-ons automatisch freischalten.
    // Der Checkout hat die zu aktivierenden Add-ons in den Metadaten
    // hinterlegt (genau die, für die der Kunde bezahlt hat). Wir übernehmen
    // sie in die aktiven addons und entfernen sie aus der Wunschliste.
    // So entfällt der manuelle Freischalt-Schritt. Defensiv: ein Fehler hier
    // darf die Zahlungsbestätigung an Stripe nicht brechen.
    try {
      const zuAktivieren = String(meta.aktiviere_addons || '')
        .split(',').map(s => s.trim()).filter(Boolean)
      if (zuAktivieren.length > 0) {
        const { data: cur } = await admin.from('tenant_billing')
          .select('addons,feature_flags').eq('tenant_id', tenantId).maybeSingle()
        const aktiv: string[] = Array.isArray((cur as any)?.addons) ? (cur as any).addons : []
        const ff: any = (cur as any)?.feature_flags || {}
        const angefragt: string[] = Array.isArray(ff.angefragt) ? ff.angefragt : []

        // Neue aktive Liste = bisherige ∪ bezahlte (ohne Dubletten).
        const neuAktiv = Array.from(new Set([...aktiv, ...zuAktivieren]))
        // Aus der Wunschliste entfernen, was jetzt aktiv ist.
        const neuAngefragt = angefragt.filter(k => !zuAktivieren.includes(k))

        await admin.from('tenant_billing').update({
          addons: neuAktiv,
          feature_flags: { ...ff, angefragt: neuAngefragt },
          updated_at: jetzt,
        }).eq('tenant_id', tenantId)

        // Spur im Prüfprotokoll (nicht kritisch). Bewusst ohne 'meta'-Spalte,
        // da nicht alle Schemas sie haben — Add-ons in die Aktion schreiben.
        try {
          await admin.from('audit_log').insert({
            tenant_id: tenantId, actor_id: null,
            action: 'addons_freigeschaltet', entity: 'tenant_billing',
            entity_id: (slug || tenantId) + ': ' + zuAktivieren.join(', '),
          })
        } catch {}
      }
    } catch {
      // Add-on-Freischaltung fehlgeschlagen — die Zahlung ist trotzdem gültig.
      // Fällt auf den manuellen Weg zurück (Betreiber schaltet frei).
    }

    // 2) Zahlung festhalten, falls die Tabelle existiert (sonst still ueberspringen).
    try {
      await admin.from('tenant_payments').insert({
        tenant_id: tenantId,
        stripe_session_id: sessionId,
        amount_rappen: betragRappen,
        currency: waehrung,
        interval,
        status: 'bezahlt',
        email: bezahltEmail || null,
        created_at: jetzt,
      })
    } catch {
      // Tabelle fehlt oder Eintrag schon vorhanden: kein Grund, den Webhook zu brechen.
    }

    // 3) Spur im Pruefprotokoll hinterlassen (Tabelle existiert bereits).
    try {
      await admin.from('audit_log').insert({
        tenant_id: tenantId, actor_id: null,
        action: 'zahlung_eingegangen', entity: 'tenant_billing', entity_id: slug || tenantId,
      })
    } catch {}

    return NextResponse.json({ ok: true, aktiviert: slug || tenantId })
  } catch (e: any) {
    // 500 sorgt dafuer, dass Stripe es spaeter erneut versucht.
    return NextResponse.json({ ok: false, error: 'Verarbeitung fehlgeschlagen: ' + (e?.message || 'unbekannt') }, { status: 500 })
  }
}
