// Ziel-Pfad im Repo: app/api/registrieren/route.ts
//
// Legt beim Signup atomar an: Auth-User -> Mandant -> Firmenprofil ->
// Branding (Defaults) -> Onboarding-Status -> Compliance-Profil ->
// ersten Admin-Benutzer. Bei Fehler wird best-effort zurueckgerollt.
import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

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
  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ungueltige Anfrage.' }, { status: 400 }) }

  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  const companyName = String(body?.companyName || '').trim()
  const consent = body?.consent === true

  if (!email || !password || !companyName) {
    return NextResponse.json({ error: 'Bitte Firmenname, E-Mail und Passwort ausfuellen.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }, { status: 400 })
  }
  if (!consent) {
    return NextResponse.json({ error: 'Bitte den Datenschutz-/AGB-Bedingungen zustimmen.' }, { status: 400 })
  }

  let admin: SupabaseClient
  try { admin = getAdminClient() } catch { return NextResponse.json({ error: 'Server ist nicht konfiguriert (Schluessel fehlen).' }, { status: 503 }) }

  // 1) Auth-User anlegen (ohne E-Mail-Bestaetigung, damit der Pilot reibungslos testbar ist)
  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (userErr || !created?.user) {
    const exists = /registered|exists|already/i.test(userErr?.message || '')
    return NextResponse.json(
      { error: exists ? 'Diese E-Mail ist bereits registriert.' : 'Benutzer konnte nicht angelegt werden.' },
      { status: 400 },
    )
  }
  const userId = created.user.id

  // 2) Eindeutigen Slug (Subdomain) bestimmen
  let slug = slugify(companyName)
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`
    const { data: exist } = await admin.from('tenants').select('id').eq('slug', candidate).maybeSingle()
    if (!exist) { slug = candidate; break }
  }

  // 3) Mandant anlegen
  const { data: tenant, error: tErr } = await admin
    .from('tenants')
    .insert({ slug, status: 'trial' })
    .select('id')
    .single()
  if (tErr || !tenant) {
    await cleanup(admin, null, userId)
    return NextResponse.json({ error: 'Mandant konnte nicht angelegt werden.' }, { status: 500 })
  }
  const tenantId = tenant.id as string

  // 4) Profile, Branding, Onboarding und Admin-Benutzer anlegen
  const results = await Promise.all([
    admin.from('company_profiles').insert({ tenant_id: tenantId, display_name: companyName, contact_email: email }),
    admin.from('branding').insert({ tenant_id: tenantId }),
    admin.from('onboarding_state').insert({ tenant_id: tenantId }),
    admin.from('compliance_profiles').insert({ tenant_id: tenantId }),
    admin.from('app_users').insert({
      id: userId,
      tenant_id: tenantId,
      email,
      access_level: 'admin',
      status: 'active',
      consent_at: new Date().toISOString(),
    }),
  ])
  if (results.some(r => r.error)) {
    await cleanup(admin, tenantId, userId)
    return NextResponse.json({ error: 'Einrichtung fehlgeschlagen. Bitte erneut versuchen.' }, { status: 500 })
  }

  // 5) Audit-Eintrag (nicht kritisch)
  try {
    await admin.from('audit_log').insert({
      tenant_id: tenantId, actor_id: userId, action: 'tenant_created', entity: 'tenant', entity_id: tenantId,
    })
  } catch {}

  return NextResponse.json({ ok: true, slug, tenantId })
}
