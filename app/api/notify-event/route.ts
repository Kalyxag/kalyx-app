// Ziel-Pfad im Repo: app/api/notify-event/route.ts
//
// Loest die aktiven Webhook-Integrationen (Slack / Teams) eines Mandanten aus,
// wenn eine lernende Person einen Nachweis erhalten hat.
//
// Sicherheit:
// - Der Aufrufer weist sich mit seinem Supabase-Access-Token aus.
// - Der Mandant wird serverseitig aus app_users ermittelt, nie vom Client.
// - Gesendet wird nur, wenn fuer user + course ein gueltiger Nachweis existiert.
// - Die Webhook-Adresse kommt aus der Datenbank, nie aus dem Browser.
// - Fehler beim Versand blockieren die lernende Person nie.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { INTEGRATION_MAP } from '@/lib/integrations/catalog'
import { sendWebhook, buildEventText } from '@/lib/integrations/webhook'

export const runtime = 'nodejs'

const WEBHOOK_KEYS = ['slack_webhook', 'teams_webhook']

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    const courseId = String(body.course_id || '')
    if (!token || !courseId) {
      return NextResponse.json({ ok: false, error: 'fehlende Angaben' }, { status: 400 })
    }

    const admin = getAdminClient()

    // 1) Aufrufer verifizieren
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const user = ures?.user
    if (uerr || !user) {
      return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })
    }

    // 2) Mandant serverseitig ermitteln
    const { data: au } = await admin.from('app_users').select('tenant_id').eq('id', user.id).maybeSingle()
    const tenantId = (au as any)?.tenant_id
    if (!tenantId) {
      return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })
    }

    // 3) Echtes Ereignis pruefen: gueltiger Nachweis fuer user + course
    const { data: cert } = await admin.from('certificates')
      .select('recipient_name,title,issued_at')
      .eq('user_id', user.id).eq('course_id', courseId).eq('status', 'gueltig')
      .order('issued_at', { ascending: false }).limit(1).maybeSingle()
    if (!cert) {
      return NextResponse.json({ ok: true, sent: 0 }) // kein passendes Ereignis, still beenden
    }

    // 4) Aktive Webhook-Integrationen des Mandanten laden
    const { data: rows } = await admin.from('tenant_integrations')
      .select('integration_key,status,config')
      .eq('tenant_id', tenantId).in('integration_key', WEBHOOK_KEYS).eq('status', 'aktiv')

    const items = (rows || []).filter((r: any) => r?.config?.webhook_url)
    if (items.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    // 5) Datensparsame Meldung bauen und senden (Fehler einzeln abfangen)
    const title = (cert as any).title || 'eine Schulung'
    const action = 'hat den Nachweis für "' + title + '" erhalten.'
    let sent = 0
    for (const it of items) {
      const def = INTEGRATION_MAP[(it as any).integration_key]
      if (!def || !def.implementiert) continue
      const showNames = (it as any).config?.show_names === true
      const text = buildEventText(showNames, (cert as any).recipient_name || null, action)
      try {
        const result = await sendWebhook((it as any).integration_key, (it as any).config.webhook_url, 'KALYX', text)
        if (result.ok) sent++
        // letztes Ergebnis je Integration festhalten (fuer die Support-Anzeige)
        await admin.from('tenant_integrations')
          .update({ last_result: result, updated_at: new Date().toISOString() })
          .eq('tenant_id', tenantId).eq('integration_key', (it as any).integration_key)
      } catch {
        // Versand-Fehler ignorieren, niemals den Lernfluss stoeren
      }
    }

    return NextResponse.json({ ok: true, sent })
  } catch {
    // niemals nach aussen werfen
    return NextResponse.json({ ok: true, sent: 0 })
  }
}
