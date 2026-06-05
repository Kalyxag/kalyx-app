// Ziel-Pfad im Repo: app/support/page.tsx  (NEU)
//
// Geschuetzte Support-Uebersicht fuer den Plattformbetreiber. Zeigt nach Eingabe
// des Zugangscodes alle Mandanten, getrennt nach Kunde und Demo, mit Kennzahlen
// je Firma und global. Holt die Daten von /api/admin-overview. Reine Anzeige.

'use client'

import { useEffect, useState, type CSSProperties } from 'react'

const NAVY = '#0B1929', CREAM = '#F5F4EF', GREEN = '#14613E', GOLD = '#B8904A'
const INK = '#1d2733', MUTE = '#5b6b7a', LINE = '#e4e1d8', CARD = '#ffffff'
const FH = "'Cormorant', Georgia, serif"
const FB = "'Albert Sans', system-ui, sans-serif"
const FM = "'IBM Plex Mono', ui-monospace, monospace"

const SECTOR_LABEL: Record<string, string> = {
  finance: 'Finance', pharma: 'Pharma', bildung: 'Bildung', retail: 'Retail',
  industrie: 'Industrie', sonstige: 'Sonstige',
}
const PLAN_LABEL: Record<string, string> = { klein: 'KLEIN', mittel: 'MITTEL', gross: 'GROSS', konzern: 'KONZERN' }
const ADDON_LABEL: Record<string, string> = { bi: 'BI-Anbindung', sso: 'SSO / SAML', dedicated: 'Dedizierte CH-Infra' }
const ADDON_ORDER = ['bi', 'sso', 'dedicated']   // neue Add-ons hier und in ADDON_LABEL ergaenzen
const STATUS_LABEL: Record<string, string> = { pilot: 'Pilot', aktiv: 'Aktiv', gesperrt: 'Gesperrt' }
const STATUS_BG: Record<string, string> = { pilot: '#f3eccf', aktiv: '#dcefe4', gesperrt: '#f6dcdc' }
const STATUS_FG: Record<string, string> = { pilot: '#8a6d1f', aktiv: '#14613e', gesperrt: '#9b2c2c' }

const lblStyle: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginTop: 12, marginBottom: 4 }
const inStyle: CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid ' + LINE, background: CARD, fontSize: 14, fontFamily: FB }

type Block = { mandanten: number; mitglieder: number; kurse_eigen: number; pruefungen_bestanden: number; nachweise: number; bestnote: number }
type Mandant = { slug: string; name: string; sector: string | null; is_demo: boolean; status: string | null; paket: string | null; lizenzen: number | null; addons: string[]; abrechnung: string | null; konto_status: string | null; mitglieder: number; kurse_eigen: number; pruefungen_bestanden: number; nachweise: number; bestnote: number }
type Data = { ok: boolean; demo_quelle: string; billing_vorhanden?: boolean; global: Block & { kunden: number; demo: number }; nur_kunden: Block; nur_demo: Block; mandanten: Mandant[] }

function injectCI() {
  if (typeof document === 'undefined') return
  if (document.getElementById('kalyx-support')) return
  const s = document.createElement('style')
  s.id = 'kalyx-support'
  s.textContent = "@import url('https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');"
    + "*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:" + CREAM + ";color:" + INK + ";font-family:" + FB + "}"
    + ".kx-in{outline:none}.kx-in:focus{border-color:" + GREEN + " !important}"
    + ".kx-row:hover{background:#faf9f5}"
  document.head.appendChild(s)
}

export default function SupportPage() {
  const [token, setToken] = useState('')
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'alle' | 'kunden' | 'demo'>('alle')

  // Detail-Panel (Kundenakte) + Bearbeiten
  const [sel, setSel] = useState<Mandant | null>(null)
  const [ePlan, setEPlan] = useState('klein')
  const [eSeats, setESeats] = useState('1')
  const [eAddons, setEAddons] = useState<string[]>([])
  const [eStatus, setEStatus] = useState('pilot')
  const [eInterval, setEInterval] = useState('monatlich')
  const [eNotes, setENotes] = useState('')
  const [detail, setDetail] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  async function openDetail(m: Mandant) {
    setSel(m)
    setEPlan(m.paket || 'klein')
    setESeats(String(typeof m.lizenzen === 'number' ? m.lizenzen : 1))
    setEAddons(Array.isArray(m.addons) ? m.addons : [])
    setEStatus(m.konto_status || 'pilot')
    setEInterval(m.abrechnung || 'monatlich')
    setENotes(''); setSaveMsg('')
    setDetail(null); setDetailError(''); setDetailLoading(true)
    try {
      const res = await fetch('/api/admin-tenant?token=' + encodeURIComponent(token) + '&slug=' + encodeURIComponent(m.slug), { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok || !j.ok) { setDetailError(j.error || 'Details konnten nicht geladen werden.') }
      else {
        setDetail(j)
        if (j.billing) {
          setEPlan(j.billing.plan); setESeats(String(j.billing.seats)); setEAddons(j.billing.addons || [])
          setEStatus(j.billing.status); setEInterval(j.billing.billing_interval); setENotes(j.billing.notes || '')
        }
      }
    } catch { setDetailError('Verbindung fehlgeschlagen.') }
    finally { setDetailLoading(false) }
  }

  function toggleAddon(a: string) {
    setEAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function saveDetail() {
    if (!sel) return
    const seatsNum = parseInt(eSeats, 10)
    if (!Number.isFinite(seatsNum) || seatsNum < 0) { setSaveMsg('Bitte eine gueltige Lizenzzahl eingeben (0 oder mehr).'); return }
    setSaving(true); setSaveMsg('')
    try {
      const res = await fetch('/api/admin-tenant?token=' + encodeURIComponent(token), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: sel.slug, plan: ePlan, seats: seatsNum, addons: eAddons, status: eStatus, billing_interval: eInterval, notes: eNotes }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) { setSaveMsg(j.error || ('Speichern fehlgeschlagen (Status ' + res.status + ').')); return }
      setData(d => {
        if (!d) return d
        const upd = d.mandanten.map(x => x.slug === sel.slug
          ? { ...x, paket: ePlan, lizenzen: seatsNum, addons: [...eAddons], konto_status: eStatus, abrechnung: eInterval }
          : x)
        return { ...d, mandanten: upd }
      })
      setSel(s => s ? { ...s, paket: ePlan, lizenzen: seatsNum, addons: [...eAddons], konto_status: eStatus, abrechnung: eInterval } : s)
      const now = new Date().toISOString()
      setDetail((dd: any) => dd ? { ...dd, billing: { ...(dd.billing || {}), notes: eNotes, updated_at: now } } : dd)
      setSaveMsg('Gespeichert.')
    } catch {
      setSaveMsg('Verbindung fehlgeschlagen. Bitte erneut versuchen.')
    } finally { setSaving(false) }
  }

  useEffect(() => {
    injectCI()
    try {
      const u = new URL(window.location.href)
      const t = u.searchParams.get('token')
      if (t) { setToken(t); void load(t) }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function load(t: string) {
    const code = (t || '').trim()
    if (!code) { setError('Bitte Zugangscode eingeben.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/admin-overview?token=' + encodeURIComponent(code), { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok || !j.ok) { setError(j.error || 'Zugriff nicht moeglich. Code pruefen.'); setData(null) }
      else setData(j as Data)
    } catch {
      setError('Verbindung fehlgeschlagen. Bitte erneut versuchen.')
    } finally { setLoading(false) }
  }

  const shown = data ? (filter === 'alle' ? data.global : filter === 'kunden' ? { ...data.nur_kunden, kunden: data.global.kunden, demo: data.global.demo } : { ...data.nur_demo, kunden: data.global.kunden, demo: data.global.demo }) : null
  const rows = data ? data.mandanten.filter(m => filter === 'alle' ? true : filter === 'kunden' ? !m.is_demo : m.is_demo) : []

  // ---- Login-Ansicht ----
  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: NAVY }}>
        <div style={{ width: '100%', maxWidth: 420, background: CARD, borderRadius: 18, padding: 36, boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
          <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 3, color: GOLD, textTransform: 'uppercase', textAlign: 'center' }}>Support</div>
          <div style={{ fontFamily: FH, fontSize: 38, fontWeight: 700, color: NAVY, textAlign: 'center', marginTop: 4 }}>KALYX</div>
          <p style={{ color: MUTE, textAlign: 'center', marginTop: 8, marginBottom: 24, fontSize: 14 }}>Interne Mandantenuebersicht. Bitte Zugangscode eingeben.</p>
          <label style={{ fontSize: 13, fontWeight: 600, color: INK }}>Zugangscode</label>
          <input
            className="kx-in" type="password" value={token}
            onChange={e => setToken(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') void load(token) }}
            placeholder="Code"
            style={{ width: '100%', marginTop: 6, marginBottom: 14, padding: '12px 14px', borderRadius: 10, border: '1px solid ' + LINE, background: CREAM, fontSize: 15, fontFamily: FM }}
          />
          {error && <div style={{ color: '#b3261e', fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button
            onClick={() => void load(token)} disabled={loading}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >{loading ? 'Laedt ...' : 'Anzeigen'}</button>
        </div>
      </div>
    )
  }

  // ---- Uebersicht ----
  const Kachel = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, padding: '18px 20px', flex: '1 1 160px', minWidth: 150 }}>
      <div style={{ fontFamily: FH, fontSize: 40, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginTop: 8 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: MUTE, marginTop: 2 }}>{sub}</div>}
    </div>
  )

  const Tab = ({ id, text }: { id: 'alle' | 'kunden' | 'demo'; text: string }) => (
    <button onClick={() => setFilter(id)}
      style={{ padding: '8px 16px', borderRadius: 999, border: '1px solid ' + (filter === id ? GREEN : LINE), background: filter === id ? GREEN : CARD, color: filter === id ? '#fff' : INK, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
      {text}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: CREAM }}>
      <div style={{ background: NAVY, color: '#fff', padding: '22px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 3, color: GOLD, textTransform: 'uppercase' }}>Support</div>
            <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>Mandantenuebersicht</div>
          </div>
          <button onClick={() => { setData(null); setToken('') }}
            style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Abmelden
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <Tab id="alle" text={'Alle (' + data.global.mandanten + ')'} />
          <Tab id="kunden" text={'Kunden (' + data.global.kunden + ')'} />
          <Tab id="demo" text={'Demo (' + data.global.demo + ')'} />
        </div>

        {shown && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <Kachel label="Mandanten" value={shown.mandanten} sub={filter === 'alle' ? (data.global.kunden + ' Kunden, ' + data.global.demo + ' Demo') : undefined} />
            <Kachel label="Mitglieder" value={shown.mitglieder} />
            <Kachel label="Bestandene Pruefungen" value={shown.pruefungen_bestanden} />
            <Kachel label="Ausgestellte Nachweise" value={shown.nachweise} />
            <Kachel label="Bestnote" value={shown.bestnote ? shown.bestnote + '%' : '-'} />
          </div>
        )}

        {filter !== 'kunden' && (
          <p style={{ fontSize: 12.5, color: MUTE, margin: '4px 2px 18px', lineHeight: 1.5 }}>
            Hinweis: Demo-Konten sind Testdaten. Fuer oeffentliches Marketing bitte nur die Ansicht Kunden verwenden.
          </p>
        )}

        <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#faf9f5', textAlign: 'left' }}>
                  {['Firma', 'Branche', 'Typ', 'Paket', 'Mitglieder', 'Eigene Kurse', 'Bestanden', 'Nachweise', 'Bestnote'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 14px', fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', color: MUTE, fontWeight: 700, borderBottom: '1px solid ' + LINE, textAlign: i >= 4 ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((m, idx) => (
                  <tr key={m.slug} onClick={() => openDetail(m)} className="kx-row"
                    style={{ borderBottom: idx === rows.length - 1 ? 'none' : '1px solid ' + LINE, cursor: 'pointer' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: INK }}>{m.name}</td>
                    <td style={{ padding: '12px 14px', color: MUTE, fontSize: 13 }}>{m.sector ? (SECTOR_LABEL[m.sector] || m.sector) : '-'}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: m.is_demo ? '#f3eccf' : '#dcefe4', color: m.is_demo ? '#8a6d1f' : GREEN }}>
                        {m.is_demo ? 'Demo' : 'Kunde'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12.5 }}>
                      {m.paket ? (
                        <div>
                          <span style={{ fontWeight: 700, color: INK, fontFamily: FM }}>{PLAN_LABEL[m.paket] || m.paket}</span>
                          {typeof m.lizenzen === 'number' ? <span style={{ color: MUTE }}> · {m.lizenzen} Liz.</span> : null}
                          {m.konto_status ? (
                            <span style={{ marginLeft: 6, fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: STATUS_BG[m.konto_status] || '#eee', color: STATUS_FG[m.konto_status] || INK }}>
                              {STATUS_LABEL[m.konto_status] || m.konto_status}
                            </span>
                          ) : null}
                          {m.addons && m.addons.length > 0 ? (
                            <div style={{ marginTop: 3, fontSize: 11, color: MUTE }}>{m.addons.map(a => ADDON_LABEL[a] || a).join(', ')}</div>
                          ) : null}
                        </div>
                      ) : <span style={{ color: MUTE }}>-</span>}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13 }}>{m.mitglieder}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13 }}>{m.kurse_eigen}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13 }}>{m.pruefungen_bestanden}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13 }}>{m.nachweise}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13, color: m.bestnote >= 90 ? GREEN : INK }}>{m.bestnote ? m.bestnote + '%' : '-'}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: '28px 14px', textAlign: 'center', color: MUTE }}>Keine Eintraege in dieser Ansicht.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ fontSize: 11.5, color: MUTE, marginTop: 14, fontFamily: FM }}>Quelle Demo-Markierung: {data.demo_quelle}{data.billing_vorhanden === false ? ' · Hinweis: Tabelle tenant_billing fehlt noch (SQL ausfuehren)' : ''}</div>
      </div>

      {sel && (
        <div onClick={() => setSel(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(11,25,41,0.45)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, height: '100%', background: CREAM, boxShadow: '-20px 0 50px rgba(0,0,0,0.25)', overflowY: 'auto' }}>
            <div style={{ background: NAVY, color: '#fff', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FH, fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
                {sel.name.split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{sel.name}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                  {(sel.sector ? (SECTOR_LABEL[sel.sector] || sel.sector) : 'Branche unbekannt') + ' · ' + (sel.is_demo ? 'Demo' : 'Kunde')}
                </div>
              </div>
              <button onClick={() => setSel(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>Schliessen</button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
                {([['Mitglieder', sel.mitglieder], ['Eigene Kurse', sel.kurse_eigen], ['Bestanden', sel.pruefungen_bestanden], ['Nachweise', sel.nachweise]] as [string, number][]).map(([l, v], i) => (
                  <div key={i} style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: MUTE, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 6 }}>Profil und Kontakt</div>
              {detailLoading && <div style={{ fontSize: 13, color: MUTE, marginBottom: 18 }}>Laedt Details ...</div>}
              {detailError && <div style={{ fontSize: 13, color: '#b3261e', marginBottom: 18 }}>{detailError}</div>}
              {detail && detail.profil && (
                <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 12, padding: '14px 16px', marginBottom: 22, fontSize: 13.5, lineHeight: 1.8 }}>
                  {(([['Ansprechpartner', detail.profil.contact_name], ['E-Mail', detail.profil.contact_email], ['Telefon', detail.profil.contact_phone], ['Website', detail.profil.website], ['Rechtsname', detail.profil.legal_name], ['UID / HR', detail.profil.uid], ['Land', detail.profil.country], ['Groesse', detail.profil.company_size]]) as [string, string | null][])
                    .filter(([, v]) => v).map(([l, v], i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ color: MUTE }}>{l}</span>
                        <span style={{ color: INK, textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                      </div>
                    ))}
                  {[detail.profil.contact_name, detail.profil.contact_email, detail.profil.website, detail.profil.legal_name].every(x => !x) && (
                    <div style={{ color: MUTE }}>Noch keine Kontaktdaten hinterlegt.</div>
                  )}
                </div>
              )}

              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 6 }}>Paket und Lizenzen</div>

              <label style={lblStyle}>Paket</label>
              <select className="kx-in" value={ePlan} onChange={e => setEPlan(e.target.value)} style={inStyle}>
                {Object.keys(PLAN_LABEL).map(p => <option key={p} value={p}>{PLAN_LABEL[p]}</option>)}
              </select>

              <label style={lblStyle}>Lizenzen (Personen)</label>
              <input className="kx-in" type="number" min={0} value={eSeats} onChange={e => setESeats(e.target.value)} style={inStyle} />

              <label style={lblStyle}>Abrechnung</label>
              <select className="kx-in" value={eInterval} onChange={e => setEInterval(e.target.value)} style={inStyle}>
                <option value="monatlich">monatlich</option>
                <option value="jaehrlich">jaehrlich</option>
              </select>

              <label style={lblStyle}>Status</label>
              <select className="kx-in" value={eStatus} onChange={e => setEStatus(e.target.value)} style={inStyle}>
                {Object.keys(STATUS_LABEL).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>

              <label style={{ ...lblStyle, marginTop: 16 }}>Add-ons</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {ADDON_ORDER.map(a => {
                  const on = eAddons.includes(a)
                  return (
                    <button key={a} onClick={() => toggleAddon(a)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, border: '1px solid ' + (on ? GREEN : LINE), background: on ? '#eef5f0' : CARD, color: INK, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                      <span>{ADDON_LABEL[a] || a}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: on ? GREEN : MUTE }}>{on ? 'gebucht' : 'aus'}</span>
                    </button>
                  )
                })}
              </div>

              <label style={{ ...lblStyle, marginTop: 16 }}>Interne Notiz (nur fuer das Team)</label>
              <textarea className="kx-in" value={eNotes} onChange={e => setENotes(e.target.value)} rows={4}
                placeholder="Gespraechsnotizen, naechste Schritte, Vereinbarungen ..."
                style={{ ...inStyle, resize: 'vertical', minHeight: 92, lineHeight: 1.5 }} />
              {detail && detail.billing && detail.billing.updated_at && (
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 6, fontFamily: FM }}>Zuletzt bearbeitet: {new Date(detail.billing.updated_at).toLocaleString('de-CH')}</div>
              )}

              <button onClick={() => void saveDetail()} disabled={saving}
                style={{ width: '100%', marginTop: 22, padding: '13px 16px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Speichert ...' : 'Aenderungen speichern'}
              </button>
              {saveMsg && <div style={{ marginTop: 10, fontSize: 13, color: saveMsg === 'Gespeichert.' ? GREEN : '#b3261e', textAlign: 'center' }}>{saveMsg}</div>}

              <div style={{ fontSize: 11, color: MUTE, marginTop: 16, fontFamily: FM, lineHeight: 1.5 }}>
                {'Mandant: ' + sel.slug + (sel.is_demo ? ' · Demo-Konto (zaehlt nicht als Umsatz)' : '')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
