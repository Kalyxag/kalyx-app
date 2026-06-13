// Ziel-Pfad im Repo: app/api/admin-integrations/route.ts
//
// GET  ?token=&slug=            -> Integrationen eines Mandanten (Status, Config, letztes Ergebnis)
// POST ?token=  { slug, mode:'save', items:[{key,status,config}] }  -> speichern
// POST ?token=  { slug, mode:'test', key, url }                     -> echten Test-Webhook senden
//
// Geschuetzt per Token (gleich wie Uebersicht und admin-tenant).

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { INTEGRATION_MAP } from '@/lib/integrations/catalog'
import { sendWebhook } from '@/lib/integrations/webhook'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const FALLBACK_SECRET = 'aurora-seed-7Q2x-Kalyx-2026'
const STATUSES = ['aktiv', 'vorbereitung', 'inaktiv']

// Liefert den Admin-Client oder null; bei null hat authError() die Antwort.
function authAdmin(req: Request): SupabaseClient | null {
  const token = new URL(req.url).searchParams.get('token') || ''
  if (token !== (process.env.SEED_SECRET || FALLBACK_SECRET)) return null
  try { return getAdminClient() } catch { return null }
}
function authError() { return NextResponse.json({ error: 'Nicht autorisiert oder Server nicht konfiguriert.' }, { status: 401 }) }

async function tenantId(admin: SupabaseClient, slug: string): Promise<string | null> {
  const t = await admin.from('tenants').select('id').eq('slug', slug).maybeSingle()
  if (t.error || !t.data) return null
  return (t.data as any).id
}

export async function GET(req: Request) {
  const admin = authAdmin(req)
  if (!admin) return authError()
  const slug = (new URL(req.url).searchParams.get('slug') || '').trim()
  if (!slug) return NextResponse.json({ error: 'slug fehlt.' }, { status: 400 })
  const tid = await tenantId(admin, slug)
  if (!tid) return NextResponse.json({ error: 'Mandant nicht gefunden.' }, { status: 404 })

  const r = await admin.from('tenant_integrations')
    .select('integration_key,status,config,last_result,updated_at').eq('tenant_id', tid)
  if (r.error) {
    const fehlt = /relation .* does not exist/i.test(r.error.message)
    return NextResponse.json({ error: 'Laden fehlgeschlagen: ' + r.error.message, tabelle_fehlt: fehlt }, { status: 500 })
  }
  const items: Record<string, any> = {}
  for (const row of (r.data || []) as any[]) {
    items[row.integration_key] = { status: row.status, config: row.config || {}, last_result: row.last_result || null, updated_at: row.updated_at }
  }
  return NextResponse.json({ ok: true, items })
}

export async function POST(req: Request) {
  const admin = authAdmin(req)
  if (!admin) return authError()
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungueltiger Body.' }, { status: 400 }) }

  const slug = String(body.slug || '').trim()
  if (!slug) return NextResponse.json({ error: 'slug fehlt.' }, { status: 400 })
  const tid = await tenantId(admin, slug)
  if (!tid) return NextResponse.json({ error: 'Mandant nicht gefunden.' }, { status: 404 })

  // ---- Test-Versand ----
  if (body.mode === 'test') {
    const key = String(body.key || '')
    const def = INTEGRATION_MAP[key]
    if (!def || !def.implementiert) return NextResponse.json({ error: 'Diese Integration ist noch nicht aktiv schaltbar.' }, { status: 400 })
    const url = String(body.url || '')
    const result = await sendWebhook(key, url, 'KALYX Testnachricht', 'Wenn du das siehst, funktioniert die Verbindung zu KALYX.')
    await admin.from('tenant_integrations')
      .upsert({ tenant_id: tid, integration_key: key, config: { webhook_url: url }, last_result: result, updated_at: new Date().toISOString() }, { onConflict: 'tenant_id,integration_key' })
    return NextResponse.json({ ok: result.ok, result })
  }

  // ---- Speichern ----
  const items = Array.isArray(body.items) ? body.items : []
  const now = new Date().toISOString()
  const rows = items.map((it: any) => {
    const def = INTEGRATION_MAP[it.key]
    let status = STATUSES.includes(it.status) ? it.status : 'inaktiv'
    // Ehrlichkeit erzwingen: nicht fertige Integrationen koennen nie "aktiv" sein
    if (status === 'aktiv' && (!def || !def.implementiert)) status = 'vorbereitung'
    const config = (it.config && typeof it.config === 'object') ? it.config : {}
    return { tenant_id: tid, integration_key: String(it.key), status, config, updated_at: now }
  }).filter((r: any) => INTEGRATION_MAP[r.integration_key])

  if (rows.length === 0) return NextResponse.json({ ok: true, gespeichert: 0 })
  const up = await admin.from('tenant_integrations').upsert(rows, { onConflict: 'tenant_id,integration_key' })
  if (up.error) {
    const fehlt = /relation .* does not exist/i.test(up.error.message)
    return NextResponse.json({ error: 'Speichern fehlgeschlagen: ' + up.error.message, tabelle_fehlt: fehlt }, { status: 500 })
  }
  return NextResponse.json({ ok: true, gespeichert: rows.length })
}
