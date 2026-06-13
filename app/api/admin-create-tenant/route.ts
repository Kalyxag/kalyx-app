// Ziel-Pfad im Repo: app/api/admin-create-tenant/route.ts  (NEU)
//
// Legt vertriebsgeführt einen kompletten neuen Kunden an: Mandant, Firmenprofil,
// Branding-Defaults, Onboarding- und Compliance-Status, das vereinbarte Paket
// (Plan, Lizenzen, Add-ons, Abrechnung) sowie den ersten Administrator, der per
// Einladung (E-Mail oder Link) sein eigenes Passwort setzt. Geschützt über den
// Support-Zugangscode. Schlaegt ein Schritt fehl, wird best-effort zurückgebaut,
// damit keine halben Kunden zurückbleiben.

import { NextResponse } from 'next/server'
import { seedDenied } from '@/lib/api/seed-secret'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 30
export const dynamic = 'force-dynamic'

const PLANS = ['klein', 'mittel', 'gross', 'konzern']
const STATUSES = ['pilot', 'aktiv', 'gesperrt']
const INTERVALS = ['monatlich', 'jaehrlich']
const ADDONS = ['white_label', 'ki_budget', 'api', 'support', 'bi', 'sso', 'dedicated']

function slugify(input: string): string {
  const base = (input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return base || 'firma'
}

async function cleanup(admin: SupabaseClient, tenantId: string | null, userId: string | null) {
  try { if (tenantId) await admin.from('tenants').delete().eq('id', tenantId) } catch {}
  try { if (userId) await admin.auth.admin.deleteUser(userId) } catch {}
}

export async function POST(req: Request) {
  const denied = seedDenied(req)
  if (denied) return denied

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: false, error: 'Ungültige Anfrage.' }, { status: 400 }) }

  const firma = String(body.firma || '').trim()
  const kontaktEmail = String(body.kontakt_email || '').trim().toLowerCase()
  const plan = PLANS.includes(body.plan) ? body.plan : 'klein'
  const status = STATUSES.includes(body.status) ? body.status : 'pilot'
  const billing_interval = INTERVALS.includes(body.billing_interval) ? body.billing_interval : 'monatlich'
  let seats = parseInt(body.seats, 10)
  if (!Number.isFinite(seats) || seats < 0) seats = 1
  const addons: string[] = Array.isArray(body.addons) ? body.addons.filter((a: any) => ADDONS.includes(a)) : []
  const notes = typeof body.notes === 'string' ? body.notes.slice(0, 4000) : ''

  const adminName = String(body.admin_name || '').trim()
  const adminEmail = String(body.admin_email || '').trim().toLowerCase()
  const einladen = body.einladen === 'link' ? 'link' : body.einladen === 'kein' ? 'kein' : 'mail'

  if (!firma) return NextResponse.json({ ok: false, error: 'Bitte einen Firmennamen angeben.' }, { status: 400 })
  if (adminEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adminEmail)) {
    return NextResponse.json({ ok: false, error: 'Die E-Mail des Administrators ist ungültig.' }, { status: 400 })
  }
  if (einladen !== 'kein' && !adminEmail) {
    return NextResponse.json({ ok: false, error: 'Für eine Einladung wird die E-Mail des Administrators benötigt.' }, { status: 400 })
  }

  let admin: SupabaseClient
  try { admin = getAdminClient() } catch { return NextResponse.json({ ok: false, error: 'Server ist nicht konfiguriert (Schlüssel fehlen).' }, { status: 503 }) }

  const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://kalyx.academy'
  const redirectTo = origin + '/willkommen'

  // 1) Eindeutigen Slug bestimmen
  let slug = slugify(firma)
  for (let i = 0; i < 60; i++) {
    const candidate = i === 0 ? slug : slug + '-' + (i + 1)
    const { data: exist } = await admin.from('tenants').select('id').eq('slug', candidate).maybeSingle()
    if (!exist) { slug = candidate; break }
  }

  // 2) Mandant anlegen
  const { data: tenant, error: tErr } = await admin.from('tenants').insert({ slug, status: 'trial' }).select('id').single()
  if (tErr || !tenant) {
    return NextResponse.json({ ok: false, error: 'Mandant konnte nicht angelegt werden.' }, { status: 500 })
  }
  const tenantId = tenant.id as string

  // 3) Profil, Branding, Onboarding, Compliance anlegen
  const grund = await Promise.all([
    admin.from('company_profiles').insert({ tenant_id: tenantId, display_name: firma, contact_email: kontaktEmail || null }),
    admin.from('branding').insert({ tenant_id: tenantId }),
    admin.from('onboarding_state').insert({ tenant_id: tenantId }),
    admin.from('compliance_profiles').insert({ tenant_id: tenantId }),
  ])
  if (grund.some(r => r.error)) {
    await cleanup(admin, tenantId, null)
    return NextResponse.json({ ok: false, error: 'Die Grunddaten konnten nicht angelegt werden.' }, { status: 500 })
  }

  // 4) Paket hinterlegen
  const billingRow: any = {
    tenant_id: tenantId, plan, seats, addons, billing_interval, status, notes,
    activated_at: status === 'aktiv' ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }
  const bRes = await admin.from('tenant_billing').upsert(billingRow, { onConflict: 'tenant_id' })
  if (bRes.error) {
    await cleanup(admin, tenantId, null)
    return NextResponse.json({ ok: false, error: 'Das Paket konnte nicht gespeichert werden.' }, { status: 500 })
  }

  // 5) Ersten Administrator anlegen und einladen
  let adminUserId: string | null = null
  let einladungLink: string | null = null
  let mailVersendet = false
  let mailHinweis = ''

  if (adminEmail) {
    if (einladen === 'mail') {
      const inv = await admin.auth.admin.inviteUserByEmail(adminEmail, {
        redirectTo, data: { full_name: adminName, firma, eingeladen_von: 'KALYX' },
      })
      if (!inv.error && inv.data?.user) {
        adminUserId = inv.data.user.id
        mailVersendet = true
      } else {
        const msg = (inv.error?.message || '').toLowerCase()
        if (msg.includes('already') || msg.includes('registered') || msg.includes('exists')) {
          mailHinweis = 'Diese E-Mail hat bereits ein Konto. Der Kunde wurde angelegt; lade den Administrator separat über das Team ein.'
        } else if (msg.includes('rate') || msg.includes('limit') || msg.includes('too many')) {
          mailHinweis = 'Der Kunde wurde angelegt, aber das Stundenlimit des Mailversands ist erreicht. Erzeuge die Einladung später erneut oder als Link.'
        } else {
          mailHinweis = 'Der Kunde wurde angelegt, aber der Mailversand ist noch nicht eingerichtet. Erzeuge stattdessen einen Einladungslink.'
        }
      }
    } else if (einladen === 'link') {
      const cu = await admin.auth.admin.createUser({ email: adminEmail, email_confirm: true })
      if (cu.error || !cu.data?.user) {
        try {
          const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
          const found = (list.data?.users || []).find(u => (u.email || '').toLowerCase() === adminEmail)
          adminUserId = found?.id || null
        } catch {}
      } else {
        adminUserId = cu.data.user.id
      }
      if (adminUserId) {
        const gl = await admin.auth.admin.generateLink({ type: 'recovery', email: adminEmail, options: { redirectTo } })
        einladungLink = (gl.data as any)?.properties?.action_link || null
      }
    }

    // app_users-Eintrag für den Administrator (optionale Spalten fängt die Reduktion ab)
    if (adminUserId) {
      const fullRow: any = { id: adminUserId, tenant_id: tenantId, email: adminEmail, access_level: 'admin', status: 'active', full_name: adminName, language: 'de' }
      const droppable = ['language', 'full_name']
      let row: any = { ...fullRow }
      for (let i = 0; i <= droppable.length; i++) {
        const r = await admin.from('app_users').upsert(row, { onConflict: 'id' })
        if (!r.error) break
        const next = droppable[i]
        if (next && next in row) { const c = { ...row }; delete c[next]; row = c } else break
      }
    }
  }

  // 6) Audit-Eintrag (nicht kritisch)
  try {
    await admin.from('audit_log').insert({ tenant_id: tenantId, actor_id: adminUserId, action: 'tenant_created', entity: 'tenant', entity_id: tenantId })
  } catch {}

  return NextResponse.json({
    ok: true, slug, tenantId,
    admin_angelegt: !!adminUserId,
    mail_versendet: mailVersendet,
    link: einladungLink,
    hinweis: mailHinweis || null,
  })
}
