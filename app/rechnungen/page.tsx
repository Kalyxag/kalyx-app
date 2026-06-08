// Ziel-Pfad im Repo: app/rechnungen/page.tsx  (NEU)
//
// Rechnungen im Kundenkonto. Nur fuer Administratoren des Mandanten.
// - Liste der eingegangenen Zahlungen (Datum, Zeitraum, Betrag, Status)
// - je Zahlung eine druckbare Rechnung im KALYX-Design, als PDF speicherbar
//   ueber die Druckansicht (gleiches Muster wie der Audit-Report, kein neues Paket)
// Daten kommen von /api/meine-rechnungen.
//
// Ehrliche Linie: Der Beleg traegt im Pilot- und Sandbox-Betrieb den Hinweis,
// dass er kein gueltiger Zahlungsbeleg ist. Die rechtlichen Absenderdaten von
// KALYX sind als Platzhalter hinterlegt und werden mit der Firmenanmeldung
// gefuellt. Prozess und Anbindung stehen, spaeter wird nur der Inhalt getauscht.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const NAVY = '#0B1929', GREEN = '#14613E', GOLD = '#B8904A', LINE = '#E4E0D8', GRAY = '#6B7280', INK = '#1F2A37', MUTE = '#9AA1A9'
const FH = "'Cormorant', Georgia, serif"
const FB = "'Albert Sans', system-ui, -apple-system, sans-serif"
const FM = "'IBM Plex Mono', ui-monospace, monospace"

type Posten = { label: string; betrag: number }
type Zahlung = { id: string; created_at: string; amount_rappen: number | null; currency: string; interval: string; status: string; stripe_session_id: string | null; email: string | null }
type Empfaenger = { name: string; uid: string | null; land: string | null; kontakt_name: string | null; kontakt_email: string | null }
type Data = { ok: boolean; is_demo: boolean; empfaenger: Empfaenger; paket: string | null; lizenzen: number; positionen: Posten[]; zahlungen: Zahlung[] }

function injectPrint() {
  if (typeof document === 'undefined') return
  if (document.getElementById('kx-rechnung-print-style')) return
  const s = document.createElement('style'); s.id = 'kx-rechnung-print-style'
  s.textContent = '@media print{body *{visibility:hidden!important}#rechnung-print,#rechnung-print *{visibility:visible!important}'
    + '#rechnung-print{position:absolute;left:0;top:0;width:100%;padding:0;margin:0}.kx-noprint{display:none!important}'
    + '@page{margin:18mm}}'
  document.head.appendChild(s)
}

function fmtCHF(rappen: number | null): string {
  const chf = (typeof rappen === 'number' ? rappen : 0) / 100
  return 'CHF ' + chf.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function datum(iso: string): string {
  try { return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return iso }
}
function zeitraum(iso: string, interval: string): string {
  try {
    const start = new Date(iso)
    const end = new Date(start)
    end.setMonth(end.getMonth() + (interval === 'jaehrlich' ? 12 : 1))
    end.setDate(end.getDate() - 1)
    return datum(start.toISOString()) + ' bis ' + datum(end.toISOString())
  } catch { return datum(iso) }
}
function istSandbox(z: Zahlung, isDemo: boolean): boolean {
  return isDemo || String(z.stripe_session_id || '').startsWith('cs_test_')
}

export default function RechnungenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [denied, setDenied] = useState(false)
  const [d, setD] = useState<Data | null>(null)
  const [sel, setSel] = useState<Zahlung | null>(null)

  useEffect(() => {
    injectPrint(); let on = true
    ;(async () => {
      const { data } = await supabase.auth.getSession(); const session = data.session
      if (!session) { router.replace('/anmelden'); return }
      try {
        const r = await fetch('/api/meine-rechnungen', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ access_token: session.access_token }) })
        const j = await r.json()
        if (!on) return
        if (!j?.ok) { setDenied(true); setLoading(false); return }
        setD(j); setLoading(false)
      } catch { if (on) { setDenied(true); setLoading(false) } }
    })()
    return () => { on = false }
  }, [router])

  const card: React.CSSProperties = { background: '#fff', borderRadius: 16, padding: 24, border: `1px solid ${LINE}`, boxShadow: '0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)', marginBottom: 16 }
  const eyebrow: React.CSSProperties = { fontFamily: FM, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD }
  const btn: React.CSSProperties = { fontFamily: FB, fontSize: 13.5, fontWeight: 600, border: `1px solid ${GREEN}`, background: '#fff', color: GREEN, borderRadius: 9, padding: '9px 16px', cursor: 'pointer' }
  const btnP: React.CSSProperties = { ...btn, background: GREEN, color: '#fff' }
  const th: React.CSSProperties = { fontFamily: FM, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', color: MUTE, textAlign: 'left', padding: '10px 8px', borderBottom: `1px solid ${LINE}` }
  const td: React.CSSProperties = { fontFamily: FB, fontSize: 14, color: INK, padding: '12px 8px', borderBottom: `1px solid ${LINE}` }

  if (loading) return <AppShell active="rechnungen"><div style={{ color: GRAY, fontFamily: FB }}>Lade Rechnungen …</div></AppShell>

  if (denied) return <AppShell active="rechnungen">
    <div style={eyebrow}>Rechnungen</div>
    <h1 style={{ fontFamily: FH, fontSize: 32, fontWeight: 600, color: NAVY, margin: '4px 0 14px' }}>Rechnungen</h1>
    <div style={card}><p style={{ fontFamily: FB, fontSize: 15, color: GRAY, lineHeight: 1.6, margin: 0 }}>Dieser Bereich ist Administratoren des Mandanten vorbehalten. Melde dich mit einem Administratorkonto an, um die Rechnungen zu sehen.</p></div>
  </AppShell>

  const zahlungen = d?.zahlungen || []

  return <AppShell active="rechnungen">
    <div className="kx-noprint">
      <div style={eyebrow}>Rechnungen</div>
      <h1 style={{ fontFamily: FH, fontSize: 32, fontWeight: 600, color: NAVY, margin: '4px 0 6px' }}>Rechnungen</h1>
      <p style={{ fontFamily: FB, fontSize: 13.5, color: GRAY, lineHeight: 1.6, margin: '0 0 18px', maxWidth: 680 }}>
        Hier siehst du die eingegangenen Zahlungen und kannst je Zahlung eine Rechnung als PDF speichern. Im Pilot- und Testbetrieb ist der Beleg als Demo gekennzeichnet. Fragen zur Rechnung oder Abrechnung? <a href="mailto:fabian.kreher@kalyx.ag" style={{ color: GREEN, fontWeight: 600, textDecoration: 'none' }}>fabian.kreher@kalyx.ag</a>
      </p>

      <div style={card}>
        {zahlungen.length === 0 ? (
          <p style={{ fontFamily: FB, fontSize: 15, color: GRAY, lineHeight: 1.6, margin: 0 }}>Es sind noch keine Zahlungen eingegangen. Sobald eine Zahlung verbucht ist, erscheint sie hier mit der zugehoerigen Rechnung.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>
              <th style={th}>Datum</th><th style={th}>Zeitraum</th><th style={{ ...th, textAlign: 'right' }}>Betrag</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}>Rechnung</th>
            </tr></thead>
            <tbody>
              {zahlungen.map(z => (
                <tr key={z.id}>
                  <td style={td}>{datum(z.created_at)}</td>
                  <td style={{ ...td, color: GRAY, fontSize: 13 }}>{zeitraum(z.created_at, z.interval)}</td>
                  <td style={{ ...td, textAlign: 'right', fontFamily: FM }}>{fmtCHF(z.amount_rappen)}</td>
                  <td style={td}><span style={{ fontFamily: FM, fontSize: 11, color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 20, padding: '2px 10px' }}>{(z.status || 'bezahlt')}</span></td>
                  <td style={{ ...td, textAlign: 'right' }}><button style={btn} onClick={() => setSel(z)}>Rechnung oeffnen</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>

    {sel && d && (
      <>
        <div className="kx-noprint" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBottom: 12 }}>
          <button style={btn} onClick={() => setSel(null)}>Schliessen</button>
          <button style={btnP} onClick={() => window.print()}>Als PDF speichern</button>
        </div>

        <div id="rechnung-print" style={card}>
          {istSandbox(sel, d.is_demo) && (
            <div style={{ background: '#FAEEDA', color: '#854F0B', border: `1px solid ${GOLD}`, borderRadius: 10, padding: '10px 14px', fontFamily: FB, fontSize: 13, lineHeight: 1.5, marginBottom: 22 }}>
              Demo und Sandbox. Kein gueltiger Zahlungsbeleg. Echte Rechnungen entstehen erst im Live-Betrieb.
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 26 }}>
            <div>
              <div style={{ fontFamily: FB, fontWeight: 700, fontSize: 22, color: NAVY, letterSpacing: '.06em' }}>KALYX</div>
              <div style={{ fontFamily: FB, fontSize: 12, color: MUTE, lineHeight: 1.7, marginTop: 6 }}>
                [KALYX Rechtsname]<br />[Strasse Nr.]<br />[PLZ Ort], [Land]<br />[MWST-Nr. falls vorhanden]
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: FH, fontSize: 24, fontWeight: 600, color: NAVY }}>Rechnung</div>
              <div style={{ fontFamily: FB, fontSize: 12.5, color: GRAY, lineHeight: 1.9, marginTop: 4 }}>
                Nr. <span style={{ color: MUTE }}>(Entwurf)</span><br />
                Datum {datum(sel.created_at)}<br />
                Zeitraum {zeitraum(sel.created_at, sel.interval)}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14, marginBottom: 22 }}>
            <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', color: MUTE, marginBottom: 4 }}>Rechnung an</div>
            <div style={{ fontFamily: FB, fontSize: 15, fontWeight: 600, color: INK }}>{d.empfaenger.name}</div>
            <div style={{ fontFamily: FB, fontSize: 12.5, color: GRAY, lineHeight: 1.7, marginTop: 2 }}>
              {d.empfaenger.uid ? 'UID ' + d.empfaenger.uid : ''}{d.empfaenger.uid && d.empfaenger.land ? ' · ' : ''}{d.empfaenger.land ? 'Land ' + d.empfaenger.land : ''}
              {d.empfaenger.kontakt_email ? <><br />{d.empfaenger.kontakt_email}</> : null}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FB, fontSize: 13.5 }}>
            <thead><tr style={{ color: MUTE, fontSize: 12 }}>
              <td style={{ padding: '7px 0', borderBottom: `1px solid ${LINE}` }}>Position</td>
              <td style={{ padding: '7px 0', borderBottom: `1px solid ${LINE}`, textAlign: 'right' }}>Betrag</td>
            </tr></thead>
            <tbody>
              {d.positionen.length === 0 ? (
                <tr><td style={{ padding: '10px 0', color: GRAY }}>Lizenzen und Add-ons gemaess gebuchtem Paket</td><td style={{ padding: '10px 0', textAlign: 'right' }}>{fmtCHF(sel.amount_rappen)}</td></tr>
              ) : d.positionen.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding: '9px 0', color: INK }}>{p.label}</td>
                  <td style={{ padding: '9px 0', textAlign: 'right' }}>{p.betrag.toLocaleString('de-CH')}.00</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 14, marginLeft: 'auto', width: 280, fontFamily: FB, fontSize: 13.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: MUTE }}>
              <span>Mehrwertsteuer</span><span>[offen, je nach MWST-Status]</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: `1px solid ${LINE}`, fontSize: 16, fontWeight: 700, color: NAVY }}>
              <span>Total bezahlt</span><span style={{ fontFamily: FM }}>{fmtCHF(sel.amount_rappen)}</span>
            </div>
          </div>

          <div style={{ marginTop: 22, background: '#EAF3DE', color: '#27500A', borderRadius: 10, padding: '9px 13px', fontFamily: FB, fontSize: 12.5 }}>
            Bezahlt am {datum(sel.created_at)} ueber Stripe{sel.stripe_session_id ? ' · Sitzung ' + sel.stripe_session_id : ''}
          </div>

          <div style={{ marginTop: 22, borderTop: `1px solid ${LINE}`, paddingTop: 12, fontFamily: FB, fontSize: 11.5, color: MUTE, lineHeight: 1.7 }}>
            Erstellt durch KALYX. Dieser Beleg dokumentiert eine Zahlung im Pilot- und Testbetrieb. Fragen zur Rechnung: fabian.kreher@kalyx.ag
          </div>
        </div>
      </>
    )}
  </AppShell>
}
