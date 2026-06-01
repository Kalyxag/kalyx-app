'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

type Step = 1 | 2 | 3 | 4 | 5

interface NewTenant {
  // Step 1: Firma
  name: string
  display_name: string
  slug: string
  branche: string
  plan: 'starter' | 'professional' | 'enterprise'
  address_city: string
  billing_email: string
  primary_color: string
  mfa_required: boolean
  // Step 2: Abteilungen
  departments: string[]
  newDept: string
  // Step 3: Admin-User
  admin_name: string
  admin_email: string
  admin_password: string
  admin_position: string
  // Step 4: Kurse
  assigned_courses: string[]
}

const BRANCHEN = [
  'Finance & Banking', 'Versicherung', 'Pharma & Life Sciences',
  'Gesundheitswesen', 'Industrie & Fertigung', 'Retail & Handel',
  'Technologie & IT', 'Bildung & Weiterbildung', 'Öffentliche Verwaltung',
  'Stadtplanung & Infrastruktur', 'Agentur & Marketing', 'Beratung',
  'Immobilien', 'Logistik & Transport', 'Andere',
]

const PLAN_INFO = {
  starter: { label: 'Starter', price: 'CHF 49/Mo', desc: 'Bis 25 Mitarbeitende · 5 Kurse', color: '#374151' },
  professional: { label: 'Professional', price: 'CHF 149/Mo', desc: 'Bis 200 Mitarbeitende · Unbegrenzte Kurse', color: '#3A6DB5' },
  enterprise: { label: 'Enterprise', price: 'CHF 299/Mo', desc: 'Unbegrenzt · SSO · API · White-Label', color: '#14613E' },
}

const PALETTE = [
  '#14613E', '#3A6DB5', '#B8904A', '#7C3AED', '#0F766E',
  '#1D3A8A', '#DC2626', '#374151', '#1B4F72', '#0A66C2',
]

const ALL_COURSES_PREVIEW = [
  { id: 'gwg-2025', title: 'Geldwäscherei-Prävention (GwG 2025)', emoji: '⚖️', tags: ['Finance', 'Versicherung'] },
  { id: 'dsgvo-dsg', title: 'Datenschutz DSGVO & DSG 2023', emoji: '🔒', tags: ['Alle'] },
  { id: 'iso-27001', title: 'Informationssicherheit & Cyberrisiken', emoji: '🛡️', tags: ['Alle'] },
  { id: 'finma-fidleg', title: 'FINMA-Aufsicht: FIDLEG & FINIG 2025', emoji: '🏛️', tags: ['Finance', 'Versicherung'] },
  { id: 'gxp-hmc', title: 'GxP & Heilmittelrecht (HMG)', emoji: '🔬', tags: ['Pharma'] },
  { id: 'arbeitssicherheit-suva', title: 'Arbeitssicherheit & Gesundheitsschutz', emoji: '🦺', tags: ['Industrie', 'Pharma', 'Retail'] },
  { id: 'lmg-haccp', title: 'Lebensmittelsicherheit LMG & HACCP', emoji: '🥗', tags: ['Retail'] },
  { id: 'patientensicherheit', title: 'Patientensicherheit & Fehlerkultur', emoji: '🏥', tags: ['Gesundheit'] },
  { id: 'iso9001-qualitaet', title: 'ISO 9001:2015 Qualitätsmanagementsystem', emoji: '✅', tags: ['Industrie', 'Pharma'] },
  { id: 'ki-agentur', title: 'KI-Tools im Alltag', emoji: '🤖', tags: ['Alle'] },
  { id: 'dsgvo-marketing', title: 'Datenschutz im Marketing', emoji: '🍪', tags: ['Agentur'] },
  { id: 'green-claims', title: 'Green Claims Compliance', emoji: '🌱', tags: ['Alle'] },
]

const DEFAULT_DEPTS: Record<string, string[]> = {
  'Finance & Banking': ['Compliance', 'Private Banking', 'Risk Management', 'Operations', 'IT', 'HR', 'Legal'],
  'Versicherung': ['Underwriting', 'Claims', 'Compliance', 'Actuarial', 'IT', 'HR', 'Legal'],
  'Pharma & Life Sciences': ['Regulatory Affairs', 'Quality Assurance', 'R&D', 'Manufacturing', 'Supply Chain', 'HR'],
  'Gesundheitswesen': ['Pflege', 'Ärzteschaft', 'Qualitätsmanagement', 'IT', 'Administration', 'HR'],
  'Industrie & Fertigung': ['Production', 'Quality', 'Engineering', 'Supply Chain', 'Safety', 'HR'],
  'Retail & Handel': ['Filialbetrieb', 'Operations', 'Einkauf', 'Lager & Logistik', 'IT', 'HR'],
  'Technologie & IT': ['Engineering', 'Product', 'Sales', 'Operations', 'HR', 'Legal'],
  'Bildung & Weiterbildung': ['Lehre & Didaktik', 'Verwaltung', 'IT', 'Marketing', 'HR'],
  'Agentur & Marketing': ['Account Management', 'Creative', 'Digital', 'Strategy', 'Finance'],
}

function slugify(s: string) {
  return s.toLowerCase()
    .replace(/[äöü]/g, c => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] || c))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30)
}

function generatePassword(name: string) {
  const clean = name.split(' ').map(w => w[0]?.toUpperCase() + w.slice(1)).join('')
  return `${clean}2025!`
}

export default function NeuerKundePage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [step, setStep] = useState<Step>(1)
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<NewTenant>({
    name: '', display_name: '', slug: '', branche: '', plan: 'professional',
    address_city: 'Zürich', billing_email: '', primary_color: '#14613E', mfa_required: false,
    departments: [], newDept: '',
    admin_name: '', admin_email: '', admin_password: '', admin_position: 'HR Manager',
    assigned_courses: ['dsgvo-dsg', 'iso-27001'],
  })

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
  }, [router])

  if (!session) return null

  // Only super admin or tenant admin can create new tenants
  // In demo: any admin can use this feature
  const isAdmin = ['tenant_admin', 'hr_manager', 'compliance_officer', 'super_admin'].includes(session.user?.role)
  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111820', marginBottom: 8 }}>Kein Zugriff</div>
      </div>
    )
  }

  function update(key: keyof NewTenant, val: any) {
    setForm(prev => {
      const next = { ...prev, [key]: val }
      // Auto-update slug from name
      if (key === 'name') {
        next.slug = slugify(val)
        if (!next.billing_email && next.slug) {
          next.billing_email = `admin@${next.slug}.ch`
        }
      }
      // Auto-update email from name
      if (key === 'admin_name' && val) {
        const parts = val.trim().toLowerCase().split(' ')
        next.admin_email = parts.length > 1
          ? `${parts[0]}.${parts[parts.length-1]}@${next.slug}.ch`
          : `${parts[0]}@${next.slug}.ch`
        next.admin_password = generatePassword(val)
      }
      return next
    })
  }

  function selectBranche(b: string) {
    setForm(prev => ({
      ...prev,
      branche: b,
      departments: DEFAULT_DEPTS[b] || ['Management', 'HR', 'Operations', 'IT'],
    }))
  }

  function addDept() {
    if (!form.newDept.trim()) return
    setForm(prev => ({ ...prev, departments: [...prev.departments, prev.newDept.trim()], newDept: '' }))
  }

  function removeDept(d: string) {
    setForm(prev => ({ ...prev, departments: prev.departments.filter(x => x !== d) }))
  }

  function toggleCourse(id: string) {
    setForm(prev => ({
      ...prev,
      assigned_courses: prev.assigned_courses.includes(id)
        ? prev.assigned_courses.filter(c => c !== id)
        : [...prev.assigned_courses, id],
    }))
  }

  function saveTenant() {
    // Store new tenant in sessionStorage for demo
    const tenants = JSON.parse(sessionStorage.getItem('kalyx_new_tenants') || '[]')
    const newTenant = {
      id: `a${Date.now()}`,
      slug: form.slug,
      name: form.name,
      display_name: form.display_name || form.name,
      plan: form.plan,
      primary_color: form.primary_color,
      branche: form.branche,
      address_city: form.address_city,
      billing_email: form.billing_email,
      mfa_required: form.mfa_required,
      departments: form.departments,
      assigned_courses: form.assigned_courses,
      admin: {
        name: form.admin_name,
        email: form.admin_email,
        password: form.admin_password,
        position: form.admin_position,
      },
      created_at: new Date().toISOString(),
    }
    tenants.push(newTenant)
    sessionStorage.setItem('kalyx_new_tenants', JSON.stringify(tenants))

    // Also save credentials
    const creds = JSON.parse(sessionStorage.getItem('kalyx_new_creds') || '{}')
    creds[form.admin_email.toLowerCase()] = { password: form.admin_password, tenant: form.slug }
    sessionStorage.setItem('kalyx_new_creds', JSON.stringify(creds))

    setSaved(true)
    setStep(5)
  }

  // ── Styles ─────────────────────────────────────────────────
  const primary = session.tenant?.primary_color || '#14613E'
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }
  const label: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#6B7280', display: 'block', marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' as const }
  const btn = (col = primary, outline = false): React.CSSProperties => ({
    background: outline ? 'transparent' : col, color: outline ? col : '#fff',
    border: `1px solid ${col}`, borderRadius: 8, padding: '10px 20px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  })

  // Step indicator
  const STEPS = ['Firma', 'Abteilungen', 'Admin-User', 'Kurse', 'Fertig']

  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const idx = i + 1
        const done = step > idx
        const active = step === idx
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? primary : active ? primary : '#F3F4F6',
                color: done || active ? '#fff' : '#9CA3AF',
                fontSize: done ? 12 : 11, fontWeight: 600,
              }}>
                {done ? '✓' : idx}
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: active ? primary : done ? '#6B7280' : '#9CA3AF', letterSpacing: '.06em', whiteSpace: 'nowrap' as const }}>
                {s.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? primary : '#F3F4F6', margin: '0 8px', marginBottom: 20 }} />
            )}
          </div>
        )
      })}
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP 1: FIRMA
  // ════════════════════════════════════════════════════════════
  if (step === 1) return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Neuen Kunden anlegen</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Lege einen neuen Mandanten in KALYX an — vollständig konfiguriert, sofort einsatzbereit.</p>
      </div>
      <StepIndicator />

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#374151', letterSpacing: '.08em', marginBottom: 20, fontWeight: 600 }}>SCHRITT 1 — FIRMENDATEN</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>Firmenname *</label>
            <input style={input} value={form.name} onChange={e => update('name', e.target.value)} placeholder="z.B. Helvetia Finanz AG" />
          </div>
          <div>
            <label style={label}>Anzeigename</label>
            <input style={input} value={form.display_name} onChange={e => update('display_name', e.target.value)} placeholder={form.name || 'Kurzname für Navigation'} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>Tenant-Slug (URL) *</label>
            <div style={{ position: 'relative' as const }}>
              <input style={{ ...input, paddingLeft: 8 }} value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="helvetia-finanz" />
              {form.slug && <div style={{ position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF' }}>kalyx.academy/{form.slug}</div>}
            </div>
          </div>
          <div>
            <label style={label}>Stadt</label>
            <input style={input} value={form.address_city} onChange={e => update('address_city', e.target.value)} placeholder="Zürich" />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={label}>Billing E-Mail</label>
          <input style={input} value={form.billing_email} onChange={e => update('billing_email', e.target.value)} placeholder={`admin@${form.slug || 'firma'}.ch`} />
        </div>

        {/* Branche */}
        <div style={{ marginBottom: 20 }}>
          <label style={label}>Branche *</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {BRANCHEN.map(b => (
              <button key={b}
                onClick={() => selectBranche(b)}
                style={{
                  border: `1px solid ${form.branche === b ? primary : '#E5E7EB'}`,
                  background: form.branche === b ? `${primary}14` : '#fff',
                  color: form.branche === b ? primary : '#374151',
                  borderRadius: 20, padding: '5px 12px', fontSize: 12,
                  fontWeight: form.branche === b ? 600 : 400, cursor: 'pointer',
                }}>
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div style={{ marginBottom: 20 }}>
          <label style={label}>Plan</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {(Object.entries(PLAN_INFO) as any).map(([key, info]: any) => (
              <button key={key}
                onClick={() => update('plan', key)}
                style={{
                  border: `2px solid ${form.plan === key ? info.color : '#E5E7EB'}`,
                  borderRadius: 10, padding: '14px', textAlign: 'left' as const,
                  background: form.plan === key ? `${info.color}0a` : '#fff', cursor: 'pointer',
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: info.color, marginBottom: 4 }}>{info.label}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#374151', marginBottom: 4 }}>{info.price}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{info.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color + MFA */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={label}>Primärfarbe (Branding)</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {PALETTE.map(c => (
                <button key={c}
                  onClick={() => update('primary_color', c)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, border: 'none',
                    cursor: 'pointer', outline: form.primary_color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: 2,
                  }} />
              ))}
              <input type="color" value={form.primary_color}
                onChange={e => update('primary_color', e.target.value)}
                style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', padding: 0 }} />
            </div>
          </div>
          <div>
            <label style={label}>MFA erforderlich</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <button onClick={() => update('mfa_required', !form.mfa_required)}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: form.mfa_required ? primary : '#D1D5DB', position: 'relative' as const,
                }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: '#fff',
                  position: 'absolute' as const, top: 3, left: form.mfa_required ? 23 : 3, transition: 'left .2s',
                }} />
              </button>
              <span style={{ fontSize: 12, color: '#6B7280' }}>{form.mfa_required ? 'Aktiviert' : 'Deaktiviert'}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!form.name || !form.slug || !form.branche}
        style={{ ...btn(), opacity: (!form.name || !form.slug || !form.branche) ? 0.5 : 1 }}>
        Weiter → Abteilungen
      </button>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP 2: ABTEILUNGEN
  // ════════════════════════════════════════════════════════════
  if (step === 2) return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Abteilungen definieren</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Basierend auf {form.branche} wurden Abteilungen vorgeschlagen. Passe sie an.</p>
      </div>
      <StepIndicator />

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#374151', letterSpacing: '.08em', marginBottom: 20, fontWeight: 600 }}>SCHRITT 2 — ABTEILUNGEN VON {form.name.toUpperCase()}</div>

        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
          {form.departments.map(d => (
            <div key={d} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: `${form.primary_color}12`, border: `1px solid ${form.primary_color}30`,
              borderRadius: 20, padding: '5px 12px',
            }}>
              <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{d}</span>
              <button onClick={() => removeDept(d)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...input, flex: 1 }}
            value={form.newDept}
            onChange={e => update('newDept', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addDept()}
            placeholder="Neue Abteilung hinzufügen…" />
          <button onClick={addDept} style={{ ...btn(), padding: '9px 16px', flexShrink: 0 }}>+ Hinzufügen</button>
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: '#9CA3AF' }}>
          {form.departments.length} Abteilungen definiert · Enter zum Hinzufügen
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setStep(1)} style={{ ...btn('#fff', true), color: '#374151', border: '1px solid #E5E7EB' }}>← Zurück</button>
        <button onClick={() => setStep(3)} disabled={form.departments.length === 0}
          style={{ ...btn(), opacity: form.departments.length === 0 ? 0.5 : 1 }}>
          Weiter → Admin-User
        </button>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP 3: ADMIN USER
  // ════════════════════════════════════════════════════════════
  if (step === 3) return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Admin-User erstellen</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Dieser User erhält vollen Admin-Zugang für {form.name}.</p>
      </div>
      <StepIndicator />

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#374151', letterSpacing: '.08em', marginBottom: 20, fontWeight: 600 }}>SCHRITT 3 — ADMIN-USER FÜR {form.display_name || form.name}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>Vollständiger Name *</label>
            <input style={input} value={form.admin_name} onChange={e => update('admin_name', e.target.value)} placeholder="z.B. Sarah Muster" />
          </div>
          <div>
            <label style={label}>Position / Funktion</label>
            <input style={input} value={form.admin_position} onChange={e => update('admin_position', e.target.value)} placeholder="HR Manager" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={label}>E-Mail-Adresse *</label>
            <input style={input} value={form.admin_email} onChange={e => update('admin_email', e.target.value)} placeholder={`admin@${form.slug}.ch`} />
          </div>
          <div>
            <label style={label}>Passwort</label>
            <div style={{ position: 'relative' as const }}>
              <input style={input} value={form.admin_password} onChange={e => update('admin_password', e.target.value)} />
              <button
                onClick={() => update('admin_password', Math.random().toString(36).slice(-8).replace(/[a-z]/g, (ch) => ch.toUpperCase()) + '2025!')}
                style={{ position: 'absolute' as const, right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: 11 }}>
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Login preview */}
        {form.admin_email && form.admin_password && (
          <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 10, padding: '16px 20px', marginTop: 16 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em', marginBottom: 10 }}>LOGIN-VORSCHAU</div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 6, fontSize: 12 }}>
              <span style={{ color: '#9CA3AF' }}>URL:</span>
              <span style={{ fontFamily: 'monospace', color: '#374151' }}>kalyx.academy</span>
              <span style={{ color: '#9CA3AF' }}>E-Mail:</span>
              <span style={{ fontFamily: 'monospace', color: '#374151' }}>{form.admin_email}</span>
              <span style={{ color: '#9CA3AF' }}>Passwort:</span>
              <span style={{ fontFamily: 'monospace', color: '#374151' }}>{form.admin_password}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setStep(2)} style={{ ...btn('#fff', true), color: '#374151', border: '1px solid #E5E7EB' }}>← Zurück</button>
        <button onClick={() => setStep(4)} disabled={!form.admin_name || !form.admin_email}
          style={{ ...btn(), opacity: (!form.admin_name || !form.admin_email) ? 0.5 : 1 }}>
          Weiter → Kurse zuweisen
        </button>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP 4: KURSE ZUWEISEN
  // ════════════════════════════════════════════════════════════
  if (step === 4) return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Kurse zuweisen</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Welche Kurse soll {form.name} initial erhalten?</p>
      </div>
      <StepIndicator />

      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#374151', letterSpacing: '.08em', marginBottom: 20, fontWeight: 600 }}>
          SCHRITT 4 — KURSBIBLIOTHEK · {form.assigned_courses.length} AUSGEWÄHLT
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {ALL_COURSES_PREVIEW.map(c => {
            const selected = form.assigned_courses.includes(c.id)
            return (
              <button key={c.id}
                onClick={() => toggleCourse(c.id)}
                style={{
                  textAlign: 'left' as const, padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  border: `2px solid ${selected ? form.primary_color : '#E5E7EB'}`,
                  background: selected ? `${form.primary_color}08` : '#fff',
                  transition: 'all .15s',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{c.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? '#111820' : '#374151', lineHeight: 1.3 }}>{c.title}</div>
                  </div>
                  {selected && (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: form.primary_color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {c.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'monospace', fontSize: 8, background: '#F3F4F6', color: '#6B7280', borderRadius: 3, padding: '1px 5px' }}>{t}</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 16, fontSize: 11, color: '#9CA3AF' }}>
          Weitere Kurse können jederzeit über den KI-Kursersteller generiert und zugewiesen werden.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => setStep(3)} style={{ ...btn('#fff', true), color: '#374151', border: '1px solid #E5E7EB' }}>← Zurück</button>
        <button onClick={saveTenant} style={{ ...btn(), padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Kunden anlegen
        </button>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP 5: FERTIG
  // ════════════════════════════════════════════════════════════
  if (step === 5) return (
    <div style={{ maxWidth: 580, margin: '60px auto' }}>
      <div style={{ textAlign: 'center' as const, marginBottom: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎊</div>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 8 }}>
          {form.name} ist angelegt!
        </h2>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Der Mandant ist vollständig eingerichtet und sofort einsatzbereit.</p>
      </div>

      {/* Summary card */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
        {/* Header */}
        <div style={{ background: `${form.primary_color}15`, padding: '20px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: form.primary_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff', fontWeight: 700 }}>
            {form.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111820' }}>{form.name}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>{form.branche} · {form.plan} · {form.address_city}</div>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '20px 24px', display: 'grid', gap: 16 }}>
          {/* Abteilungen */}
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em', marginBottom: 8 }}>ABTEILUNGEN ({form.departments.length})</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
              {form.departments.map(d => (
                <span key={d} style={{ fontFamily: 'monospace', fontSize: 10, background: '#F3F4F6', color: '#374151', borderRadius: 4, padding: '3px 8px' }}>{d}</span>
              ))}
            </div>
          </div>

          {/* Login */}
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em', marginBottom: 8 }}>ADMIN-LOGIN</div>
            <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '14px 16px', fontFamily: 'monospace', fontSize: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 6 }}>
                <span style={{ color: '#9CA3AF' }}>URL</span>
                <span style={{ color: '#374151' }}>kalyx.academy</span>
                <span style={{ color: '#9CA3AF' }}>E-Mail</span>
                <span style={{ color: '#111820', fontWeight: 600 }}>{form.admin_email}</span>
                <span style={{ color: '#9CA3AF' }}>Passwort</span>
                <span style={{ color: '#111820', fontWeight: 600 }}>{form.admin_password}</span>
                <span style={{ color: '#9CA3AF' }}>Name</span>
                <span style={{ color: '#374151' }}>{form.admin_name}</span>
              </div>
            </div>
          </div>

          {/* Kurse */}
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em', marginBottom: 8 }}>ZUGEWIESENE KURSE ({form.assigned_courses.length})</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {form.assigned_courses.map(id => {
                const c = ALL_COURSES_PREVIEW.find(x => x.id === id)
                return c ? (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151' }}>
                    <span>{c.emoji}</span> {c.title}
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => {
            setStep(1)
            setForm({
              name: '', display_name: '', slug: '', branche: '', plan: 'professional',
              address_city: 'Zürich', billing_email: '', primary_color: '#14613E', mfa_required: false,
              departments: [], newDept: '',
              admin_name: '', admin_email: '', admin_password: '', admin_position: 'HR Manager',
              assigned_courses: ['dsgvo-dsg', 'iso-27001'],
            })
          }}
          style={{ ...btn('#fff', true), color: '#374151', border: '1px solid #E5E7EB', padding: '10px 20px' }}>
          Weiteren Kunden anlegen
        </button>
        <button onClick={() => router.push('/dashboard')}
          style={{ background: form.primary_color, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Zum Dashboard
        </button>
      </div>
    </div>
  )

  return null
}
