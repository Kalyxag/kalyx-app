// Ziel-Pfad im Repo: app/api/admin-overview/route.ts  (NEU)
//
// Geschuetzte Uebersicht fuer den Support-Bereich. Liest serverseitig (service_role)
// alle Mandanten und rechnet je Mandant und global die Kennzahlen zusammen.
// Erkennt Demo-Konten ueber die Spalte is_demo, falls vorhanden, sonst ueber eine
// bekannte Liste von Demo-Slugs. Reine Lesezugriffe, keine Veraenderung.
//
// Aufruf: /api/admin-overview?token=GEHEIM   (gleicher Token wie die Seed-Routen)

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const FALLBACK_SECRET = 'aurora-seed-7Q2x-Kalyx-2026'

// Fallback, falls die Spalte is_demo noch nicht existiert.
const DEMO_SLUGS_FALLBACK = [
  'aurora-deep-ventures', 'lemanic-finanz', 'rhybio-sciences', 'akademie-lindenhof',
  'berna-retail', 'eulach-technik', 'sihltal-planung', 'limmat-markenwerk',
  'klinik-seefeld', 'glattal-assekuranz',
]

type TenantRow = { id: string; slug: string; status: string | null; is_demo?: boolean; created_at?: string | null }

async function run(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  if (token !== (process.env.SEED_SECRET || FALLBACK_SECRET)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }
  let admin: SupabaseClient
  try { admin = getAdminClient() } catch {
    return NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 503 })
  }

  // Mandanten laden. Erst mit is_demo versuchen, sonst ohne.
  let demoFromColumn = true
  let tenants: TenantRow[] = []
  {
    const withDemo = await admin.from('tenants').select('id,slug,status,is_demo,created_at')
    if (withDemo.error) {
      demoFromColumn = false
      const plain = await admin.from('tenants').select('id,slug,status,created_at')
      if (plain.error) return NextResponse.json({ error: 'Mandanten nicht lesbar: ' + plain.error.message }, { status: 500 })
      tenants = (plain.data as TenantRow[]) || []
    } else {
      tenants = (withDemo.data as TenantRow[]) || []
    }
  }

  // Hilfstabellen in je einem Zug laden, danach in JS gruppieren (Pilot-Datenmenge klein).
  const [profilesR, usersR, coursesR, attemptsR, certsR] = await Promise.all([
    admin.from('company_profiles').select('tenant_id,display_name,legal_name,sector'),
    admin.from('app_users').select('tenant_id'),
    admin.from('courses').select('tenant_id'),
    admin.from('exam_attempts').select('tenant_id,passed,score'),
    admin.from('certificates').select('tenant_id,status,score'),
  ])

  const profiles = (profilesR.data as any[]) || []
  const users = (usersR.data as any[]) || []
  const courses = (coursesR.data as any[]) || []
  const attempts = (attemptsR.data as any[]) || []
  const certs = (certsR.data as any[]) || []

  const profileBy = new Map<string, any>()
  for (const p of profiles) if (p.tenant_id) profileBy.set(p.tenant_id, p)

  const countBy = (rows: any[], pred?: (r: any) => boolean) => {
    const m = new Map<string, number>()
    for (const r of rows) { if (!r.tenant_id) continue; if (pred && !pred(r)) continue; m.set(r.tenant_id, (m.get(r.tenant_id) || 0) + 1) }
    return m
  }
  const maxScoreBy = (rows: any[]) => {
    const m = new Map<string, number>()
    for (const r of rows) { if (!r.tenant_id || typeof r.score !== 'number') continue; m.set(r.tenant_id, Math.max(m.get(r.tenant_id) || 0, r.score)) }
    return m
  }

  const usersByT = countBy(users)
  const ownCoursesByT = countBy(courses, r => !!r.tenant_id) // tenant-eigene Kurse
  const passedByT = countBy(attempts, r => r.passed === true)
  const certsByT = countBy(certs, r => r.status === 'gueltig')
  const bestByT = maxScoreBy(attempts)

  // Lizenz-/Paketdaten laden (tenant_billing). Fehlt die Tabelle noch, bleibt es leer.
  let billingVorhanden = true
  const billingByT = new Map<string, any>()
  {
    const b = await admin.from('tenant_billing').select('tenant_id,plan,seats,addons,billing_interval,status')
    if (b.error) {
      billingVorhanden = false
    } else {
      for (const row of (b.data as any[]) || []) if (row.tenant_id) billingByT.set(row.tenant_id, row)
    }
  }

  const isDemo = (t: TenantRow) => demoFromColumn ? !!t.is_demo : DEMO_SLUGS_FALLBACK.includes(t.slug)

  const mandanten = tenants.map(t => {
    const p = profileBy.get(t.id) || {}
    const bill = billingByT.get(t.id) || {}
    return {
      slug: t.slug,
      name: p.display_name || p.legal_name || t.slug,
      sector: p.sector || null,
      is_demo: isDemo(t),
      status: t.status || null,
      paket: bill.plan || null,
      lizenzen: typeof bill.seats === 'number' ? bill.seats : null,
      addons: Array.isArray(bill.addons) ? bill.addons : [],
      abrechnung: bill.billing_interval || null,
      konto_status: bill.status || null,
      mitglieder: usersByT.get(t.id) || 0,
      kurse_eigen: ownCoursesByT.get(t.id) || 0,
      pruefungen_bestanden: passedByT.get(t.id) || 0,
      nachweise: certsByT.get(t.id) || 0,
      bestnote: bestByT.get(t.id) || 0,
      erstellt: t.created_at || null,
    }
  }).sort((a, b) => Number(a.is_demo) - Number(b.is_demo) || b.nachweise - a.nachweise)

  const sum = (list: typeof mandanten, key: 'mitglieder' | 'kurse_eigen' | 'pruefungen_bestanden' | 'nachweise') => list.reduce((s, m) => s + (m[key] || 0), 0)
  const best = (list: typeof mandanten) => list.reduce((s, m) => Math.max(s, m.bestnote || 0), 0)

  const kunden = mandanten.filter(m => !m.is_demo)
  const demo = mandanten.filter(m => m.is_demo)

  const block = (list: typeof mandanten) => ({
    mandanten: list.length,
    mitglieder: sum(list, 'mitglieder'),
    kurse_eigen: sum(list, 'kurse_eigen'),
    pruefungen_bestanden: sum(list, 'pruefungen_bestanden'),
    nachweise: sum(list, 'nachweise'),
    bestnote: best(list),
  })

  return NextResponse.json({
    ok: true,
    demo_quelle: demoFromColumn ? 'spalte is_demo' : 'bekannte Demo-Liste (Spalte fehlt)',
    billing_vorhanden: billingVorhanden,
    global: { kunden: kunden.length, demo: demo.length, ...block(mandanten) },
    nur_kunden: block(kunden),
    nur_demo: block(demo),
    mandanten,
  })
}

export async function GET(req: Request) { return run(req) }
