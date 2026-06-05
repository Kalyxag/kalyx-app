// Ziel-Pfad im Repo: app/api/admin-tenant/route.ts
//
// GET  /api/admin-tenant?token=GEHEIM&slug=...   -> Detaildaten eines Mandanten
//        (Profil, Kontakt, Paket/Lizenzen/Add-ons/Status, Notizen, Zeitstempel)
// POST /api/admin-tenant?token=GEHEIM            -> speichert Paket/Lizenzen/Add-ons/
//        Status/Abrechnung/Notizen in tenant_billing
//
// Geschuetzt per Token (gleicher Code wie die Uebersicht).

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

function auth(req: Request): { ok: true; admin: SupabaseClient } | { ok: false; res: NextResponse } {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  if (token !== (process.env.SEED_SECRET || FALLBACK_SECRET)) {
    return { ok: false, res: NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 }) }
  }
  try { return { ok: true, admin: getAdminClient() } }
  catch { return { ok: false, res: NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 503 }) } }
}

export async function GET(req: Request) {
  const a = auth(req); if (!a.ok) return a.res
  const admin = a.admin
  const slug = (new URL(req.url).searchParams.get('slug') || '').trim()
  if (!slug) return NextResponse.json({ error: 'slug fehlt.' }, { status: 400 })

  const t = await admin.from('tenants').select('id,slug,status,is_demo,created_at').eq('slug', slug).maybeSingle()
  if (t.error || !t.data) return NextResponse.json({ error: 'Mandant nicht gefunden.' }, { status: 404 })
  const tenantId = (t.data as any).id

  // Profil (Kontakt). Felder defensiv, falls einzelne fehlen.
  let profil: any = {}
  {
    const p = await admin.from('company_profiles')
      .select('display_name,legal_name,sector,country,company_size,website,uid_handelsregister,contact_name,contact_email,contact_phone')
      .eq('tenant_id', tenantId).maybeSingle()
    if (!p.error && p.data) profil = p.data
  }

  // Billing inkl. Notizen
  let billing: any = null
  {
    const b = await admin.from('tenant_billing')
      .select('plan,seats,addons,status,billing_interval,notes,activated_at,updated_at')
      .eq('tenant_id', tenantId).maybeSingle()
    if (!b.error) billing = b.data
  }

  return NextResponse.json({
    ok: true,
    slug: (t.data as any).slug,
    is_demo: !!(t.data as any).is_demo,
    erstellt: (t.data as any).created_at || null,
    profil: {
      legal_name: profil.legal_name || null,
      country: profil.country || null,
      company_size: profil.company_size || null,
      website: profil.website || null,
      uid: profil.uid_handelsregister || null,
      contact_name: profil.contact_name || null,
      contact_email: profil.contact_email || null,
      contact_phone: profil.contact_phone || null,
    },
    billing: billing ? {
      plan: billing.plan || 'klein',
      seats: typeof billing.seats === 'number' ? billing.seats : 1,
      addons: Array.isArray(billing.addons) ? billing.addons : [],
      status: billing.status || 'pilot',
      billing_interval: billing.billing_interval || 'monatlich',
      notes: billing.notes || '',
      activated_at: billing.activated_at || null,
      updated_at: billing.updated_at || null,
    } : null,
  })
}

export async function POST(req: Request) {
  const a = auth(req); if (!a.ok) return a.res
  const admin = a.admin

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
  if (seats > 1000000) seats = 1000000
  const addons = Array.isArray(body.addons) ? body.addons.filter((a: any) => ADDONS.includes(a)) : []
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''
  const activated_at = status === 'aktiv' ? new Date().toISOString() : null

  const row = {
    tenant_id: tenantId, plan, seats, addons, status, billing_interval, notes,
    activated_at, updated_at: new Date().toISOString(),
  }

  const up = await admin.from('tenant_billing').upsert(row, { onConflict: 'tenant_id' }).select().maybeSingle()
  if (up.error) {
    return NextResponse.json({ error: 'Speichern fehlgeschlagen: ' + up.error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true, gespeichert: up.data })
}
