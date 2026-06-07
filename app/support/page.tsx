// Ziel-Pfad im Repo: app/support/page.tsx  (NEU)
//
// Geschuetzte Support-Übersicht für den Plattformbetreiber. Zeigt nach Eingabe
// des Zugangscodes alle Mandanten, getrennt nach Kunde und Demo, mit Kennzahlen
// je Firma und global. Holt die Daten von /api/admin-overview. Reine Anzeige.

'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { INTEGRATIONS, INTEGRATION_KATEGORIEN, INTEGRATION_MAP } from '@/lib/integrations/catalog'
import { PLAN_PREIS_PRO_PERSON, ADDON_PREIS, SETUP_GEBUEHR, SETUP_RABATT_STANDARD, JAHRESRABATT, mrrMandant, arrMandant, lizenzMrr, rechnePaket } from '@/lib/billing/preise'

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
const ADDON_LABEL: Record<string, string> = { white_label: 'White-Label', ki_budget: 'KI-Kursbudget', api: 'API-Anbindung', support: 'Erweiterter Support', bi: 'BI-Anbindung', sso: 'SSO / SAML', dedicated: 'Dedizierte CH-Infra' }
const ADDON_ORDER = ['white_label', 'ki_budget', 'api', 'support', 'bi', 'sso', 'dedicated']   // neue Add-ons hier und in ADDON_LABEL ergänzen
const STATUS_LABEL: Record<string, string> = { pilot: 'Pilot', aktiv: 'Aktiv', gesperrt: 'Gesperrt' }
const STATUS_BG: Record<string, string> = { pilot: '#f3eccf', aktiv: '#dcefe4', gesperrt: '#f6dcdc' }
const STATUS_FG: Record<string, string> = { pilot: '#8a6d1f', aktiv: '#14613e', gesperrt: '#9b2c2c' }

// Integrations-Status
const ISTATUS_LABEL: Record<string, string> = { aktiv: 'Aktiv', vorbereitung: 'In Vorbereitung', inaktiv: 'Nicht gebucht' }
const ISTATUS_FG: Record<string, string> = { aktiv: '#14613e', vorbereitung: '#8a6d1f', inaktiv: '#5b6b7a' }

const lblStyle: CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginTop: 12, marginBottom: 4 }
const inStyle: CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid ' + LINE, background: CARD, fontSize: 14, fontFamily: FB }

type Block = { mandanten: number; mitglieder: number; kurse_eigen: number; prüfungen_bestanden: number; nachweise: number; bestnote: number }
type Mandant = { slug: string; name: string; sector: string | null; is_demo: boolean; status: string | null; paket: string | null; lizenzen: number | null; addons: string[]; abrechnung: string | null; konto_status: string | null; mitglieder: number; kurse_eigen: number; prüfungen_bestanden: number; nachweise: number; bestnote: number }
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

const fmtCHF = (n: number) => 'CHF ' + Math.round(n).toLocaleString('de-CH')

function UmsatzKachel({ label, value, sub, akzent }: { label: string; value: string; sub?: string; akzent?: boolean }) {
  return (
    <div style={{ flex: '1 1 180px', minWidth: 160, background: akzent ? GREEN : CARD, border: '1px solid ' + (akzent ? GREEN : LINE), borderRadius: 14, padding: '18px 20px' }}>
      <div style={{ fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase', color: akzent ? 'rgba(255,255,255,.75)' : MUTE, fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 700, color: akzent ? '#fff' : INK, marginTop: 6, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, color: akzent ? 'rgba(255,255,255,.8)' : MUTE, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function UmsatzPanel({ mandanten, setupRabatt, setSetupRabatt }: { mandanten: Mandant[]; setupRabatt: number; setSetupRabatt: (n: number) => void }) {
  const kunden = mandanten.filter(m => !m.is_demo)
  const demo = mandanten.filter(m => m.is_demo)
  const zahlende = kunden.filter(m => mrrMandant(m) > 0)
  const mrrK = kunden.reduce((s, m) => s + mrrMandant(m), 0)
  const arrK = kunden.reduce((s, m) => s + arrMandant(m), 0)
  const mrrD = demo.reduce((s, m) => s + mrrMandant(m), 0)
  const proKunde = zahlende.length > 0 ? mrrK / zahlende.length : 0

  const proPlan = ['klein', 'mittel', 'gross', 'konzern'].map(p => {
    const list = zahlende.filter(m => m.paket === p)
    return { plan: p, kunden: list.length, seats: list.reduce((s, m) => s + (m.lizenzen || 0), 0), mrr: list.reduce((s, m) => s + lizenzMrr(m), 0) }
  }).filter(x => x.kunden > 0)

  const proAddon = Object.keys(ADDON_PREIS).map(a => {
    const anzahl = kunden.filter(m => (m.addons || []).includes(a)).length
    return { addon: a, anzahl, mrr: anzahl * (ADDON_PREIS[a] || 0) }
  }).filter(x => x.anzahl > 0)

  const setupBrutto = zahlende.length * SETUP_GEBUEHR
  const setupNetto = Math.round(setupBrutto * (1 - setupRabatt))
  const rabattProzent = Math.round(setupRabatt * 100)

  const th: CSSProperties = { padding: '10px 14px', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', color: MUTE, fontWeight: 700, borderBottom: '1px solid ' + LINE }
  const td: CSSProperties = { padding: '11px 14px', fontSize: 13.5, color: INK }
  const tdR: CSSProperties = { padding: '11px 14px', fontSize: 13.5, color: INK, textAlign: 'right', fontFamily: FM }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <UmsatzKachel label="Wiederkehrend pro Monat" value={fmtCHF(mrrK)} sub="MRR aus zahlenden Kunden" akzent />
        <UmsatzKachel label="Hochrechnung pro Jahr" value={fmtCHF(arrK)} sub="ARR, Jahresrabatt beruecksichtigt" />
        <UmsatzKachel label="Zahlende Kunden" value={String(zahlende.length)} sub={kunden.length + ' Kundenkonten insgesamt'} />
        <UmsatzKachel label="Pro Kunde im Schnitt" value={fmtCHF(proKunde)} sub="MRR je zahlendem Kunden" />
      </div>

      <div style={{ background: '#f8f1e4', border: '1px solid ' + GOLD, borderRadius: 12, padding: '14px 18px', marginBottom: 22 }}>
        <div style={{ fontSize: 13.5, color: '#6f5a24', lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 700 }}>Demo-Potenzial:</strong> Die {demo.length} Demo-Konten würden nach diesem Modell rechnerisch {fmtCHF(mrrD)} pro Monat ergeben. Diese Zahl dient nur der Orientierung und zählt bewusst nicht zum Umsatz.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 22 }}>
        <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', fontFamily: FH, fontSize: 18, fontWeight: 700, color: INK, borderBottom: '1px solid ' + LINE }}>Nach Paket</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#faf9f5' }}><th style={{ ...th, textAlign: 'left' }}>Paket</th><th style={{ ...th, textAlign: 'right' }}>Kunden</th><th style={{ ...th, textAlign: 'right' }}>Lizenzen</th><th style={{ ...th, textAlign: 'right' }}>MRR</th></tr></thead>
            <tbody>
              {proPlan.map(r => (
                <tr key={r.plan} style={{ borderBottom: '1px solid ' + LINE }}>
                  <td style={td}><span style={{ fontFamily: FM, fontWeight: 700 }}>{PLAN_LABEL[r.plan] || r.plan}</span> <span style={{ color: MUTE, fontSize: 12 }}>· {PLAN_PREIS_PRO_PERSON[r.plan]}/P.</span></td>
                  <td style={tdR}>{r.kunden}</td><td style={tdR}>{r.seats}</td><td style={tdR}>{fmtCHF(r.mrr)}</td>
                </tr>
              ))}
              {proPlan.length === 0 && <tr><td colSpan={4} style={{ ...td, textAlign: 'center', color: MUTE }}>Noch keine zahlenden Kunden.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', fontFamily: FH, fontSize: 18, fontWeight: 700, color: INK, borderBottom: '1px solid ' + LINE }}>Nach Add-on</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#faf9f5' }}><th style={{ ...th, textAlign: 'left' }}>Add-on</th><th style={{ ...th, textAlign: 'right' }}>Gebucht</th><th style={{ ...th, textAlign: 'right' }}>MRR</th></tr></thead>
            <tbody>
              {proAddon.map(r => (
                <tr key={r.addon} style={{ borderBottom: '1px solid ' + LINE }}>
                  <td style={td}>{ADDON_LABEL[r.addon] || r.addon} <span style={{ color: MUTE, fontSize: 12 }}>· {ADDON_PREIS[r.addon]}/Mt.</span></td>
                  <td style={tdR}>{r.anzahl}x</td><td style={tdR}>{fmtCHF(r.mrr)}</td>
                </tr>
              ))}
              {proAddon.length === 0 && <tr><td colSpan={3} style={{ ...td, textAlign: 'center', color: MUTE }}>Noch keine Add-ons gebucht.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, padding: '18px 20px', marginBottom: 22 }}>
        <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>Einmalige Einrichtung</div>
        <div style={{ fontSize: 13, color: MUTE, marginBottom: 14, lineHeight: 1.5 }}>Einmalig {fmtCHF(SETUP_GEBUEHR)} je neuem Kunden. Im Pilot üblicherweise voll rabattiert. Verschiebe den Regler, um den Effekt zu sehen.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <input type="range" min={0} max={100} value={rabattProzent} onChange={e => setSetupRabatt(Number(e.target.value) / 100)} style={{ flex: '1 1 220px', accentColor: GREEN }} />
          <div style={{ fontFamily: FM, fontSize: 13, color: INK, minWidth: 92 }}>Rabatt {rabattProzent}%</div>
          <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, color: GREEN }}>{fmtCHF(setupNetto)}</div>
        </div>
        <div style={{ fontSize: 12, color: MUTE, marginTop: 8 }}>{zahlende.length} zahlende Kunden, brutto {fmtCHF(setupBrutto)}.</div>
      </div>

      <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ padding: '14px 16px', fontFamily: FH, fontSize: 18, fontWeight: 700, color: INK, borderBottom: '1px solid ' + LINE }}>Umsatz je Mandant</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead><tr style={{ background: '#faf9f5' }}><th style={{ ...th, textAlign: 'left' }}>Firma</th><th style={{ ...th, textAlign: 'left' }}>Typ</th><th style={{ ...th, textAlign: 'left' }}>Paket</th><th style={{ ...th, textAlign: 'right' }}>Lizenzen</th><th style={{ ...th, textAlign: 'right' }}>MRR</th></tr></thead>
            <tbody>
              {[...kunden, ...demo].map(m => (
                <tr key={m.slug} style={{ borderBottom: '1px solid ' + LINE, opacity: m.is_demo ? 0.55 : 1 }}>
                  <td style={{ ...td, fontWeight: 600 }}>{m.name}</td>
                  <td style={td}><span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: m.is_demo ? '#f3eccf' : '#dcefe4', color: m.is_demo ? '#8a6d1f' : GREEN }}>{m.is_demo ? 'Demo' : 'Kunde'}</span></td>
                  <td style={{ ...td, fontFamily: FM, fontSize: 12.5 }}>{m.paket ? (PLAN_LABEL[m.paket] || m.paket) : '-'}</td>
                  <td style={tdR}>{typeof m.lizenzen === 'number' ? m.lizenzen : '-'}</td>
                  <td style={{ ...tdR, fontWeight: 700, color: m.is_demo ? MUTE : INK }}>{fmtCHF(mrrMandant(m))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ fontSize: 12, color: MUTE, lineHeight: 1.6, fontFamily: FM }}>
        Rechenannahmen: Lizenz je Person und Monat (KLEIN {PLAN_PREIS_PRO_PERSON.klein}, MITTEL {PLAN_PREIS_PRO_PERSON.mittel}, GROSS {PLAN_PREIS_PRO_PERSON.gross}, KONZERN {PLAN_PREIS_PRO_PERSON.konzern}). Add-ons als feste Monatspauschale. Jahresrabatt {Math.round(JAHRESRABATT * 100)}% bei jaehrlicher Zahlung. Alle Betraege sind Vorschlagswerte und werden zentral in lib/billing/preise.ts gepflegt.
      </div>
    </div>
  )
}

export default function SupportPage() {
  const [token, setToken] = useState('')
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'alle' | 'kunden' | 'demo'>('alle')
  const [ansicht, setAnsicht] = useState<'mandanten' | 'umsatz'>('mandanten')
  const [setupRabatt, setSetupRabatt] = useState(SETUP_RABATT_STANDARD)

  // Detail-Panel (Kundenakte) + Bearbeiten
  const [sel, setSel] = useState<Mandant | null>(null)
  const [ePlan, setEPlan] = useState('klein')
  const [eSeats, setESeats] = useState('1')
  const [eAddons, setEAddons] = useState<string[]>([])
  const [eAngefragt, setEAngefragt] = useState<string[]>([])
  const [eStatus, setEStatus] = useState('pilot')
  const [eInterval, setEInterval] = useState('monatlich')
  const [eNotes, setENotes] = useState('')
  const [detail, setDetail] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [zUrl, setZUrl] = useState('')
  const [zBusy, setZBusy] = useState(false)
  const [zMsg, setZMsg] = useState('')

  // Integrationen
  const [integItems, setIntegItems] = useState<Record<string, any>>({})
  const [iStatus, setIStatus] = useState<Record<string, string>>({})
  const [iUrl, setIUrl] = useState<Record<string, string>>({})
  const [iShowNames, setIShowNames] = useState<Record<string, boolean>>({})
  const [integLoading, setIntegLoading] = useState(false)
  const [integError, setIntegError] = useState('')
  const [integSaving, setIntegSaving] = useState(false)
  const [integMsg, setIntegMsg] = useState('')
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [testMsg, setTestMsg] = useState<Record<string, string>>({})

  // Neuer Kunde anlegen
  const [neuOffen, setNeuOffen] = useState(false)
  const [nFirma, setNFirma] = useState('')
  const [nKontakt, setNKontakt] = useState('')
  const [nPlan, setNPlan] = useState('klein')
  const [nSeats, setNSeats] = useState('1')
  const [nInterval, setNInterval] = useState('monatlich')
  const [nAddons, setNAddons] = useState<string[]>([])
  const [nStatus, setNStatus] = useState('pilot')
  const [nAdminName, setNAdminName] = useState('')
  const [nAdminEmail, setNAdminEmail] = useState('')
  const [nEinladen, setNEinladen] = useState<'mail' | 'link' | 'kein'>('mail')
  const [nBusy, setNBusy] = useState(false)
  const [nMsg, setNMsg] = useState('')
  const [nLink, setNLink] = useState('')

  async function loadInteg(slug: string) {
    setIntegItems({}); setIStatus({}); setIUrl({}); setIShowNames({}); setIntegError(''); setIntegMsg(''); setTestMsg({})
    setIntegLoading(true)
    try {
      const res = await fetch('/api/admin-integrations?token=' + encodeURIComponent(token) + '&slug=' + encodeURIComponent(slug), { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok || !j.ok) { setIntegError(j.tabelle_fehlt ? 'Tabelle tenant_integrations fehlt noch (SQL ausfuehren).' : (j.error || 'Integrationen konnten nicht geladen werden.')); return }
      const it = j.items || {}
      setIntegItems(it)
      const st: Record<string, string> = {}, ur: Record<string, string> = {}, sn: Record<string, boolean> = {}
      for (const def of INTEGRATIONS) {
        st[def.key] = it[def.key]?.status || 'inaktiv'
        ur[def.key] = it[def.key]?.config?.webhook_url || ''
        sn[def.key] = !!it[def.key]?.config?.show_names
      }
      setIStatus(st); setIUrl(ur); setIShowNames(sn)
    } catch { setIntegError('Verbindung fehlgeschlagen.') }
    finally { setIntegLoading(false) }
  }

  async function saveInteg() {
    if (!sel) return
    setIntegSaving(true); setIntegMsg('')
    const items = INTEGRATIONS
      .filter(def => (iStatus[def.key] && iStatus[def.key] !== 'inaktiv') || integItems[def.key] || (iUrl[def.key] || '').trim())
      .map(def => ({ key: def.key, status: iStatus[def.key] || 'inaktiv', config: def.configFelder ? { webhook_url: (iUrl[def.key] || '').trim(), show_names: !!iShowNames[def.key] } : {} }))
    try {
      const res = await fetch('/api/admin-integrations?token=' + encodeURIComponent(token), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: sel.slug, mode: 'save', items }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) { setIntegMsg(j.error || ('Speichern fehlgeschlagen (Status ' + res.status + ').')); return }
      setIntegMsg('Gespeichert.')
      void loadInteg(sel.slug)
    } catch { setIntegMsg('Verbindung fehlgeschlagen.') }
    finally { setIntegSaving(false) }
  }

  async function testWebhook(key: string) {
    if (!sel) return
    const url = (iUrl[key] || '').trim()
    if (!/^https:\/\//i.test(url)) { setTestMsg(m => ({ ...m, [key]: 'Bitte zuerst eine gueltige https-URL eintragen.' })); return }
    setTesting(t => ({ ...t, [key]: true })); setTestMsg(m => ({ ...m, [key]: '' }))
    try {
      const res = await fetch('/api/admin-integrations?token=' + encodeURIComponent(token), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: sel.slug, mode: 'test', key, url, show_names: !!iShowNames[key] }),
      })
      const j = await res.json().catch(() => ({}))
      if (j.ok) setTestMsg(m => ({ ...m, [key]: 'Testnachricht gesendet. Bitte im Kanal pruefen.' }))
      else setTestMsg(m => ({ ...m, [key]: 'Fehlgeschlagen: ' + (j.result?.error || j.error || ('Status ' + res.status)) }))
    } catch { setTestMsg(m => ({ ...m, [key]: 'Verbindung fehlgeschlagen.' })) }
    finally { setTesting(t => ({ ...t, [key]: false })) }
  }

  async function openDetail(m: Mandant) {
    setSel(m)
    setEPlan(m.paket || 'klein')
    setESeats(String(typeof m.lizenzen === 'number' ? m.lizenzen : 1))
    setEAddons(Array.isArray(m.addons) ? m.addons : [])
    setEAngefragt([])
    setEStatus(m.konto_status || 'pilot')
    setEInterval(m.abrechnung || 'monatlich')
    setENotes(''); setSaveMsg(''); setZUrl(''); setZMsg('')
    setDetail(null); setDetailError(''); setDetailLoading(true)
    try {
      const res = await fetch('/api/admin-tenant?token=' + encodeURIComponent(token) + '&slug=' + encodeURIComponent(m.slug), { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok || !j.ok) { setDetailError(j.error || 'Details konnten nicht geladen werden.') }
      else {
        setDetail(j)
        if (j.billing) {
          setEPlan(j.billing.plan); setESeats(String(j.billing.seats)); setEAddons(j.billing.addons || [])
          setEAngefragt(j.billing.angefragt || [])
          setEStatus(j.billing.status); setEInterval(j.billing.billing_interval); setENotes(j.billing.notes || '')
        }
      }
    } catch { setDetailError('Verbindung fehlgeschlagen.') }
    finally { setDetailLoading(false) }
    void loadInteg(m.slug)
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

  async function zahlungslinkErstellen() {
    if (!sel) return
    setZBusy(true); setZMsg(''); setZUrl('')
    try {
      const res = await fetch('/api/stripe-checkout?token=' + encodeURIComponent(token), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: sel.slug }),
      })
      const j = await res.json().catch(() => ({}))
      if (j?.ok && j.url) setZUrl(j.url)
      else setZMsg(j?.error || 'Zahlungslink konnte nicht erstellt werden.')
    } catch { setZMsg('Verbindung fehlgeschlagen.') }
    finally { setZBusy(false) }
  }

  function neuZuruecksetzen() {
    setNFirma(''); setNKontakt(''); setNPlan('klein'); setNSeats('1'); setNInterval('monatlich')
    setNAddons([]); setNStatus('pilot'); setNAdminName(''); setNAdminEmail(''); setNEinladen('mail')
    setNBusy(false); setNMsg(''); setNLink('')
  }

  function nToggleAddon(a: string) {
    setNAddons(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  async function neukundeAnlegen() {
    if (!nFirma.trim()) { setNMsg('Bitte einen Firmennamen angeben.'); return }
    if (nEinladen !== 'kein' && !nAdminEmail.trim()) { setNMsg('Für eine Einladung wird die E-Mail des Administrators benötigt.'); return }
    const seatsNum = parseInt(nSeats, 10)
    if (!Number.isFinite(seatsNum) || seatsNum < 0) { setNMsg('Bitte eine gültige Lizenzzahl eingeben (0 oder mehr).'); return }
    setNBusy(true); setNMsg(''); setNLink('')
    try {
      const res = await fetch('/api/admin-create-tenant?token=' + encodeURIComponent(token), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firma: nFirma.trim(), kontakt_email: nKontakt.trim(), plan: nPlan, seats: seatsNum,
          billing_interval: nInterval, addons: nAddons, status: nStatus,
          admin_name: nAdminName.trim(), admin_email: nAdminEmail.trim(), einladen: nEinladen,
        }),
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok || !j.ok) { setNMsg(j?.error || ('Anlegen fehlgeschlagen (Status ' + res.status + ').')); return }
      await load(token)
      if (j.link) {
        setNLink(j.link)
        setNMsg('Kunde angelegt. Einladungslink unten zum Weitergeben.')
      } else if (j.hinweis) {
        setNMsg(j.hinweis)
      } else if (j.mail_versendet) {
        setNMsg('Kunde angelegt und Einladung an den Administrator versendet.')
      } else {
        setNMsg('Kunde angelegt.')
      }
    } catch { setNMsg('Verbindung fehlgeschlagen. Bitte erneut versuchen.') }
    finally { setNBusy(false) }
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
      if (!res.ok || !j.ok) { setError(j.error || 'Zugriff nicht möglich. Code pruefen.'); setData(null) }
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
          <p style={{ color: MUTE, textAlign: 'center', marginTop: 8, marginBottom: 24, fontSize: 14 }}>Interne Mandantenübersicht. Bitte Zugangscode eingeben.</p>
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
          >{loading ? 'Lädt ...' : 'Anzeigen'}</button>
        </div>
      </div>
    )
  }

  // ---- Übersicht ----
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

  const Ansicht = ({ id, text }: { id: 'mandanten' | 'umsatz'; text: string }) => (
    <button onClick={() => setAnsicht(id)}
      style={{ padding: '9px 20px', borderRadius: 999, border: '1px solid ' + (ansicht === id ? GREEN : LINE), background: ansicht === id ? GREEN : CARD, color: ansicht === id ? '#fff' : INK, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
      {text}
    </button>
  )

  return (
    <div style={{ minHeight: '100vh', background: CREAM }}>
      <div style={{ background: NAVY, color: '#fff', padding: '22px 24px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 3, color: GOLD, textTransform: 'uppercase' }}>Support</div>
            <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 700, lineHeight: 1.1 }}>Mandantenübersicht</div>
          </div>
          <button onClick={() => { setData(null); setToken('') }}
            style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Abmelden
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <Ansicht id="mandanten" text="Mandanten" />
          <Ansicht id="umsatz" text="Umsatz" />
          <button onClick={() => { neuZuruecksetzen(); setNeuOffen(true) }}
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Neuer Kunde
          </button>
        </div>

        {ansicht === 'umsatz' ? (
          <UmsatzPanel mandanten={data.mandanten} setupRabatt={setupRabatt} setSetupRabatt={setSetupRabatt} />
        ) : (
        <>
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <Tab id="alle" text={'Alle (' + data.global.mandanten + ')'} />
          <Tab id="kunden" text={'Kunden (' + data.global.kunden + ')'} />
          <Tab id="demo" text={'Demo (' + data.global.demo + ')'} />
        </div>

        {shown && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
            <Kachel label="Mandanten" value={shown.mandanten} sub={filter === 'alle' ? (data.global.kunden + ' Kunden, ' + data.global.demo + ' Demo') : undefined} />
            <Kachel label="Mitglieder" value={shown.mitglieder} />
            <Kachel label="Bestandene Prüfungen" value={shown.prüfungen_bestanden} />
            <Kachel label="Ausgestellte Nachweise" value={shown.nachweise} />
            <Kachel label="Bestnote" value={shown.bestnote ? shown.bestnote + '%' : '-'} />
          </div>
        )}

        {filter !== 'kunden' && (
          <p style={{ fontSize: 12.5, color: MUTE, margin: '4px 2px 18px', lineHeight: 1.5 }}>
            Hinweis: Demo-Konten sind Testdaten. Für öffentliches Marketing bitte nur die Ansicht Kunden verwenden.
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
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: FM, fontSize: 13 }}>{m.prüfungen_bestanden}</td>
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
        </>
        )}
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
                {([['Mitglieder', sel.mitglieder], ['Eigene Kurse', sel.kurse_eigen], ['Bestanden', sel.prüfungen_bestanden], ['Nachweise', sel.nachweise]] as [string, number][]).map(([l, v], i) => (
                  <div key={i} style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 12, padding: '14px 16px' }}>
                    <div style={{ fontFamily: FH, fontSize: 28, fontWeight: 700, color: NAVY, lineHeight: 1 }}>{v}</div>
                    <div style={{ fontSize: 12, color: MUTE, marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 6 }}>Profil und Kontakt</div>
              {detailLoading && <div style={{ fontSize: 13, color: MUTE, marginBottom: 18 }}>Lädt Details ...</div>}
              {detailError && <div style={{ fontSize: 13, color: '#b3261e', marginBottom: 18 }}>{detailError}</div>}
              {detail && detail.profil && (
                <div style={{ background: CARD, border: '1px solid ' + LINE, borderRadius: 12, padding: '14px 16px', marginBottom: 22, fontSize: 13.5, lineHeight: 1.8 }}>
                  {(([['Ansprechpartner', detail.profil.contact_name], ['E-Mail', detail.profil.contact_email], ['Telefon', detail.profil.contact_phone], ['Website', detail.profil.website], ['Rechtsname', detail.profil.legal_name], ['UID / HR', detail.profil.uid], ['Land', detail.profil.country], ['Grösse', detail.profil.company_size]]) as [string, string | null][])
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
              {eAngefragt.filter(a => !eAddons.includes(a)).length > 0 && (
                <div style={{ marginTop: 4, marginBottom: 4, padding: '9px 12px', borderRadius: 9, background: '#f8f1e4', border: '1px solid ' + GOLD, fontSize: 12.5, color: '#6f5a24', lineHeight: 1.5 }}>
                  Offene Anfrage des Kunden: {eAngefragt.filter(a => !eAddons.includes(a)).map(a => ADDON_LABEL[a] || a).join(', ')}. Zum Freigeben anklicken und unten speichern.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {ADDON_ORDER.map(a => {
                  const on = eAddons.includes(a)
                  const req = !on && eAngefragt.includes(a)
                  return (
                    <button key={a} onClick={() => toggleAddon(a)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, border: '1px solid ' + (on ? GREEN : req ? GOLD : LINE), background: on ? '#eef5f0' : req ? '#f8f1e4' : CARD, color: INK, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                      <span>{ADDON_LABEL[a] || a}{req ? <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#8a6d1f' }}>angefragt</span> : null}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: on ? GREEN : req ? '#8a6d1f' : MUTE }}>{on ? 'gebucht' : req ? 'freigeben?' : 'aus'}</span>
                    </button>
                  )
                })}
              </div>

              <label style={{ ...lblStyle, marginTop: 16 }}>Interne Notiz (nur für das Team)</label>
              <textarea className="kx-in" value={eNotes} onChange={e => setENotes(e.target.value)} rows={4}
                placeholder="Gespraechsnotizen, nächste Schritte, Vereinbarungen ..."
                style={{ ...inStyle, resize: 'vertical', minHeight: 92, lineHeight: 1.5 }} />
              {detail && detail.billing && detail.billing.updated_at && (
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 6, fontFamily: FM }}>Zuletzt bearbeitet: {new Date(detail.billing.updated_at).toLocaleString('de-CH')}</div>
              )}

              <button onClick={() => void saveDetail()} disabled={saving}
                style={{ width: '100%', marginTop: 22, padding: '13px 16px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Speichert ...' : 'Änderungen speichern'}
              </button>
              {saveMsg && <div style={{ marginTop: 10, fontSize: 13, color: saveMsg === 'Gespeichert.' ? GREEN : '#b3261e', textAlign: 'center' }}>{saveMsg}</div>}

              {/* ---- Zahlung ---- */}
              <div style={{ borderTop: '1px solid ' + LINE, marginTop: 28, paddingTop: 22 }}>
                <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 4 }}>Zahlung</div>
                <div style={{ fontSize: 12.5, color: MUTE, marginBottom: 14, lineHeight: 1.5 }}>Erzeugt einen sicheren Zahlungslink über Stripe für das gespeicherte Paket. Bitte zuerst speichern. Nach der Zahlung wird der Mandant automatisch auf aktiv gesetzt und die Rechnung an den Kunden gesendet.</div>
                {(() => {
                  const zr = rechnePaket({ paket: ePlan, lizenzen: parseInt(eSeats, 10) || 0, addons: eAddons, abrechnung: eInterval })
                  return (
                    <div style={{ border: '1px solid ' + LINE, borderRadius: 10, padding: '12px 14px', background: CARD, marginBottom: 12 }}>
                      <div style={{ fontSize: 13, color: INK }}>Rechnungsbetrag: <span style={{ fontWeight: 700, fontFamily: FM }}>CHF {zr.total.toLocaleString('de-CH')}</span> <span style={{ color: MUTE }}>pro {zr.interval === 'jaehrlich' ? 'Jahr' : 'Monat'}</span></div>
                      {zr.total <= 0 && <div style={{ fontSize: 12, color: '#b3261e', marginTop: 4 }}>Betrag ist 0. Bitte Paket, Lizenzen oder Add-ons einstellen.</div>}
                    </div>
                  )
                })()}
                <button onClick={() => void zahlungslinkErstellen()} disabled={zBusy}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid ' + GREEN, background: '#fff', color: GREEN, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: zBusy ? 0.7 : 1 }}>
                  {zBusy ? 'Erstellt ...' : 'Zahlungslink erstellen'}
                </button>
                {zMsg && <div style={{ marginTop: 10, fontSize: 13, color: '#b3261e', lineHeight: 1.5 }}>{zMsg}</div>}
                {zUrl && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12.5, color: MUTE, marginBottom: 6 }}>Diesen Link dem Kunden senden:</div>
                    <div style={{ padding: '10px 12px', background: '#f6f3ec', border: '1px solid ' + GOLD, borderRadius: 9, fontFamily: FM, fontSize: 11.5, color: INK, wordBreak: 'break-all', lineHeight: 1.5 }}>{zUrl}</div>
                    <button onClick={() => { try { navigator.clipboard.writeText(zUrl) } catch {} }}
                      style={{ marginTop: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid ' + LINE, background: '#fff', color: INK, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Link kopieren</button>
                  </div>
                )}
              </div>

              {/* ---- Integrationen ---- */}
              <div style={{ borderTop: '1px solid ' + LINE, marginTop: 28, paddingTop: 22 }}>
                <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 4 }}>Integrationen</div>
                <div style={{ fontSize: 12.5, color: MUTE, marginBottom: 14, lineHeight: 1.5 }}>Pro Kunde freischalten. "Aktiv" ist nur möglich, wo die Anbindung schon gebaut ist. Alles andere läuft in der App als "in Vorbereitung".</div>

                {integLoading && <div style={{ fontSize: 13, color: MUTE }}>Lädt Integrationen ...</div>}
                {integError && <div style={{ fontSize: 13, color: '#b3261e' }}>{integError}</div>}

                {!integLoading && !integError && INTEGRATION_KATEGORIEN.map(kat => {
                  const list = INTEGRATIONS.filter(d => d.kategorie === kat)
                  if (list.length === 0) return null
                  return (
                    <div key={kat} style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: INK, marginBottom: 8 }}>{kat}</div>
                      {list.map(def => {
                        const st = iStatus[def.key] || 'inaktiv'
                        const lr = integItems[def.key]?.last_result
                        return (
                          <div key={def.key} style={{ border: '1px solid ' + LINE, borderRadius: 10, padding: '11px 13px', marginBottom: 8, background: CARD }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{def.name}</div>
                                <div style={{ fontSize: 11, color: MUTE, fontFamily: FM, marginTop: 2 }}>{def.protokoll}{def.implementiert ? '' : ' · noch nicht verfügbar'}</div>
                              </div>
                              <select value={st} onChange={e => setIStatus(s => ({ ...s, [def.key]: e.target.value }))}
                                style={{ ...inStyle, width: 'auto', padding: '7px 9px', fontSize: 13, color: ISTATUS_FG[st], fontWeight: 600 }}>
                                {def.implementiert && <option value="aktiv">{ISTATUS_LABEL.aktiv}</option>}
                                <option value="vorbereitung">{ISTATUS_LABEL.vorbereitung}</option>
                                <option value="inaktiv">{ISTATUS_LABEL.inaktiv}</option>
                              </select>
                            </div>
                            {def.implementiert && def.configFelder && st === 'aktiv' && (
                              <div style={{ marginTop: 10 }}>
                                {def.configFelder.map(f => (
                                  <input key={f.key} value={iUrl[def.key] || ''} onChange={e => setIUrl(u => ({ ...u, [def.key]: e.target.value }))}
                                    placeholder={f.placeholder || f.label}
                                    style={{ ...inStyle, fontFamily: FM, fontSize: 12.5 }} />
                                ))}
                                <label style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 10, fontSize: 13, color: INK, cursor: 'pointer' }}>
                                  <input type="checkbox" checked={!!iShowNames[def.key]} onChange={e => setIShowNames(s => ({ ...s, [def.key]: e.target.checked }))} />
                                  <span>Klarnamen in Benachrichtigungen anzeigen</span>
                                </label>
                                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 4, lineHeight: 1.5 }}>{iShowNames[def.key] ? 'Meldungen enthalten den Namen, z.B. "Max Muster hat eine Prüfung bestanden."' : 'Datensparsam (empfohlen): ohne Namen, z.B. "Eine lernende Person hat eine Prüfung bestanden."'}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                                  <button onClick={() => void testWebhook(def.key)} disabled={!!testing[def.key]}
                                    style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid ' + GREEN, background: '#fff', color: GREEN, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                    {testing[def.key] ? 'Sendet ...' : 'Test senden'}
                                  </button>
                                  {testMsg[def.key] && <span style={{ fontSize: 12, color: testMsg[def.key].startsWith('Testnachricht') ? GREEN : '#b3261e' }}>{testMsg[def.key]}</span>}
                                </div>
                                {lr && (
                                  <div style={{ fontSize: 11, color: lr.ok ? GREEN : '#b3261e', fontFamily: FM, marginTop: 6 }}>
                                    Letzter Versand: {lr.ok ? 'erfolgreich' : ('Fehler ' + (lr.error || lr.status))} · {new Date(lr.gesendet_am).toLocaleString('de-CH')}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}

                {!integLoading && !integError && (
                  <>
                    <button onClick={() => void saveInteg()} disabled={integSaving}
                      style={{ width: '100%', marginTop: 6, padding: '12px 16px', borderRadius: 10, border: 'none', background: NAVY, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: integSaving ? 0.7 : 1 }}>
                      {integSaving ? 'Speichert ...' : 'Integrationen speichern'}
                    </button>
                    {integMsg && <div style={{ marginTop: 10, fontSize: 13, color: integMsg === 'Gespeichert.' ? GREEN : '#b3261e', textAlign: 'center' }}>{integMsg}</div>}
                  </>
                )}
              </div>

              <div style={{ fontSize: 11, color: MUTE, marginTop: 16, fontFamily: FM, lineHeight: 1.5 }}>
                {'Mandant: ' + sel.slug + (sel.is_demo ? ' · Demo-Konto (zählt nicht als Umsatz)' : '')}
              </div>
            </div>
          </div>
        </div>
      )}

      {neuOffen && (
        <div onClick={() => { if (!nBusy) setNeuOffen(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(11,25,41,0.45)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, height: '100%', background: CREAM, boxShadow: '-20px 0 50px rgba(0,0,0,0.25)', overflowY: 'auto' }}>
            <div style={{ background: NAVY, color: '#fff', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>Neuer Kunde</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Firma, Paket und ersten Administrator anlegen</div>
              </div>
              <button onClick={() => { if (!nBusy) setNeuOffen(false) }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>Schliessen</button>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', marginBottom: 6 }}>Firma</div>
              <label style={lblStyle}>Firmenname</label>
              <input value={nFirma} onChange={e => setNFirma(e.target.value)} placeholder="z. B. Muster Treuhand AG" style={inStyle} />
              <label style={{ ...lblStyle, marginTop: 14 }}>Kontakt-E-Mail (optional)</label>
              <input value={nKontakt} onChange={e => setNKontakt(e.target.value)} placeholder="kontakt@firma.ch" style={inStyle} />

              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', margin: '24px 0 6px' }}>Paket und Lizenzen</div>
              <label style={lblStyle}>Paket</label>
              <select value={nPlan} onChange={e => setNPlan(e.target.value)} style={inStyle}>
                <option value="klein">Klein</option>
                <option value="mittel">Mittel</option>
                <option value="gross">Gross</option>
                <option value="konzern">Konzern</option>
              </select>
              <label style={{ ...lblStyle, marginTop: 14 }}>Lizenzen (Personen)</label>
              <input type="number" min={0} value={nSeats} onChange={e => setNSeats(e.target.value)} style={inStyle} />
              <label style={{ ...lblStyle, marginTop: 14 }}>Abrechnung</label>
              <select value={nInterval} onChange={e => setNInterval(e.target.value)} style={inStyle}>
                <option value="monatlich">Monatlich</option>
                <option value="jaehrlich">Jährlich (10% Rabatt)</option>
              </select>
              <label style={{ ...lblStyle, marginTop: 14 }}>Status</label>
              <select value={nStatus} onChange={e => setNStatus(e.target.value)} style={inStyle}>
                <option value="pilot">Pilot</option>
                <option value="aktiv">Aktiv</option>
                <option value="gesperrt">Gesperrt</option>
              </select>

              <label style={{ ...lblStyle, marginTop: 16 }}>Add-ons</label>
              <div style={{ display: 'grid', gap: 8 }}>
                {ADDON_ORDER.map(a => {
                  const on = nAddons.includes(a)
                  return (
                    <button key={a} onClick={() => nToggleAddon(a)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, border: '1px solid ' + (on ? GREEN : LINE), background: on ? '#eef5f0' : CARD, color: INK, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                      <span>{ADDON_LABEL[a] || a}</span>
                      <span style={{ color: MUTE, fontSize: 12.5, fontFamily: FM }}>{(ADDON_PREIS[a] || 0)} CHF/Mt.</span>
                    </button>
                  )
                })}
              </div>

              {(() => {
                const zr = rechnePaket({ paket: nPlan, lizenzen: parseInt(nSeats, 10) || 0, addons: nAddons, abrechnung: nInterval })
                return (
                  <div style={{ border: '1px solid ' + LINE, borderRadius: 10, padding: '12px 14px', background: CARD, margin: '16px 0 0' }}>
                    <div style={{ fontSize: 13, color: INK }}>Rechnungsbetrag: <span style={{ fontWeight: 700, fontFamily: FM }}>CHF {zr.total.toLocaleString('de-CH')}</span> <span style={{ color: MUTE }}>pro {zr.interval === 'jaehrlich' ? 'Jahr' : 'Monat'}</span></div>
                  </div>
                )
              })()}

              <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: 1.5, color: GOLD, textTransform: 'uppercase', margin: '24px 0 6px' }}>Erster Administrator</div>
              <label style={lblStyle}>Name</label>
              <input value={nAdminName} onChange={e => setNAdminName(e.target.value)} placeholder="Vor- und Nachname" style={inStyle} />
              <label style={{ ...lblStyle, marginTop: 14 }}>E-Mail</label>
              <input value={nAdminEmail} onChange={e => setNAdminEmail(e.target.value)} placeholder="admin@firma.ch" style={inStyle} />
              <label style={{ ...lblStyle, marginTop: 14 }}>Einladung</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {([['mail', 'Per E-Mail'], ['link', 'Als Link'], ['kein', 'Ohne (später)']] as [typeof nEinladen, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setNEinladen(val)} style={{ flex: 1, minWidth: 110, padding: '10px 12px', borderRadius: 10, border: '1px solid ' + (nEinladen === val ? GREEN : LINE), background: nEinladen === val ? '#eef5f0' : CARD, color: INK, cursor: 'pointer', fontSize: 13.5, fontWeight: 600 }}>{label}</button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: MUTE, marginTop: 8, lineHeight: 1.5 }}>
                Per E-Mail sendet KALYX die gebrandete Einladung direkt. Als Link erzeugt einen Einladungslink zum selber Weitergeben. Ohne legt nur den Kunden an; den Administrator lädst du später über das Team ein.
              </div>

              <button onClick={() => void neukundeAnlegen()} disabled={nBusy}
                style={{ width: '100%', marginTop: 22, padding: '13px 16px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: nBusy ? 0.7 : 1 }}>
                {nBusy ? 'Legt an ...' : 'Kunden anlegen'}
              </button>
              {nMsg && <div style={{ marginTop: 12, fontSize: 13, color: nLink || nMsg.startsWith('Kunde angelegt') ? GREEN : '#b3261e', textAlign: 'center', lineHeight: 1.5 }}>{nMsg}</div>}
              {nLink && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12.5, color: MUTE, marginBottom: 6 }}>Einladungslink für den Administrator:</div>
                  <div style={{ padding: '10px 12px', background: '#f6f3ec', border: '1px solid ' + GOLD, borderRadius: 9, fontFamily: FM, fontSize: 11.5, color: INK, wordBreak: 'break-all', lineHeight: 1.5 }}>{nLink}</div>
                  <button onClick={() => { try { navigator.clipboard.writeText(nLink) } catch {} }}
                    style={{ marginTop: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid ' + LINE, background: '#fff', color: INK, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Link kopieren</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
