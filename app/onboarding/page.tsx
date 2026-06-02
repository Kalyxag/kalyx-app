// Ziel-Pfad im Repo: app/onboarding/page.tsx  (ERSETZT die bisherige Datei)
//
// Gefuehrter Setup-Assistent im KALYX-CI: Cormorant/Albert Sans, Markenfarben,
// Fortschritt in Prozent, waermere Tonalitaet, weiche Uebergaenge und Fokus-Zustaende.
// Aktiv: Firmenprofil, Abteilungen/Rollen, Compliance. Kurse/Branding/Mitarbeitende folgen.
// Alles mandantengeschuetzt (RLS) ueber die Session. Fortschritt in onboarding_state.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

// ---- KALYX Design-Tokens (aus der Marketing-CI) ----
const CREAM = '#F5F4EF', NAVY = '#0B1929', GREEN = '#14613E', GOLD = '#B8904A'
const GREEN_PALE = '#E6F0EB', LINE = '#E4E0D8', GRAY = '#6B7280'
const FH = "'Cormorant', Georgia, serif"
const FB = "'Albert Sans', system-ui, -apple-system, sans-serif"
const FM = "'IBM Plex Mono', ui-monospace, monospace"

function injectCI() {
  if (typeof document === 'undefined') return
  if (!document.getElementById('kalyx-fonts')) {
    const l = document.createElement('link'); l.id = 'kalyx-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap'
    document.head.appendChild(l)
  }
  if (!document.getElementById('kalyx-ui')) {
    const s = document.createElement('style'); s.id = 'kalyx-ui'
    s.textContent = `
      .kx-input{transition:border-color .15s ease, box-shadow .15s ease}
      .kx-input:focus{border-color:${GREEN}; box-shadow:0 0 0 3px rgba(20,97,62,.12); outline:none}
      .kx-chip{transition:transform .12s ease, background .12s ease, border-color .12s ease}
      .kx-chip:hover{transform:translateY(-1px)}
      .kx-btn{transition:transform .12s ease, box-shadow .15s ease, opacity .12s ease}
      .kx-btn:hover{transform:translateY(-1px)}
      .kx-btn-primary:hover{box-shadow:0 10px 24px rgba(20,97,62,.28)}
      .kx-link{transition:opacity .12s ease}
      .kx-link:hover{opacity:.7}
      .kx-bar-fill{transition:width .6s cubic-bezier(.4,0,.2,1)}
      .kx-card{animation:kxfade .4s ease both}
      .kx-row{transition:background .12s ease}
      .kx-row:hover{background:#EFEDE6}
      @keyframes kxfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    `
    document.head.appendChild(s)
  }
}

const STEPS = ['Firmenprofil', 'Abteilungen & Rollen', 'Compliance', 'Kurse', 'Branding', 'Mitarbeitende']
const STEP_KEYS = ['profile', 'departments', 'compliance', 'courses', 'branding', 'users'] as const
const ACTIVE_MAX = 2

const SECTORS = [
  { v: 'finance', l: 'Finanzdienstleistung' }, { v: 'pharma', l: 'Pharma / Life Sciences' },
  { v: 'bildung', l: 'Bildung / Verband' }, { v: 'retail', l: 'Handel / Retail' },
  { v: 'industrie', l: 'Industrie / Produktion' }, { v: 'sonstige', l: 'Sonstige' },
]
const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const COUNTRIES = ['CH', 'DE', 'AT', 'LI', 'Andere']
const LANGS = [{ v: 'de', l: 'Deutsch' }, { v: 'fr', l: 'Französisch' }, { v: 'it', l: 'Italienisch' }, { v: 'en', l: 'Englisch' }]
const ACCESS = [{ v: 'learner', l: 'Lernende(r)' }, { v: 'manager', l: 'Manager' }, { v: 'admin', l: 'Admin' }]
const FRAMEWORKS = ['DSGVO', 'DSG (CH)', 'FINMA', 'ISO 27001', 'EU AI Act', 'SOC 2', 'GxP / GMP', 'EBA / BaFin']
const RECERT = [
  { v: 'jaehrlich', l: 'Jährlich' }, { v: 'halbjaehrlich', l: 'Halbjährlich' },
  { v: 'alle 2 Jahre', l: 'Alle 2 Jahre' }, { v: 'keine', l: 'Keine feste Vorgabe' },
]

type Dept = { id: string; name: string; description: string | null }
type Role = { id: string; name: string; department_id: string | null; access_level: string }
type Progress = { profile: boolean; departments: boolean; compliance: boolean; courses: boolean; branding: boolean; users: boolean }

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState('')
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [prog, setProg] = useState<Progress>({ profile: false, departments: false, compliance: false, courses: false, branding: false, users: false })

  // Firmenprofil
  const [displayName, setDisplayName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [sector, setSector] = useState('sonstige')
  const [country, setCountry] = useState('CH')
  const [size, setSize] = useState('')
  const [website, setWebsite] = useState('')
  const [uid, setUid] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [langs, setLangs] = useState<string[]>(['de'])
  const [savingProfile, setSavingProfile] = useState(false)

  // Abteilungen & Rollen
  const [depts, setDepts] = useState<Dept[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [newDept, setNewDept] = useState('')
  const [newDeptDesc, setNewDeptDesc] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newRoleDept, setNewRoleDept] = useState('')
  const [newRoleAccess, setNewRoleAccess] = useState('learner')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  // Compliance
  const [frameworks, setFrameworks] = useState<string[]>([])
  const [esig, setEsig] = useState(false)
  const [recert, setRecert] = useState('jaehrlich')
  const [retention, setRetention] = useState(60)
  const [residency, setResidency] = useState(false)
  const [savingComp, setSavingComp] = useState(false)

  useEffect(() => {
    injectCI()
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) { router.replace('/anmelden'); return }
      const { data: au } = await supabase.from('app_users').select('tenant_id').eq('id', session.user.id).maybeSingle()
      const tid = (au as any)?.tenant_id
      if (!tid) { router.replace('/anmelden'); return }
      const { data: prof } = await supabase.from('company_profiles').select('*').eq('tenant_id', tid).maybeSingle()
      const { data: comp } = await supabase.from('compliance_profiles').select('*').eq('tenant_id', tid).maybeSingle()
      const { data: ob } = await supabase.from('onboarding_state').select('*').eq('tenant_id', tid).maybeSingle()
      const { data: dRows } = await supabase.from('departments').select('id,name,description').eq('tenant_id', tid).order('created_at')
      const { data: rRows } = await supabase.from('roles').select('id,name,department_id,access_level').eq('tenant_id', tid).order('created_at')
      if (!active) return
      setTenantId(tid)
      if (prof) {
        const p = prof as any
        setDisplayName(p.display_name || ''); setLegalName(p.legal_name || '')
        setSector(p.sector || 'sonstige'); setCountry(p.country || 'CH')
        setSize(p.company_size || ''); setWebsite(p.website || ''); setUid(p.uid_handelsregister || '')
        setContactName(p.contact_name || ''); setContactEmail(p.contact_email || ''); setContactPhone(p.contact_phone || '')
        setLangs(Array.isArray(p.languages) && p.languages.length ? p.languages : ['de'])
      }
      if (comp) {
        const c = comp as any
        setFrameworks(Array.isArray(c.frameworks) ? c.frameworks : [])
        setEsig(!!c.esignature_required); setRecert(c.recert_interval_default || 'jaehrlich')
        setRetention(typeof c.retention_months === 'number' ? c.retention_months : 60)
        setResidency(!!c.residency_confirmed)
      }
      if (ob) {
        const o = ob as any
        setProg({ profile: !!o.step_profile, departments: !!o.step_departments, compliance: !!o.step_compliance, courses: !!o.step_courses, branding: !!o.step_branding, users: !!o.step_users })
      }
      setDepts((dRows as Dept[]) || [])
      setRoles((rRows as Role[]) || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [router])

  const doneCount = Object.values(prog).filter(Boolean).length
  const percent = Math.round((doneCount / 6) * 100)

  async function audit(action: string, entity: string, entityId?: string) {
    try {
      const { data } = await supabase.auth.getSession()
      await supabase.from('audit_log').insert({ tenant_id: tenantId, actor_id: data.session?.user.id, action, entity, entity_id: entityId || null })
    } catch {}
  }
  function toggleLang(v: string) { setLangs(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]) }
  function toggleFramework(v: string) { setFrameworks(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]) }

  async function saveProfile() {
    if (!displayName.trim()) { setMsg('Bitte gib einen Anzeigenamen an.'); return }
    setSavingProfile(true); setMsg('')
    const { error } = await supabase.from('company_profiles').update({
      display_name: displayName.trim(), legal_name: legalName.trim() || null, sector, country,
      company_size: size || null, website: website.trim() || null, uid_handelsregister: uid.trim() || null,
      contact_name: contactName.trim() || null, contact_email: contactEmail.trim() || null, contact_phone: contactPhone.trim() || null,
      languages: langs.length ? langs : ['de'], updated_at: new Date().toISOString(),
    }).eq('tenant_id', tenantId)
    if (error) { setSavingProfile(false); setMsg('Speichern fehlgeschlagen: ' + error.message); return }
    await supabase.from('onboarding_state').update({ step_profile: true, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    await audit('profile_updated', 'company_profiles', tenantId)
    setProg(p => ({ ...p, profile: true })); setSavingProfile(false); setStep(1)
  }
  async function addDept() {
    const name = newDept.trim(); if (!name) return
    setBusy(true); setMsg('')
    const { data, error } = await supabase.from('departments').insert({ tenant_id: tenantId, name, description: newDeptDesc.trim() || null }).select('id,name,description').single()
    setBusy(false)
    if (error) { setMsg('Abteilung konnte nicht angelegt werden: ' + error.message); return }
    setDepts(prev => [...prev, data as Dept]); setNewDept(''); setNewDeptDesc('')
    await audit('department_added', 'departments', (data as any).id)
  }
  async function removeDept(id: string) {
    setBusy(true)
    const { error } = await supabase.from('departments').delete().eq('id', id).eq('tenant_id', tenantId)
    setBusy(false)
    if (error) { setMsg('Löschen fehlgeschlagen: ' + error.message); return }
    setDepts(prev => prev.filter(d => d.id !== id))
    setRoles(prev => prev.map(r => r.department_id === id ? { ...r, department_id: null } : r))
  }
  async function addRole() {
    const name = newRole.trim(); if (!name) return
    setBusy(true); setMsg('')
    const { data, error } = await supabase.from('roles').insert({ tenant_id: tenantId, name, department_id: newRoleDept || null, access_level: newRoleAccess }).select('id,name,department_id,access_level').single()
    setBusy(false)
    if (error) { setMsg('Rolle konnte nicht angelegt werden: ' + error.message); return }
    setRoles(prev => [...prev, data as Role]); setNewRole(''); setNewRoleDept(''); setNewRoleAccess('learner')
    await audit('role_added', 'roles', (data as any).id)
  }
  async function removeRole(id: string) {
    setBusy(true)
    const { error } = await supabase.from('roles').delete().eq('id', id).eq('tenant_id', tenantId)
    setBusy(false)
    if (error) { setMsg('Löschen fehlgeschlagen: ' + error.message); return }
    setRoles(prev => prev.filter(r => r.id !== id))
  }
  async function completeDepartments() {
    setBusy(true)
    await supabase.from('onboarding_state').update({ step_departments: true, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    await audit('departments_completed', 'onboarding_state', tenantId)
    setProg(p => ({ ...p, departments: true })); setBusy(false); setStep(2)
  }
  async function saveCompliance() {
    setSavingComp(true); setMsg('')
    const { error } = await supabase.from('compliance_profiles').update({
      frameworks, esignature_required: esig, recert_interval_default: recert,
      retention_months: Number.isFinite(retention) ? retention : 60, residency_confirmed: residency,
      updated_at: new Date().toISOString(),
    }).eq('tenant_id', tenantId)
    if (error) { setSavingComp(false); setMsg('Speichern fehlgeschlagen: ' + error.message); return }
    await supabase.from('onboarding_state').update({ step_compliance: true, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    await audit('compliance_updated', 'compliance_profiles', tenantId)
    setProg(p => ({ ...p, compliance: true })); setSavingComp(false); setDone(true)
  }
  async function logout() { await supabase.auth.signOut(); router.replace('/anmelden') }

  // ---------- Styles ----------
  const page: React.CSSProperties = { minHeight: '100vh', background: NAVY, padding: '36px 20px 64px', fontFamily: FB, color: NAVY }
  const shell: React.CSSProperties = { maxWidth: 780, margin: '0 auto' }
  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '36px 34px', boxShadow: '0 30px 70px rgba(0,0,0,.4)' }
  const eyebrow: React.CSSProperties = { fontFamily: FM, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD }
  const h1: React.CSSProperties = { fontFamily: FH, fontSize: 32, fontWeight: 600, color: NAVY, margin: '0 0 6px' }
  const intro: React.CSSProperties = { fontSize: 14.5, color: GRAY, lineHeight: 1.6, marginBottom: 22 }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', fontFamily: FB, fontSize: 14.5, color: NAVY, background: CREAM, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: '11px 14px', marginBottom: 14, outline: 'none', boxSizing: 'border-box' }
  const btn: React.CSSProperties = { fontFamily: FB, fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN, border: 'none', borderRadius: 10, padding: '13px 24px', cursor: 'pointer' }
  const btnGhost: React.CSSProperties = { fontFamily: FB, fontSize: 14.5, fontWeight: 600, color: GREEN, background: 'transparent', border: `1.5px solid ${GREEN}`, borderRadius: 10, padding: '11px 18px', cursor: 'pointer' }
  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }
  const chip = (on: boolean): React.CSSProperties => ({ fontFamily: FB, fontSize: 13.5, fontWeight: 600, padding: '9px 15px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${on ? GREEN : LINE}`, color: on ? '#fff' : NAVY, background: on ? GREEN : '#fff' })
  const tRow: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 15px', background: CREAM, borderRadius: 10, marginBottom: 12, border: `1px solid ${LINE}` }
  const listRow: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: CREAM, borderRadius: 10, padding: '11px 14px', marginBottom: 8, border: `1px solid ${LINE}` }

  if (loading) {
    return <div style={page}><div style={{ ...shell, color: 'rgba(255,255,255,.65)', fontFamily: FB, paddingTop: 40 }}>Lade deinen Arbeitsbereich …</div></div>
  }

  // ----- Kopfbereich mit Fortschritt + Stepper -----
  const Header = (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={eyebrow}>Einrichtungsassistent</div>
          <div style={{ fontFamily: FH, fontSize: 26, fontWeight: 600, color: '#fff', letterSpacing: '.04em', marginTop: 2 }}>
            KALYX
          </div>
        </div>
        <button className="kx-link" onClick={logout} style={{ fontFamily: FB, fontSize: 13.5, color: 'rgba(255,255,255,.7)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Abmelden</button>
      </div>

      {/* Fortschritt */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: FB, fontSize: 14, color: '#fff' }}>
            {displayName ? <>Schön, dass du da bist. Richten wir <strong style={{ color: GOLD }}>{displayName}</strong> gemeinsam ein.</> : 'Schön, dass du da bist.'}
          </span>
          <span style={{ fontFamily: FM, fontSize: 12.5, color: GOLD, whiteSpace: 'nowrap', marginLeft: 12 }}>{percent}% · {doneCount}/6</span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
          <div className="kx-bar-fill" style={{ width: `${percent}%`, height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${GREEN}, ${GOLD})` }} />
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
        {STEPS.map((s, i) => {
          const usable = i <= ACTIVE_MAX
          const current = i === step && !done
          const completed = prog[STEP_KEYS[i]]
          return (
            <button key={s} className="kx-chip" disabled={!usable} onClick={() => usable && (setDone(false), setStep(i))}
              style={{
                fontFamily: FB, fontSize: 12.5, fontWeight: 600, padding: '8px 13px', borderRadius: 99, cursor: usable ? 'pointer' : 'default',
                border: current ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
                color: current ? NAVY : completed ? '#fff' : usable ? '#fff' : 'rgba(255,255,255,.38)',
                background: current ? GOLD : completed ? 'rgba(20,97,62,.55)' : usable ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.04)',
              }}>
              {completed ? '✓ ' : `${i + 1}. `}{s}{!usable ? ' · bald' : ''}
            </button>
          )
        })}
      </div>
    </>
  )

  if (done) {
    return (
      <div style={page}><div style={shell}>
        {Header}
        <div className="kx-card" style={card}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: GREEN_PALE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={h1}>Stark, das Grundgerüst steht.</h1>
          <p style={{ ...intro, marginBottom: 10 }}>
            Firmenprofil, <strong style={{ color: NAVY }}>{depts.length}</strong> Abteilung(en), <strong style={{ color: NAVY }}>{roles.length}</strong> Rolle(n) und euer Compliance-Rahmen mit <strong style={{ color: NAVY }}>{frameworks.length}</strong> Regelwerk{frameworks.length === 1 ? '' : 'en'} sind gespeichert. Ihr seid bei <strong style={{ color: GREEN }}>{percent}%</strong>.
          </p>
          <p style={{ ...intro, marginBottom: 26 }}>
            Als Nächstes laden wir gemeinsam eure Mitarbeitenden ein, weisen Kurse zu und gestalten euer Branding. Das bauen wir in den nächsten Runden an genau dieser Stelle weiter.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="kx-btn kx-btn-primary" style={btn} onClick={() => { setDone(false); setStep(0) }}>Eingaben ansehen</button>
            <button className="kx-btn" style={btnGhost} onClick={logout}>Abmelden</button>
          </div>
        </div>
      </div></div>
    )
  }

  return (
    <div style={page}><div style={shell}>
      {Header}
      <div className="kx-card" style={card} key={step}>
        {step === 0 && (
          <>
            <h1 style={h1}>Erzähl uns kurz, wer ihr seid.</h1>
            <p style={intro}>Diese Angaben bilden die Basis für Zertifikate, den Audit-Trail und euer späteres Branding. Dein Fortschritt wird automatisch gespeichert, du kannst jederzeit pausieren.</p>

            <label style={label}>Anzeigename *</label>
            <input className="kx-input" style={input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="VillaWinkel" />
            <label style={label}>Rechtlicher Name</label>
            <input className="kx-input" style={input} value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="VillaWinkel AG" />
            <div style={row2}>
              <div>
                <label style={label}>Branche</label>
                <select className="kx-input" style={input} value={sector} onChange={e => setSector(e.target.value)}>{SECTORS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}</select>
              </div>
              <div>
                <label style={label}>Unternehmensgröße</label>
                <select className="kx-input" style={input} value={size} onChange={e => setSize(e.target.value)}><option value="">bitte wählen</option>{SIZES.map(s => <option key={s} value={s}>{s} Mitarbeitende</option>)}</select>
              </div>
            </div>
            <div style={row2}>
              <div>
                <label style={label}>Land</label>
                <select className="kx-input" style={input} value={country} onChange={e => setCountry(e.target.value)}>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <div>
                <label style={label}>UID / Handelsregister</label>
                <input className="kx-input" style={input} value={uid} onChange={e => setUid(e.target.value)} placeholder="CHE-123.456.789" />
              </div>
            </div>
            <label style={label}>Website</label>
            <input className="kx-input" style={input} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://villawinkel.ch" />
            <label style={label}>Sprachen der Plattform</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {LANGS.map(l => <button key={l.v} type="button" className="kx-chip" onClick={() => toggleLang(l.v)} style={chip(langs.includes(l.v))}>{l.l}</button>)}
            </div>
            <div style={{ borderTop: `1px solid ${LINE}`, margin: '8px 0 18px' }} />
            <p style={{ fontFamily: FM, fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: GRAY, marginBottom: 12 }}>Hauptansprechpartner (optional)</p>
            <div style={row2}>
              <div><label style={label}>Name</label><input className="kx-input" style={input} value={contactName} onChange={e => setContactName(e.target.value)} /></div>
              <div><label style={label}>Telefon</label><input className="kx-input" style={input} value={contactPhone} onChange={e => setContactPhone(e.target.value)} /></div>
            </div>
            <label style={label}>E-Mail</label>
            <input className="kx-input" style={input} type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
            {msg && <p style={{ color: '#C0392B', fontSize: 13.5, marginBottom: 12 }}>{msg}</p>}
            <button className="kx-btn kx-btn-primary" style={{ ...btn, opacity: savingProfile ? 0.7 : 1 }} onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Speichern …' : 'Speichern und weiter'}</button>
          </>
        )}

        {step === 1 && (
          <>
            <h1 style={h1}>So ist eure Organisation aufgebaut.</h1>
            <p style={intro}>Lege Abteilungen und Rollen an. Kurse lassen sich später punktgenau einzelnen Abteilungen und Rollen zuweisen, das macht Pflichtschulungen einfach.</p>

            <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Abteilungen</p>
            {depts.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {depts.map(d => (
                  <div key={d.id} className="kx-row" style={listRow}>
                    <span style={{ fontSize: 14.5, color: NAVY }}><strong>{d.name}</strong>{d.description ? <span style={{ color: GRAY }}> · {d.description}</span> : null}</span>
                    <button className="kx-link" onClick={() => removeDept(d.id)} disabled={busy} style={{ fontSize: 12.5, color: '#C0392B', background: 'transparent', border: 'none', cursor: 'pointer' }}>entfernen</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              <input className="kx-input" style={{ ...input, marginBottom: 0, flex: '2 1 160px' }} value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="z. B. Empfang" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDept() } }} />
              <input className="kx-input" style={{ ...input, marginBottom: 0, flex: '2 1 160px' }} value={newDeptDesc} onChange={e => setNewDeptDesc(e.target.value)} placeholder="Kurzbeschreibung (optional)" />
              <button className="kx-btn" style={{ ...btnGhost, whiteSpace: 'nowrap' }} onClick={addDept} disabled={busy}>+ Hinzufügen</button>
            </div>

            <p style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Rollen / Funktionen</p>
            {roles.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                {roles.map(r => {
                  const dep = depts.find(d => d.id === r.department_id)
                  const acc = ACCESS.find(a => a.v === r.access_level)
                  return (
                    <div key={r.id} className="kx-row" style={listRow}>
                      <span style={{ fontSize: 14.5, color: NAVY }}><strong>{r.name}</strong><span style={{ color: GRAY }}> · {acc?.l}{dep ? ` · ${dep.name}` : ''}</span></span>
                      <button className="kx-link" onClick={() => removeRole(r.id)} disabled={busy} style={{ fontSize: 12.5, color: '#C0392B', background: 'transparent', border: 'none', cursor: 'pointer' }}>entfernen</button>
                    </div>
                  )
                })}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <input className="kx-input" style={{ ...input, marginBottom: 0, flex: '2 1 160px' }} value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="z. B. Rezeptionist:in" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }} />
              <select className="kx-input" style={{ ...input, marginBottom: 0, flex: '1 1 130px' }} value={newRoleDept} onChange={e => setNewRoleDept(e.target.value)}><option value="">keine Abteilung</option>{depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
              <select className="kx-input" style={{ ...input, marginBottom: 0, flex: '1 1 120px' }} value={newRoleAccess} onChange={e => setNewRoleAccess(e.target.value)}>{ACCESS.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}</select>
              <button className="kx-btn" style={{ ...btnGhost, whiteSpace: 'nowrap' }} onClick={addRole} disabled={busy}>+ Hinzufügen</button>
            </div>
            {msg && <p style={{ color: '#C0392B', fontSize: 13.5, margin: '12px 0' }}>{msg}</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
              <button className="kx-btn" style={btnGhost} onClick={() => setStep(0)}>Zurück</button>
              <button className="kx-btn kx-btn-primary" style={btn} onClick={completeDepartments} disabled={busy}>Weiter zu Compliance</button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={h1}>Euer Compliance-Rahmen.</h1>
            <p style={{ ...intro, marginBottom: 8 }}>Welche Regelwerke gelten für euch? KALYX richtet Kurse, Rezertifizierung und Audit-Trail danach aus.</p>
            <p style={{ fontSize: 13, color: GOLD, lineHeight: 1.6, marginBottom: 22 }}>Hinweis: Diese Auswahl beschreibt euren Compliance-Bedarf. Im Pilot werden Daten in der EU gespeichert, voll Schweizer-souveränes Hosting ist das Ziel.</p>

            <label style={label}>Relevante Regelwerke</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
              {FRAMEWORKS.map(f => <button key={f} type="button" className="kx-chip" onClick={() => toggleFramework(f)} style={chip(frameworks.includes(f))}>{f}</button>)}
            </div>

            <div style={tRow}>
              <input type="checkbox" checked={esig} onChange={e => setEsig(e.target.checked)} style={{ marginTop: 2, accentColor: GREEN, width: 17, height: 17 }} />
              <div><div style={{ fontSize: 14.5, fontWeight: 600, color: NAVY }}>Elektronische Signatur bei Abschluss</div><div style={{ fontSize: 13, color: GRAY }}>Lernende bestätigen den Kursabschluss rechtsgültig per E-Signatur.</div></div>
            </div>
            <div style={tRow}>
              <input type="checkbox" checked={residency} onChange={e => setResidency(e.target.checked)} style={{ marginTop: 2, accentColor: GREEN, width: 17, height: 17 }} />
              <div><div style={{ fontSize: 14.5, fontWeight: 600, color: NAVY }}>Datenhaltung CH/EU zur Kenntnis genommen</div><div style={{ fontSize: 13, color: GRAY }}>Uns ist bewusst, dass Daten im Pilot in der EU liegen.</div></div>
            </div>

            <div style={row2}>
              <div>
                <label style={label}>Rezertifizierung (Standard)</label>
                <select className="kx-input" style={input} value={recert} onChange={e => setRecert(e.target.value)}>{RECERT.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}</select>
              </div>
              <div>
                <label style={label}>Aufbewahrung (Monate)</label>
                <input className="kx-input" style={input} type="number" min={0} value={retention} onChange={e => setRetention(parseInt(e.target.value || '0', 10))} />
              </div>
            </div>
            {msg && <p style={{ color: '#C0392B', fontSize: 13.5, margin: '6px 0 12px' }}>{msg}</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <button className="kx-btn" style={btnGhost} onClick={() => setStep(1)}>Zurück</button>
              <button className="kx-btn kx-btn-primary" style={{ ...btn, opacity: savingComp ? 0.7 : 1 }} onClick={saveCompliance} disabled={savingComp}>{savingComp ? 'Speichern …' : 'Speichern und abschließen'}</button>
            </div>
          </>
        )}
      </div>
    </div></div>
  )
}
