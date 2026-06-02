// Ziel-Pfad im Repo: app/onboarding/page.tsx 
//
// Gefuehrter Setup-Assistent - Runde A: Firmenprofil + Abteilungen/Rollen.
// Schreibt mandantengeschuetzt (RLS) ueber die Session. Fortschritt in onboarding_state.
// Weitere Schritte (Compliance, Kurse, Branding, Mitarbeitende) folgen als naechste Runde.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const GREEN = '#14613E'
const NAVY = '#0B1929'
const GOLD = '#B8904A'
const GRAY = '#6B7280'
const PALE = '#E6F0EB'

const STEPS = ['Firmenprofil', 'Abteilungen & Rollen', 'Compliance', 'Kurse', 'Branding', 'Mitarbeitende']
const ACTIVE_MAX = 1 // Schritte 0 und 1 sind in dieser Runde bedienbar

const SECTORS: { v: string; l: string }[] = [
  { v: 'finance', l: 'Finanzdienstleistung' },
  { v: 'pharma', l: 'Pharma / Life Sciences' },
  { v: 'bildung', l: 'Bildung / Verband' },
  { v: 'retail', l: 'Handel / Retail' },
  { v: 'industrie', l: 'Industrie / Produktion' },
  { v: 'sonstige', l: 'Sonstige' },
]
const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+']
const COUNTRIES = ['CH', 'DE', 'AT', 'LI', 'Andere']
const LANGS: { v: string; l: string }[] = [
  { v: 'de', l: 'Deutsch' }, { v: 'fr', l: 'Franz.' }, { v: 'it', l: 'Ital.' }, { v: 'en', l: 'Engl.' },
]
const ACCESS: { v: string; l: string }[] = [
  { v: 'learner', l: 'Lernende(r)' }, { v: 'manager', l: 'Manager' }, { v: 'admin', l: 'Admin' },
]

type Dept = { id: string; name: string; description: string | null }
type Role = { id: string; name: string; department_id: string | null; access_level: string }

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

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

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) { router.replace('/anmelden'); return }
      const { data: au } = await supabase.from('app_users').select('tenant_id').eq('id', session.user.id).maybeSingle()
      const tid = (au as any)?.tenant_id
      if (!tid) { router.replace('/anmelden'); return }
      const { data: prof } = await supabase.from('company_profiles').select('*').eq('tenant_id', tid).maybeSingle()
      const { data: dRows } = await supabase.from('departments').select('id,name,description').eq('tenant_id', tid).order('created_at')
      const { data: rRows } = await supabase.from('roles').select('id,name,department_id,access_level').eq('tenant_id', tid).order('created_at')
      if (!active) return
      setTenantId(tid)
      setEmail(session.user.email || '')
      if (prof) {
        const p = prof as any
        setDisplayName(p.display_name || '')
        setLegalName(p.legal_name || '')
        setSector(p.sector || 'sonstige')
        setCountry(p.country || 'CH')
        setSize(p.company_size || '')
        setWebsite(p.website || '')
        setUid(p.uid_handelsregister || '')
        setContactName(p.contact_name || '')
        setContactEmail(p.contact_email || '')
        setContactPhone(p.contact_phone || '')
        setLangs(Array.isArray(p.languages) && p.languages.length ? p.languages : ['de'])
      }
      setDepts((dRows as Dept[]) || [])
      setRoles((rRows as Role[]) || [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [router])

  async function audit(action: string, entity: string, entityId?: string) {
    try {
      const { data } = await supabase.auth.getSession()
      await supabase.from('audit_log').insert({ tenant_id: tenantId, actor_id: data.session?.user.id, action, entity, entity_id: entityId || null })
    } catch {}
  }

  function toggleLang(v: string) {
    setLangs(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  async function saveProfile() {
    if (!displayName.trim()) { setMsg('Bitte einen Anzeigenamen angeben.'); return }
    setSavingProfile(true); setMsg('')
    const { error } = await supabase.from('company_profiles').update({
      display_name: displayName.trim(),
      legal_name: legalName.trim() || null,
      sector,
      country,
      company_size: size || null,
      website: website.trim() || null,
      uid_handelsregister: uid.trim() || null,
      contact_name: contactName.trim() || null,
      contact_email: contactEmail.trim() || null,
      contact_phone: contactPhone.trim() || null,
      languages: langs.length ? langs : ['de'],
      updated_at: new Date().toISOString(),
    }).eq('tenant_id', tenantId)
    if (error) { setSavingProfile(false); setMsg('Speichern fehlgeschlagen: ' + error.message); return }
    await supabase.from('onboarding_state').update({ step_profile: true, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    await audit('profile_updated', 'company_profiles', tenantId)
    setSavingProfile(false)
    setStep(1)
  }

  async function addDept() {
    const name = newDept.trim()
    if (!name) return
    setBusy(true); setMsg('')
    const { data, error } = await supabase.from('departments').insert({ tenant_id: tenantId, name, description: newDeptDesc.trim() || null }).select('id,name,description').single()
    setBusy(false)
    if (error) { setMsg('Abteilung konnte nicht angelegt werden: ' + error.message); return }
    setDepts(prev => [...prev, data as Dept])
    setNewDept(''); setNewDeptDesc('')
    await audit('department_added', 'departments', (data as any).id)
  }

  async function removeDept(id: string) {
    setBusy(true)
    const { error } = await supabase.from('departments').delete().eq('id', id).eq('tenant_id', tenantId)
    setBusy(false)
    if (error) { setMsg('Loeschen fehlgeschlagen: ' + error.message); return }
    setDepts(prev => prev.filter(d => d.id !== id))
    setRoles(prev => prev.map(r => r.department_id === id ? { ...r, department_id: null } : r))
  }

  async function addRole() {
    const name = newRole.trim()
    if (!name) return
    setBusy(true); setMsg('')
    const { data, error } = await supabase.from('roles').insert({ tenant_id: tenantId, name, department_id: newRoleDept || null, access_level: newRoleAccess }).select('id,name,department_id,access_level').single()
    setBusy(false)
    if (error) { setMsg('Rolle konnte nicht angelegt werden: ' + error.message); return }
    setRoles(prev => [...prev, data as Role])
    setNewRole(''); setNewRoleDept(''); setNewRoleAccess('learner')
    await audit('role_added', 'roles', (data as any).id)
  }

  async function removeRole(id: string) {
    setBusy(true)
    const { error } = await supabase.from('roles').delete().eq('id', id).eq('tenant_id', tenantId)
    setBusy(false)
    if (error) { setMsg('Loeschen fehlgeschlagen: ' + error.message); return }
    setRoles(prev => prev.filter(r => r.id !== id))
  }

  async function finishRoundA() {
    setBusy(true)
    await supabase.from('onboarding_state').update({ step_departments: true, updated_at: new Date().toISOString() }).eq('tenant_id', tenantId)
    await audit('departments_completed', 'onboarding_state', tenantId)
    setBusy(false)
    setDone(true)
  }

  async function logout() { await supabase.auth.signOut(); router.replace('/anmelden') }

  // ---------- Styles ----------
  const page: React.CSSProperties = { minHeight: '100vh', background: NAVY, padding: '32px 20px', fontFamily: '-apple-system, system-ui, sans-serif' }
  const shell: React.CSSProperties = { maxWidth: 760, margin: '0 auto' }
  const card: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: '32px 30px', boxShadow: '0 24px 60px rgba(0,0,0,.35)' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', fontSize: 14, color: '#111', background: '#F5F4EF', border: '1.5px solid #DDD9D0', borderRadius: 8, padding: '10px 13px', marginBottom: 14, outline: 'none', boxSizing: 'border-box' }
  const btn: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN, border: 'none', borderRadius: 8, padding: '12px 22px', cursor: 'pointer' }
  const btnGhost: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: GREEN, background: 'transparent', border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: '9px 16px', cursor: 'pointer' }
  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }

  if (loading) return <div style={page}><div style={{ ...shell, color: 'rgba(255,255,255,.7)' }}>Lade …</div></div>

  if (done) {
    return (
      <div style={page}><div style={shell}><div style={card}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: PALE, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: NAVY, marginBottom: 12 }}>Grundgeruest steht</h1>
        <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.6, marginBottom: 8 }}>
          Firmenprofil gespeichert. Angelegt: <strong style={{ color: NAVY }}>{depts.length}</strong> Abteilung(en) und <strong style={{ color: NAVY }}>{roles.length}</strong> Rolle(n).
        </p>
        <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, marginBottom: 24 }}>
          Als Naechstes folgen Compliance-Rahmen, Kurse, Branding und das Einladen der Mitarbeitenden. Diese Schritte bauen wir in der naechsten Runde an dieselbe Stelle.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnGhost} onClick={() => { setDone(false); setStep(0) }}>Eingaben bearbeiten</button>
          <button style={btnGhost} onClick={logout}>Abmelden</button>
        </div>
      </div></div></div>
    )
  }

  return (
    <div style={page}>
      <div style={shell}>
        {/* Kopf + Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '.06em' }}>KALYX · Einrichtung</div>
          <button onClick={logout} style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Abmelden</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => {
            const usable = i <= ACTIVE_MAX
            const current = i === step
            return (
              <button key={s} disabled={!usable} onClick={() => usable && setStep(i)}
                style={{ fontSize: 12.5, fontWeight: 600, padding: '7px 12px', borderRadius: 20, cursor: usable ? 'pointer' : 'default',
                  border: current ? `1.5px solid ${GOLD}` : '1.5px solid transparent',
                  color: current ? NAVY : usable ? '#fff' : 'rgba(255,255,255,.4)',
                  background: current ? GOLD : usable ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.04)' }}>
                {i + 1}. {s}{!usable ? ' · bald' : ''}
              </button>
            )
          })}
        </div>

        <div style={card}>
          {step === 0 && (
            <>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: NAVY, marginBottom: 4 }}>Firmenprofil</h1>
              <p style={{ fontSize: 13.5, color: GRAY, marginBottom: 22 }}>Diese Angaben bilden die Basis fuer Zertifikate, Audit-Trail und das spaetere Branding.</p>

              <label style={label}>Anzeigename *</label>
              <input style={input} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="VillaWinkel" />

              <label style={label}>Rechtlicher Name</label>
              <input style={input} value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="VillaWinkel AG" />

              <div style={row2}>
                <div>
                  <label style={label}>Branche</label>
                  <select style={input} value={sector} onChange={e => setSector(e.target.value)}>
                    {SECTORS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>Unternehmensgroesse</label>
                  <select style={input} value={size} onChange={e => setSize(e.target.value)}>
                    <option value="">bitte waehlen</option>
                    {SIZES.map(s => <option key={s} value={s}>{s} Mitarbeitende</option>)}
                  </select>
                </div>
              </div>

              <div style={row2}>
                <div>
                  <label style={label}>Land</label>
                  <select style={input} value={country} onChange={e => setCountry(e.target.value)}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={label}>UID / Handelsregister</label>
                  <input style={input} value={uid} onChange={e => setUid(e.target.value)} placeholder="CHE-123.456.789" />
                </div>
              </div>

              <label style={label}>Website</label>
              <input style={input} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://villawinkel.ch" />

              <label style={label}>Sprachen der Plattform</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {LANGS.map(l => {
                  const on = langs.includes(l.v)
                  return <button key={l.v} type="button" onClick={() => toggleLang(l.v)}
                    style={{ fontSize: 13, fontWeight: 600, padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${on ? GREEN : '#DDD9D0'}`, color: on ? '#fff' : NAVY, background: on ? GREEN : '#fff' }}>{l.l}</button>
                })}
              </div>

              <div style={{ borderTop: '1px solid #EEE', margin: '6px 0 18px' }} />
              <p style={{ fontSize: 12.5, fontWeight: 600, color: GRAY, marginBottom: 12 }}>Hauptansprechpartner (optional)</p>
              <div style={row2}>
                <div><label style={label}>Name</label><input style={input} value={contactName} onChange={e => setContactName(e.target.value)} /></div>
                <div><label style={label}>Telefon</label><input style={input} value={contactPhone} onChange={e => setContactPhone(e.target.value)} /></div>
              </div>
              <label style={label}>E-Mail</label>
              <input style={input} type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />

              {msg && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 12 }}>{msg}</p>}
              <button style={{ ...btn, opacity: savingProfile ? 0.7 : 1 }} onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? 'Speichern …' : 'Speichern und weiter'}
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: NAVY, marginBottom: 4 }}>Abteilungen & Rollen</h1>
              <p style={{ fontSize: 13.5, color: GRAY, marginBottom: 22 }}>Lege deine Organisationsstruktur an. Spaeter werden Kurse genau diesen Abteilungen und Rollen zugewiesen.</p>

              {/* Abteilungen */}
              <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Abteilungen</p>
              {depts.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  {depts.map(d => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F4EF', borderRadius: 8, padding: '9px 12px', marginBottom: 7 }}>
                      <span style={{ fontSize: 14, color: NAVY }}><strong>{d.name}</strong>{d.description ? <span style={{ color: GRAY }}> · {d.description}</span> : null}</span>
                      <button onClick={() => removeDept(d.id)} disabled={busy} style={{ fontSize: 12, color: '#C0392B', background: 'transparent', border: 'none', cursor: 'pointer' }}>entfernen</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
                <input style={{ ...input, marginBottom: 0, flex: 1 }} value={newDept} onChange={e => setNewDept(e.target.value)} placeholder="z. B. Empfang" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDept() } }} />
                <input style={{ ...input, marginBottom: 0, flex: 1 }} value={newDeptDesc} onChange={e => setNewDeptDesc(e.target.value)} placeholder="Kurzbeschreibung (optional)" />
                <button style={{ ...btnGhost, whiteSpace: 'nowrap' }} onClick={addDept} disabled={busy}>+ Hinzufuegen</button>
              </div>

              {/* Rollen */}
              <p style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Rollen / Funktionen</p>
              {roles.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  {roles.map(r => {
                    const dep = depts.find(d => d.id === r.department_id)
                    const acc = ACCESS.find(a => a.v === r.access_level)
                    return (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F5F4EF', borderRadius: 8, padding: '9px 12px', marginBottom: 7 }}>
                        <span style={{ fontSize: 14, color: NAVY }}><strong>{r.name}</strong><span style={{ color: GRAY }}> · {acc?.l}{dep ? ` · ${dep.name}` : ''}</span></span>
                        <button onClick={() => removeRole(r.id)} disabled={busy} style={{ fontSize: 12, color: '#C0392B', background: 'transparent', border: 'none', cursor: 'pointer' }}>entfernen</button>
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <input style={{ ...input, marginBottom: 0, flex: '2 1 160px' }} value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="z. B. Rezeptionist:in" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addRole() } }} />
                <select style={{ ...input, marginBottom: 0, flex: '1 1 130px' }} value={newRoleDept} onChange={e => setNewRoleDept(e.target.value)}>
                  <option value="">keine Abteilung</option>
                  {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <select style={{ ...input, marginBottom: 0, flex: '1 1 120px' }} value={newRoleAccess} onChange={e => setNewRoleAccess(e.target.value)}>
                  {ACCESS.map(a => <option key={a.v} value={a.v}>{a.l}</option>)}
                </select>
                <button style={{ ...btnGhost, whiteSpace: 'nowrap' }} onClick={addRole} disabled={busy}>+ Hinzufuegen</button>
              </div>

              {msg && <p style={{ color: '#C0392B', fontSize: 13, margin: '12px 0' }}>{msg}</p>}
              <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
                <button style={btnGhost} onClick={() => setStep(0)}>Zurueck</button>
                <button style={{ ...btn, opacity: busy ? 0.7 : 1 }} onClick={finishRoundA} disabled={busy}>Fertig fuer jetzt</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
