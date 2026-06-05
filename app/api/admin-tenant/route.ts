// Ziel-Pfad im Repo: app/api/admin-tenant/route.ts  (NEU)
//
// Schreibt Paket, Lizenzen, Add-ons und Status eines Mandanten in tenant_billing.
// Geschuetzt per Token (gleicher Code wie die Uebersicht). Nur Schreiben dieser Felder.
//
// Aufruf: POST /api/admin-tenant?token=GEHEIM   mit JSON-Body
//   { slug, plan, seats, addons:[...], status, billing_interval }

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const FALLBACK_SECRET = 'aurora-seed-7Q2x-Kalyx-2026'
const PLANS = ['klein', 'mittel', 'gross', 'konzern']
const STATUSES = ['pilot', 'aktiv', 'gesperrt']
const INTERVALS = ['monatlich', 'jaehrlich']
const ADDONS = ['bi', 'sso', 'dedicated']   // zentrale Add-on-Liste, hier erweitern

export async function POST(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  if (token !== (process.env.SEED_SECRET || FALLBACK_SECRET)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }

  let admin: SupabaseClient
  try { admin = getAdminClient() } catch {
    return NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 503 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ungueltiger Body.' }, { status: 400 })
  }

  const slug = String(body.slug || '').trim()
  if (!slug) return NextResponse.json({ error: 'slug fehlt.' }, { status: 400 })

  const t = await admin.from('tenants').select('id').eq('slug', slug).maybeSingle()
  if (t.error || !t.data) return NextResponse.json({ error: 'Mandant nicht gefunden.' }, { status: 404 })
  const tenantId = (t.data as any).id

  const plan = PLANS.includes(body.plan) ? body.plan : 'klein'
  const status = STATUSES.includes(body.status) ? body.status : 'pilot'
  const billing_interval = INTERVALS.includes(body.billing_interval) ? body.billing_interval : 'monatlich'
  let seats = parseInt(body.seats, 10)
  if (!Number.isFinite(seats) || seats < 0) seats = 0
  const addons = Array.isArray(body.addons) ? body.addons.filter((a: any) => ADDONS.includes(a)) : []
  const activated_at = status === 'aktiv' ? new Date().toISOString() : null

  const row = {
    tenant_id: tenantId, plan, seats, addons, status, billing_interval,
    activated_at, updated_at: new Date().toISOString(),
  }

  const up = await admin.from('tenant_billing').upsert(row, { onConflict: 'tenant_id' }).select().maybeSingle()
  if (up.error) {
    return NextResponse.json({ error: 'Speichern fehlgeschlagen: ' + up.error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, gespeichert: up.data })
}
