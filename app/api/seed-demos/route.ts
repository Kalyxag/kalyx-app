// Ziel-Pfad im Repo: app/api/seed-demos/route.ts  (NEU)
//
// Legt alle Demo-Firmen als ECHTE Supabase-Konten an, nutzbar ueber /anmelden.
// Fiktive Namen, jede Firma mit Abteilungen, Rollen, Team und einigen bestandenen
// Pruefungen mit Nachweisen (fuer realistische Kennzahlen). Markiert alle Demo-
// Mandanten (inkl. Aurora) mit is_demo = true.
//
// Voraussetzung: die Spalte tenants.is_demo muss existieren (siehe SQL-Datei).
// Falls sie fehlt, laeuft die Route trotzdem durch und vermerkt es in "notizen".
//
// Aufruf (einmal im Browser oeffnen):
//   /api/seed-demos?token=GEHEIM
// Token = process.env.SEED_SECRET oder der Fallback unten. Idempotent: ein
// vorhandener Demo-Mandant wird wiederverwendet und seine Daten frisch aufgebaut.
// Nach erfolgreichem Lauf darf die Datei wieder geloescht werden. Reine Testdaten.

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const maxDuration = 60
export const dynamic = 'force-dynamic'

const FALLBACK_SECRET = 'aurora-seed-7Q2x-Kalyx-2026'
const DEMO_PASSWORD = 'KalyxDemo!2026'
const AURORA_SLUG = 'aurora-deep-ventures'

const FRAMEWORKS_BY_SECTOR: Record<string, string[]> = {
  finance: ['DSG (CH)', 'FINMA', 'ISO 27001'],
  pharma: ['DSG (CH)', 'GxP / GMP', 'ISO 27001'],
  bildung: ['DSG (CH)', 'ISO 27001'],
  retail: ['DSG (CH)', 'ISO 27001'],
  industrie: ['DSG (CH)', 'ISO 27001'],
  sonstige: ['DSG (CH)'],
}

type Member = { email: string; full_name: string; position: string; access_level: string; deptIdx: number }
type Demo = {
  slug: string; display: string; legal: string; sector: string; country: string; size: string; website: string;
  depts: { name: string; description: string }[]
  roles: { name: string; deptIdx: number; access_level: string }[]
  team: Member[]
  passes: number
}

// Fiktive Firmen. Reale Markennamen wurden bewusst durch erfundene ersetzt.
const DEMOS: Demo[] = [
  {
    slug: 'lemanic-finanz', display: 'Lemanic Finanz', legal: 'Lemanic Finanz AG', sector: 'finance', country: 'CH', size: '51-200', website: 'lemanic-finanz.ch',
    depts: [{ name: 'Compliance', description: 'Regulatorik und Sorgfaltspflichten' }, { name: 'Kundenberatung', description: 'Private und institutionelle Kunden' }],
    roles: [{ name: 'Compliance Officer', deptIdx: 0, access_level: 'manager' }, { name: 'Kundenberater', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@lemanic-finanz.ch', full_name: 'Claire Rochat', position: 'Managing Director', access_level: 'admin', deptIdx: 0 },
      { email: 'sophie.berger@lemanic-finanz.ch', full_name: 'Sophie Berger', position: 'Compliance Officer', access_level: 'manager', deptIdx: 0 },
      { email: 'luc.favre@lemanic-finanz.ch', full_name: 'Luc Favre', position: 'Kundenberater', access_level: 'learner', deptIdx: 1 },
    ], passes: 7,
  },
  {
    slug: 'rhybio-sciences', display: 'RhyBio Sciences', legal: 'RhyBio Sciences AG', sector: 'pharma', country: 'CH', size: '51-200', website: 'rhybio.ch',
    depts: [{ name: 'Qualitaetssicherung', description: 'QA und QC' }, { name: 'Regulatory Affairs', description: 'Zulassung und Behoerden' }],
    roles: [{ name: 'QA Manager', deptIdx: 0, access_level: 'manager' }, { name: 'Lab Scientist', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@rhybio.ch', full_name: 'Martin Wyss', position: 'Head of Quality', access_level: 'admin', deptIdx: 0 },
      { email: 'petra.iten@rhybio.ch', full_name: 'Petra Iten', position: 'Regulatory Manager', access_level: 'manager', deptIdx: 1 },
      { email: 'jonas.frei@rhybio.ch', full_name: 'Jonas Frei', position: 'Lab Scientist', access_level: 'learner', deptIdx: 0 },
    ], passes: 6,
  },
  {
    slug: 'akademie-lindenhof', display: 'Akademie Lindenhof', legal: 'Akademie Lindenhof AG', sector: 'bildung', country: 'CH', size: '11-50', website: 'akademie-lindenhof.ch',
    depts: [{ name: 'Weiterbildung', description: 'Kurse und Lehrgaenge' }, { name: 'Datenschutz', description: 'Datenschutz und Verwaltung' }],
    roles: [{ name: 'Datenschutzbeauftragte', deptIdx: 1, access_level: 'manager' }, { name: 'Dozentin', deptIdx: 0, access_level: 'learner' }],
    team: [
      { email: 'admin@akademie-lindenhof.ch', full_name: 'Regula Steiner', position: 'Leiterin Weiterbildung', access_level: 'admin', deptIdx: 0 },
      { email: 'beat.hofer@akademie-lindenhof.ch', full_name: 'Beat Hofer', position: 'Datenschutzbeauftragter', access_level: 'manager', deptIdx: 1 },
      { email: 'mara.koch@akademie-lindenhof.ch', full_name: 'Mara Koch', position: 'Dozentin', access_level: 'learner', deptIdx: 0 },
    ], passes: 5,
  },
  {
    slug: 'berna-retail', display: 'Berna Retail Group', legal: 'Berna Retail Group AG', sector: 'retail', country: 'CH', size: '201-1000', website: 'berna-retail.ch',
    depts: [{ name: 'HR und Training', description: 'Personal und Schulung' }, { name: 'Filialbetrieb', description: 'Verkauf und Filialen' }],
    roles: [{ name: 'Filialleiter', deptIdx: 1, access_level: 'manager' }, { name: 'Verkaufsmitarbeitende', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@berna-retail.ch', full_name: 'Nicole Aebi', position: 'HR und Training Managerin', access_level: 'admin', deptIdx: 0 },
      { email: 'reto.schmid@berna-retail.ch', full_name: 'Reto Schmid', position: 'Filialleiter', access_level: 'manager', deptIdx: 1 },
      { email: 'selina.moser@berna-retail.ch', full_name: 'Selina Moser', position: 'Verkauf', access_level: 'learner', deptIdx: 1 },
    ], passes: 8,
  },
  {
    slug: 'eulach-technik', display: 'Eulach Industrietechnik', legal: 'Eulach Industrietechnik AG', sector: 'industrie', country: 'CH', size: '51-200', website: 'eulach-technik.ch',
    depts: [{ name: 'Arbeitssicherheit', description: 'Safety und Gesundheitsschutz' }, { name: 'Produktion', description: 'Fertigung und Maschinen' }],
    roles: [{ name: 'Safety Officer', deptIdx: 0, access_level: 'manager' }, { name: 'Maschinenfuehrer', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@eulach-technik.ch', full_name: 'Hans Bachmann', position: 'Safety and Compliance Officer', access_level: 'admin', deptIdx: 0 },
      { email: 'daniela.roth@eulach-technik.ch', full_name: 'Daniela Roth', position: 'Produktionsleiterin', access_level: 'manager', deptIdx: 1 },
      { email: 'kevin.graf@eulach-technik.ch', full_name: 'Kevin Graf', position: 'Maschinenfuehrer', access_level: 'learner', deptIdx: 1 },
    ], passes: 6,
  },
  {
    slug: 'sihltal-planung', display: 'Sihltal Planung', legal: 'Sihltal Planung AG', sector: 'industrie', country: 'CH', size: '11-50', website: 'sihltal-planung.ch',
    depts: [{ name: 'Projektleitung', description: 'Planung und Steuerung' }, { name: 'Qualitaet', description: 'Qualitaet und Prozesse' }],
    roles: [{ name: 'Projektleiter', deptIdx: 0, access_level: 'manager' }, { name: 'Planer', deptIdx: 0, access_level: 'learner' }],
    team: [
      { email: 'admin@sihltal-planung.ch', full_name: 'Andrea Meier', position: 'Geschaeftsfuehrerin', access_level: 'admin', deptIdx: 1 },
      { email: 'philipp.brun@sihltal-planung.ch', full_name: 'Philipp Brun', position: 'Projektleiter', access_level: 'manager', deptIdx: 0 },
      { email: 'tobias.keller@sihltal-planung.ch', full_name: 'Tobias Keller', position: 'Planer', access_level: 'learner', deptIdx: 0 },
    ], passes: 4,
  },
  {
    slug: 'limmat-markenwerk', display: 'Limmat Markenwerk', legal: 'Limmat Markenwerk AG', sector: 'sonstige', country: 'CH', size: '11-50', website: 'limmat-markenwerk.ch',
    depts: [{ name: 'Kreation', description: 'Design und Konzept' }, { name: 'Beratung', description: 'Kundenberatung und Strategie' }],
    roles: [{ name: 'Art Director', deptIdx: 0, access_level: 'manager' }, { name: 'Beraterin', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@limmat-markenwerk.ch', full_name: 'Sandra Vogt', position: 'Inhaberin', access_level: 'admin', deptIdx: 1 },
      { email: 'nico.baumann@limmat-markenwerk.ch', full_name: 'Nico Baumann', position: 'Art Director', access_level: 'manager', deptIdx: 0 },
      { email: 'lea.brunner@limmat-markenwerk.ch', full_name: 'Lea Brunner', position: 'Beraterin', access_level: 'learner', deptIdx: 1 },
    ], passes: 5,
  },
  {
    slug: 'klinik-seefeld', display: 'Klinik Seefeld', legal: 'Klinik Seefeld AG', sector: 'sonstige', country: 'CH', size: '201-1000', website: 'klinik-seefeld.ch',
    depts: [{ name: 'Qualitaet', description: 'Qualitaet und Patientensicherheit' }, { name: 'Pflege', description: 'Pflege und Betreuung' }],
    roles: [{ name: 'Qualitaetsmanager', deptIdx: 0, access_level: 'manager' }, { name: 'Pflegefachperson', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@klinik-seefeld.ch', full_name: 'Ursula Frei', position: 'Aerztliche Leiterin', access_level: 'admin', deptIdx: 0 },
      { email: 'markus.lehmann@klinik-seefeld.ch', full_name: 'Markus Lehmann', position: 'Qualitaetsmanager', access_level: 'manager', deptIdx: 0 },
      { email: 'sina.huber@klinik-seefeld.ch', full_name: 'Sina Huber', position: 'Pflegefachperson', access_level: 'learner', deptIdx: 1 },
    ], passes: 9,
  },
  {
    slug: 'glattal-assekuranz', display: 'Glattal Assekuranz', legal: 'Glattal Assekuranz AG', sector: 'finance', country: 'CH', size: '201-1000', website: 'glattal-assekuranz.ch',
    depts: [{ name: 'Compliance', description: 'Regulatorik und Aufsicht' }, { name: 'Underwriting', description: 'Risikopruefung und Policen' }],
    roles: [{ name: 'Compliance Officer', deptIdx: 0, access_level: 'manager' }, { name: 'Underwriter', deptIdx: 1, access_level: 'learner' }],
    team: [
      { email: 'admin@glattal-assekuranz.ch', full_name: 'Roland Suter', position: 'Direktor', access_level: 'admin', deptIdx: 0 },
      { email: 'karin.widmer@glattal-assekuranz.ch', full_name: 'Karin Widmer', position: 'Compliance Officer', access_level: 'manager', deptIdx: 0 },
      { email: 'fabio.rossi@glattal-assekuranz.ch', full_name: 'Fabio Rossi', position: 'Underwriter', access_level: 'learner', deptIdx: 1 },
    ], passes: 6,
  },
]

// Scores fuer die Pruefungen (gestreut, eine Bestnote oben).
const SCORE_POOL = [98, 95, 92, 90, 88, 86, 84, 82, 80, 78, 91, 87, 83]

function uuid() { return randomUUID() }
function certNumber(): string {
  return 'KX-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 10).toUpperCase()
}
function daysAgoIso(d: number): string { return new Date(Date.now() - d * 86400000).toISOString() }

async function insertResilient(admin: SupabaseClient, table: string, rows: any[]) {
  if (!rows || rows.length === 0) return { error: null as any, dropped: [] as string[] }
  let cur = rows.map(r => ({ ...r }))
  const dropped: string[] = []
  for (let i = 0; i < 15; i++) {
    const { error } = await admin.from(table).insert(cur)
    if (!error) return { error: null as any, dropped }
    const msg = (error as any).message || ''
    const m = msg.match(/find the '([^']+)' column/) || msg.match(/column "([^"]+)"/) || msg.match(/'([a-zA-Z0-9_]+)' column/)
    const col = m && m[1]
    if (col && cur[0] && Object.prototype.hasOwnProperty.call(cur[0], col)) {
      dropped.push(col); cur = cur.map(r => { const c = { ...r }; delete c[col]; return c }); continue
    }
    return { error, dropped }
  }
  return { error: { message: 'Zu viele unbekannte Spalten in ' + table }, dropped }
}

async function deleteAuthUsersByEmail(admin: SupabaseClient, emails: string[]) {
  const targets = new Set(emails.map(e => e.toLowerCase()))
  for (let page = 1; page <= 30; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data || !data.users || data.users.length === 0) break
    for (const u of data.users) {
      if (u.email && targets.has(u.email.toLowerCase())) { try { await admin.auth.admin.deleteUser(u.id) } catch {} }
    }
    if (data.users.length < 200) break
  }
}

const CHILD_TABLES = ['audit_log', 'certificates', 'exam_attempts', 'course_questions', 'course_modules', 'course_assignments', 'courses', 'roles', 'departments', 'app_users', 'onboarding_state', 'compliance_profiles', 'branding', 'company_profiles']

async function run(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') || ''
  if (token !== (process.env.SEED_SECRET || FALLBACK_SECRET)) {
    return NextResponse.json({ error: 'Nicht autorisiert. Bitte ?token=... korrekt angeben.' }, { status: 401 })
  }
  let admin: SupabaseClient
  try { admin = getAdminClient() } catch {
    return NextResponse.json({ error: 'Server nicht konfiguriert (SUPABASE_SERVICE_ROLE_KEY fehlt).' }, { status: 503 })
  }

  const notes: string[] = []

  // Globale Katalog-Kurse laden, auf die wir die Demo-Abschluesse beziehen.
  const { data: catData } = await admin.from('courses').select('id,title').is('tenant_id', null).limit(20)
  const catalog = (catData as { id: string; title: string }[]) || []
  if (catalog.length === 0) notes.push('Kein globaler Katalog gefunden, Pruefungen und Nachweise werden uebersprungen.')

  let firmenOk = 0, usersOk = 0, attemptsOk = 0, certsOk = 0
  let catIdx = 0, scoreIdx = 0

  for (const d of DEMOS) {
    // Aufraeumen (Mandant wiederverwenden), dann frisch aufbauen
    let tid = ''
    const { data: ex } = await admin.from('tenants').select('id').eq('slug', d.slug).maybeSingle()
    if (ex && (ex as any).id) {
      tid = (ex as any).id
      for (const t of CHILD_TABLES) { try { await admin.from(t).delete().eq('tenant_id', tid) } catch {} }
    } else {
      const { data: t, error } = await admin.from('tenants').insert({ slug: d.slug, status: 'trial' }).select('id').single()
      if (error || !t) { notes.push('Mandant ' + d.slug + ' uebersprungen: ' + (error?.message || 'unbekannt')); continue }
      tid = (t as any).id
    }
    await deleteAuthUsersByEmail(admin, d.team.map(m => m.email))

    // Profile, Branding, Onboarding (abgeschlossen), Compliance
    await insertResilient(admin, 'company_profiles', [{
      tenant_id: tid, display_name: d.display, legal_name: d.legal, sector: d.sector, country: d.country,
      company_size: d.size, website: d.website, contact_name: d.team[0].full_name, contact_email: d.team[0].email, languages: ['de'],
    }])
    try { await admin.from('branding').insert({ tenant_id: tid }) } catch {}
    await insertResilient(admin, 'onboarding_state', [{ tenant_id: tid, step_profile: true, step_departments: true, step_compliance: true, step_courses: true, step_branding: true, step_users: true }])
    await insertResilient(admin, 'compliance_profiles', [{
      tenant_id: tid, frameworks: FRAMEWORKS_BY_SECTOR[d.sector] || ['DSG (CH)'],
      esignature_required: true, recert_interval_default: 'jaehrlich', retention_months: 120, residency_confirmed: false,
    }])

    // Abteilungen + Rollen
    const deptIds: string[] = d.depts.map(() => uuid())
    await insertResilient(admin, 'departments', d.depts.map((dep, i) => ({ id: deptIds[i], tenant_id: tid, name: dep.name, description: dep.description })))
    await insertResilient(admin, 'roles', d.roles.map(r => ({ id: uuid(), tenant_id: tid, name: r.name, department_id: deptIds[r.deptIdx] || null, access_level: r.access_level })))

    // Auth-Benutzer + app_users
    const uids: string[] = []
    let userFail = false
    for (const m of d.team) {
      const { data: cu, error } = await admin.auth.admin.createUser({ email: m.email, password: DEMO_PASSWORD, email_confirm: true })
      if (error || !cu?.user) { notes.push('Benutzer ' + m.email + ' uebersprungen: ' + (error?.message || 'unbekannt')); userFail = true; break }
      uids.push(cu.user.id)
    }
    if (userFail) continue
    await insertResilient(admin, 'app_users', d.team.map((m, i) => ({
      id: uids[i], tenant_id: tid, email: m.email, access_level: m.access_level, status: 'active',
      consent_at: new Date().toISOString(), full_name: m.full_name, position: m.position, department: d.depts[m.deptIdx]?.name || null, language: 'de',
    })))
    usersOk += d.team.length
    firmenOk++

    // Abschluesse: Pruefungen + Nachweise auf Katalog-Kurse
    if (catalog.length > 0) {
      const attemptRows: any[] = []
      const certRows: any[] = []
      for (let p = 0; p < d.passes; p++) {
        const course = catalog[catIdx % catalog.length]; catIdx++
        const member = d.team[(p % (d.team.length - 1)) + 1] || d.team[0] // bevorzugt nicht-Admins
        const uid2 = uids[d.team.indexOf(member)] || uids[0]
        const score = SCORE_POOL[scoreIdx % SCORE_POOL.length]; scoreIdx++
        const total = 10
        const correct = Math.max(0, Math.min(total, Math.round((score / 100) * total)))
        const attemptId = uuid()
        const day = 55 - p * 4
        attemptRows.push({ id: attemptId, tenant_id: tid, course_id: course.id, user_id: uid2, mode: 'pruefung', total, correct, score, passed: true, answers: [], duration_sec: 600 + p * 90, started_at: daysAgoIso(day), completed_at: daysAgoIso(day) })
        certRows.push({ id: uuid(), tenant_id: tid, course_id: course.id, user_id: uid2, attempt_id: attemptId, cert_number: certNumber(), title: course.title, recipient_name: member.full_name, score, status: 'gueltig' })
      }
      try { const r = await insertResilient(admin, 'exam_attempts', attemptRows); if (!r.error) attemptsOk += attemptRows.length; else notes.push('exam_attempts (' + d.slug + ') uebersprungen: ' + r.error.message) } catch {}
      try { const r = await insertResilient(admin, 'certificates', certRows); if (!r.error) certsOk += certRows.length; else notes.push('certificates (' + d.slug + ') uebersprungen: ' + r.error.message) } catch {}
    }

    try { await admin.from('audit_log').insert({ tenant_id: tid, actor_id: uids[0], action: 'seed_demo_account', entity: 'tenant', entity_id: tid }) } catch {}
  }

  // Alle Demo-Mandanten (inkl. Aurora) als Demo markieren
  const allDemoSlugs = [AURORA_SLUG, ...DEMOS.map(d => d.slug)]
  const { error: markErr } = await admin.from('tenants').update({ is_demo: true }).in('slug', allDemoSlugs)
  if (markErr) notes.push('Spalte is_demo noch nicht vorhanden, Markierung uebersprungen. Bitte zuerst das SQL ausfuehren. (' + markErr.message + ')')

  return NextResponse.json({
    ok: true,
    angelegt: { firmen: firmenOk, mitarbeitende: usersOk, pruefungen: attemptsOk, nachweise: certsOk },
    demo_markiert: markErr ? 'nein (SQL fehlt)' : 'ja, inkl. Aurora',
    login: {
      hinweis: 'Anmeldung ueber /anmelden. Alle Demo-Konten nutzen dasselbe Passwort.',
      passwort: DEMO_PASSWORD,
      admin_logins: DEMOS.map(d => ({ firma: d.legal, branche: d.sector, login: d.team[0].email })),
    },
    notizen: notes,
    wichtig: 'Reine Testdaten. Diese Seed-Route nach erfolgreichem Lauf wieder aus dem Repo entfernen.',
  })
}

export async function GET(req: Request) { return run(req) }
export async function POST(req: Request) { return run(req) }
