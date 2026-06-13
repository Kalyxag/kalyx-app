// Ziel-Pfad im Repo: app/erweiterungen/page.tsx  (NEU)
//
// Kundenbackend "Erweiterungen": zeigt alle Add-ons mit Status (aktiv,
// angefragt, anfragbar), Admins können anfragen. Die Freigabe macht der
// KALYX-Support. Ist White-Label freigegeben, erscheint hier die Branding-
// Maske (Logo, Markenname, Akzentfarbe). Ist es nicht aktiv, ist die Maske
// gesperrt und verweist auf die Anfrage. Keine neuen Tabellen.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'
import { ADDON_KATALOG } from '@/lib/billing/preise'
import { applyBrandTheme, normalizeHex, deriveBrand } from '@/lib/design/brand'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', GREEN_PALE='var(--kx-brand-pale,#E6F0EB)', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"
const fmtCHF=(n:number)=>'CHF '+Math.round(n).toLocaleString('de-CH')

export default function ErweiterungenPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [tid,setTid]=useState('')
  const [isAdmin,setIsAdmin]=useState(false)
  const [addons,setAddons]=useState<string[]>([])
  const [angefragt,setAngefragt]=useState<string[]>([])
  const [busy,setBusy]=useState('')
  // Branding-Maske
  const [brandName,setBrandName]=useState('')
  const [logoUrl,setLogoUrl]=useState('')
  const [accent,setAccent]=useState('#14613E')
  const [logoLight,setLogoLight]=useState('')
  const [favicon,setFavicon]=useState('')
  const [tagline,setTagline]=useState('')
  const [supportEmail,setSupportEmail]=useState('')
  const [brandMsg,setBrandMsg]=useState('')
  const [savingBrand,setSavingBrand]=useState(false)
  // KALYX REST-API: Schlüssel-Verwaltung
  type ApiKey={id:string;name:string;prefix:string;last4:string;created_at:string;last_used_at:string|null;revoked_at:string|null}
  const [keys,setKeys]=useState<ApiKey[]>([])
  const [keyName,setKeyName]=useState('')
  const [keyBusy,setKeyBusy]=useState('')
  const [keyMsg,setKeyMsg]=useState('')
  const [neuerKey,setNeuerKey]=useState<{name:string;key:string}|null>(null)

  async function apiKeys(action:string, extra:any={}){
    const {data:s}=await supabase.auth.getSession(); if(!s.session) return null
    const r=await fetch('/api/api-keys',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:s.session.access_token,action,...extra})})
    return r.json()
  }
  async function ladeKeys(){ const j=await apiKeys('liste'); if(j?.ok) setKeys(j.schluessel||[]) }
  async function erstelleKey(){
    if(!keyName.trim()){ setKeyMsg('Bitte zuerst einen Namen angeben.'); return }
    setKeyBusy('erstellen'); setKeyMsg(''); setNeuerKey(null)
    const j=await apiKeys('erstellen',{name:keyName.trim()})
    if(j?.ok){ setNeuerKey({name:j.name,key:j.key}); setKeyName(''); await ladeKeys() } else setKeyMsg(j?.error||'Anlegen nicht möglich.')
    setKeyBusy('')
  }
  async function widerrufeKey(id:string){
    if(!confirm('Diesen Schlüssel widerrufen? Anbindungen, die ihn nutzen, verlieren sofort den Zugriff.')) return
    setKeyBusy(id); setKeyMsg('')
    const j=await apiKeys('widerrufen',{key_id:id})
    if(!j?.ok) setKeyMsg(j?.error||'Widerruf nicht möglich.')
    await ladeKeys(); setKeyBusy('')
  }

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id,access_level').eq('id',session.user.id).maybeSingle()
    const t=(au as any)?.tenant_id; if(!t){router.replace('/anmelden');return}
    let ad:string[]=[], an:string[]=[]
    try{
      const r=await fetch('/api/addon-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:session.access_token,action:'status'})})
      const j=await r.json(); if(j?.ok){ad=j.addons||[];an=j.angefragt||[]}
    }catch{}
    const {data:br}=await supabase.from('branding').select('*').eq('tenant_id',t).maybeSingle()
    if(!on)return
    setTid(t); setIsAdmin((au as any)?.access_level==='admin')
    setAddons(ad); setAngefragt(an)
    const b:any=br||{}
    setBrandName(b.brand_name||b.name||''); setLogoUrl(b.logo_url||b.logo||''); setAccent(b.primary_color||b.accent_color||'#14613E')
    setLogoLight(b.logo_light_url||''); setFavicon(b.favicon_url||''); setTagline(b.tagline||''); setSupportEmail(b.support_email||'')
    if((au as any)?.access_level==='admin') ladeKeys()
    setLoading(false)
  })();return()=>{on=false}},[router])

  async function aktion(key:string,action:'anfragen'|'zurücknehmen'){
    setBusy(key)
    try{
      const {data}=await supabase.auth.getSession()
      const r=await fetch('/api/addon-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({access_token:data.session?.access_token,action,addon_key:key})})
      const j=await r.json(); if(j?.ok){setAddons(j.addons||[]);setAngefragt(j.angefragt||[])}
    }catch{}
    setBusy('')
  }

  async function saveBranding(){
    setSavingBrand(true); setBrandMsg('')
    try{
      // Farbe vor dem Speichern normalisieren (#RGB → #RRGGBB); ungültiges wird nicht gespeichert.
      const farbe = normalizeHex(accent)
      if(accent.trim() && !farbe){ setBrandMsg('Die Akzentfarbe muss ein Hex-Wert wie #14613E sein.'); setSavingBrand(false); return }
      const {error}=await supabase.from('branding').upsert({tenant_id:tid,brand_name:brandName.trim()||null,logo_url:logoUrl.trim()||null,primary_color:farbe,logo_light_url:logoLight.trim()||null,favicon_url:favicon.trim()||null,tagline:tagline.trim()||null,support_email:supportEmail.trim()||null,verify_show_kalyx:true},{onConflict:'tenant_id'})
      if(!error){
        // Sofort plattformweit anwenden — kein Neuladen nötig.
        applyBrandTheme(farbe)
        setBrandMsg('Gespeichert. Deine Akzentfarbe gilt ab sofort in der ganzen Plattform.')
      } else {
        setBrandMsg('Speichern nicht möglich. Sind die Branding-Felder in der Datenbank angelegt? '+error.message)
      }
    }catch(e:any){ setBrandMsg('Speichern nicht möglich: '+(e?.message||'Fehler')) }
    setSavingBrand(false)
  }

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:22,border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  // Live-Vorschau: gleiche Ableitung wie die Plattform (deriveBrand), Fallback CI-Grün.
  const vorschau = deriveBrand(normalizeHex(accent)||'#14613E')
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const wlAktiv=addons.includes('white_label')

  if(loading) return <AppShell active="erweiterungen"><div style={{color:GRAY,fontFamily:FB}}>Lade Erweiterungen …</div></AppShell>

  return(<AppShell active="erweiterungen">
    <div style={eyebrow}>Erweiterungen</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 6px'}}>Erweiterungen und Add-ons</h1>
    <p style={{fontFamily:FB,fontSize:14.5,color:GRAY,lineHeight:1.6,marginBottom:22,maxWidth:680}}>Buche zusätzliche Funktionen dazu. Du fragst eine Erweiterung an, KALYX gibt sie frei, danach ist sie sofort nutzbar. {isAdmin?'':'Anfragen können nur Administratoren stellen.'}</p>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:14,marginBottom:26}}>
      {ADDON_KATALOG.map(a=>{
        const aktiv=addons.includes(a.key)
        const offen=!aktiv&&angefragt.includes(a.key)
        const farbe=aktiv?GREEN:offen?GOLD:GRAY
        const badge=aktiv?'Aktiv':offen?'Angefragt':'Verfügbar'
        const bg=aktiv?GREEN_PALE:offen?GOLD_PALE:'#FBFAF7'
        return(
          <div key={a.key} style={{...card,padding:18,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <span style={{fontFamily:FB,fontSize:15.5,fontWeight:700,color:NAVY}}>{a.label}</span>
              <span style={{fontFamily:FM,fontSize:10.5,fontWeight:700,padding:'3px 9px',borderRadius:999,background:bg,color:farbe,whiteSpace:'nowrap'}}>{badge}</span>
            </div>
            <p style={{fontFamily:FB,fontSize:13,color:GRAY,lineHeight:1.55,flex:1,margin:0}}>{a.beschreibung}</p>
            <div style={{fontFamily:FM,fontSize:13,color:NAVY,fontWeight:600}}>{fmtCHF(a.preis)} <span style={{color:GRAY,fontWeight:400}}>/ Monat</span></div>
            {aktiv ? (
              <div style={{fontFamily:FB,fontSize:12.5,color:GREEN,fontWeight:600}}>Freigeschaltet</div>
            ) : offen ? (
              isAdmin
                ? <button disabled={busy===a.key} onClick={()=>aktion(a.key,'zurücknehmen')} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GRAY,background:'#fff',border:`1px solid ${LINE}`,borderRadius:9,padding:'8px 12px',cursor:'pointer'}}>{busy===a.key?'…':'Anfrage zurücknehmen'}</button>
                : <div style={{fontFamily:FB,fontSize:12.5,color:GOLD}}>Anfrage läuft</div>
            ) : (
              isAdmin
                ? <button disabled={busy===a.key} onClick={()=>aktion(a.key,'anfragen')} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:9,padding:'9px 12px',cursor:'pointer'}}>{busy===a.key?'…':'Anfragen'}</button>
                : <div style={{fontFamily:FB,fontSize:12.5,color:GRAY}}>Nur Admins können anfragen</div>
            )}
          </div>
        )
      })}
    </div>

    {/* White-Label-Bereich: Maske wenn aktiv, sonst gesperrt */}
    <div style={eyebrow}>White-Label</div>
    <h2 style={{fontFamily:FH,fontSize:24,fontWeight:600,color:NAVY,margin:'4px 0 14px'}}>Euer Branding</h2>
    {!wlAktiv ? (
      <div style={{...card,background:'#FBFAF7'}}>
        <p style={{fontFamily:FB,fontSize:14,color:GRAY,lineHeight:1.6,margin:0}}>Diese Funktion gehört zur Erweiterung White-Label und ist noch nicht freigeschaltet. {isAdmin?'Frage White-Label oben an, dann gibt KALYX sie frei und ihr könnt hier Logo, Markenname und Farbe setzen.':'Sobald ein Administrator White-Label anfragt und KALYX es freigibt, könnt ihr hier euer Branding setzen.'}</p>
      </div>
    ) : (
      <div style={{...card}}>
        <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,lineHeight:1.6,marginBottom:16}}>Setzt Logo, Markennamen und Akzentfarbe. Sie wirken plattformweit in der Seitenleiste — und auf euren Abschlussnachweisen und der öffentlichen Prüfseite. Eure Mitarbeitenden sehen eure Marke, KALYX bleibt nur als dezentes Echtheits-Siegel sichtbar (abschaltbar).</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',gap:16}}>
          <div>
            <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,marginBottom:6}}>Markenname</label>
            <input value={brandName} onChange={e=>setBrandName(e.target.value)} placeholder="z. B. Aurora Akademie" style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>
            <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,margin:'14px 0 6px'}}>Logo-Adresse (URL)</label>
            <input value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://euer-host.ch/logo.png" style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>
            <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,margin:'14px 0 6px'}}>Akzentfarbe</label>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(accent)?accent:'#14613E'} onChange={e=>setAccent(e.target.value)} style={{width:44,height:38,border:`1px solid ${LINE}`,borderRadius:8,background:'#fff',cursor:'pointer'}}/>
              <input value={accent} onChange={e=>setAccent(e.target.value)} style={{flex:1,fontFamily:FM,fontSize:13,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>
            </div>

            <div style={{borderTop:`1px solid ${LINE}`,margin:'18px 0 0',paddingTop:16}}>
              <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.16em',textTransform:'uppercase',color:GOLD,marginBottom:10}}>Auf Nachweisen und Prüfseite</div>

              <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,marginBottom:6}}>Helles Logo (für dunkle Flächen)</label>
              <input value={logoLight} onChange={e=>setLogoLight(e.target.value)} placeholder="https://euer-host.ch/logo-weiss.png" style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>
              <div style={{fontFamily:FB,fontSize:11.5,color:GRAY,marginTop:4}}>Optional. Das normale Logo (oben) erscheint auf hellem Grund, z. B. dem Zertifikat. Das helle Logo nutzt KALYX auf dunklen Flächen wie der Seitenleiste.</div>

              <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,margin:'14px 0 6px'}}>Tagline (optional)</label>
              <input value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="z. B. Wissen, das schützt." style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>

              <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,margin:'14px 0 6px'}}>Support-Kontakt für Nutzer (optional)</label>
              <input value={supportEmail} onChange={e=>setSupportEmail(e.target.value)} placeholder="support@eure-firma.ch" style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>

              <label style={{display:'block',fontFamily:FB,fontSize:13,fontWeight:600,color:NAVY,margin:'14px 0 6px'}}>Favicon (optional)</label>
              <input value={favicon} onChange={e=>setFavicon(e.target.value)} placeholder="https://euer-host.ch/favicon.png" style={{width:'100%',fontFamily:FB,fontSize:14,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'10px 13px',boxSizing:'border-box'}}/>

              <div style={{display:'flex',alignItems:'flex-start',gap:9,margin:'16px 0 0',padding:'12px 14px',background:CREAM,borderRadius:10,border:`1px solid ${LINE}`}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="1.8" style={{marginTop:2,flexShrink:0}}><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6c4 1 7 5 9 6z"/><path d="M12 12c0-5 5-8 9-6-4 1-7 5-9 6z"/></svg>
                <span style={{fontFamily:FB,fontSize:13,color:NAVY,lineHeight:1.5}}><b>KALYX-Echtheitssiegel</b><br/><span style={{color:GRAY,fontSize:12}}>Eure Nachweise tragen unten ein dezentes „Verifiziert über KALYX“. Das belegt gegenüber Dritten, dass der Nachweis fälschungssicher geprüft ist — der Grund, warum eure Nachweise mehr wert sind als ein PDF. Eure Marke bleibt vorn.</span></span>
              </div>
            </div>
          </div>
          <div>
            <div style={{fontFamily:FB,fontSize:12,fontWeight:600,color:GRAY,marginBottom:8}}>Vorschau Seitenleiste</div>
            <div style={{background:NAVY,borderRadius:12,padding:'18px 16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                {logoUrl
                  ? <img src={logoUrl} alt="Logo" style={{maxWidth:150,maxHeight:34,objectFit:'contain'}}/>
                  : <>
                      <div style={{width:30,height:30,borderRadius:9,background:/^#[0-9a-fA-F]{6}$/.test(accent)?accent:GREEN,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{fontFamily:FH,fontWeight:700,color:'#fff',fontSize:17}}>{(brandName||'KALYX').trim().charAt(0).toUpperCase()||'K'}</span>
                      </div>
                      <span style={{fontFamily:FB,fontWeight:700,fontSize:18,color:'#fff',letterSpacing:'.06em'}}>{brandName||'KALYX'}</span>
                    </>
                }
              </div>
              {/* Live-Vorschau: aktive Navigation in der Akzentfarbe */}
              <div style={{marginTop:14,display:'flex',flexDirection:'column',gap:4}}>
                <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:9,background:vorschau.activeBg,color:'#fff',fontFamily:FB,fontSize:13.5,fontWeight:600}}>Übersicht</div>
                <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:9,color:'rgba(255,255,255,.62)',fontFamily:FB,fontSize:13.5}}>Lernen</div>
              </div>
            </div>
            {/* Live-Vorschau: Button und Tönung im hellen Bereich */}
            <div style={{fontFamily:FB,fontSize:12,fontWeight:600,color:GRAY,margin:'14px 0 8px'}}>Vorschau Plattform</div>
            <div style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:12,padding:'14px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <span style={{fontFamily:FB,fontSize:13.5,fontWeight:600,color:vorschau.contrast,background:vorschau.brand,borderRadius:9,padding:'9px 14px'}}>Kurs starten</span>
              <span style={{fontFamily:FB,fontSize:12.5,fontWeight:600,color:vorschau.brand,background:vorschau.pale,borderRadius:999,padding:'5px 11px'}}>Pflichtschulung</span>
              <span style={{fontFamily:FB,fontSize:13,color:vorschau.brand,fontWeight:600,textDecoration:'underline'}}>Mehr erfahren</span>
            </div>

            <div style={{fontFamily:FB,fontSize:12,fontWeight:600,color:GRAY,margin:'14px 0 8px'}}>Vorschau Nachweis (so sehen es eure Mitarbeitenden)</div>
            <div style={{background:'#fff',border:`1px solid ${LINE}`,borderRadius:8,padding:'20px 22px',textAlign:'center',position:'relative'}}>
              <div style={{position:'absolute',inset:8,border:`1.5px solid ${GOLD}`,borderRadius:4,opacity:.4,pointerEvents:'none'}}/>
              <div style={{position:'relative'}}>
                {logoUrl
                  ? <img src={logoUrl} alt="" style={{maxHeight:30,maxWidth:150,objectFit:'contain',margin:'0 auto 4px',display:'block'}}/>
                  : <div style={{fontFamily:FH,fontWeight:700,fontSize:18,color:NAVY,letterSpacing:'.04em'}}>{brandName||'Eure Marke'}</div>}
                <div style={{fontFamily:FM,fontSize:8,letterSpacing:'.24em',color:GOLD,textTransform:'uppercase',marginTop:3}}>Abschlusszertifikat</div>
                <div style={{fontFamily:FH,fontSize:15,fontWeight:600,color:NAVY,margin:'10px 0 2px'}}>Maria Muster</div>
                <div style={{fontFamily:FH,fontSize:13,fontWeight:600,color:vorschau.brand}}>Datenschutz-Grundlagen</div>
                {(
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginTop:12,paddingTop:9,borderTop:`1px solid ${LINE}`}}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 3 6c4 1 7 5 9 6z"/><path d="M12 12c0-5 5-8 9-6-4 1-7 5-9 6z"/></svg>
                    <span style={{fontFamily:FM,fontSize:7.5,letterSpacing:'.12em',color:NAVY,textTransform:'uppercase'}}>Verifiziert über KALYX</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14,marginTop:18,flexWrap:'wrap'}}>
          <button disabled={savingBrand} onClick={saveBranding} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'11px 22px',cursor:'pointer'}}>{savingBrand?'Speichern …':'Branding speichern'}</button>
          {brandMsg && <span style={{fontFamily:FB,fontSize:12.5,color:brandMsg.startsWith('Gespeichert')?GREEN:'#9b2c2c',lineHeight:1.5}}>{brandMsg}</span>}
        </div>
      </div>
    )}

    {/* ---------- KALYX REST-API: Schlüssel-Verwaltung (nur Admins) ---------- */}
    <div style={{...card,marginTop:26}}>
      <div style={eyebrow}>KALYX REST-API</div>
      <h2 style={{fontFamily:FH,fontSize:24,fontWeight:600,color:NAVY,margin:'4px 0 6px'}}>API-Schlüssel</h2>
      <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,lineHeight:1.6,maxWidth:680,marginBottom:14}}>
        Mit einem API-Schlüssel könnt ihr eure Schulungsdaten (Nachweise, Abschlüsse, Abdeckung) lesend in eigene
        Systeme wie Power BI oder euer HR-Tool ziehen. Der Schlüssel wird genau einmal angezeigt und sieht
        ausschliesslich Daten eures Unternehmens. Erstellung und Widerruf werden revisionssicher protokolliert.
      </p>
      {!isAdmin ? (
        <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,margin:0}}>API-Schlüssel können nur Administratoren verwalten.</p>
      ) : (
        <>
          {neuerKey && (
            <div style={{background:'var(--kx-brand-pale,#E6F0EB)',border:`1px solid ${GREEN}`,borderRadius:10,padding:'14px 16px',marginBottom:14}}>
              <div style={{fontFamily:FB,fontSize:13.5,fontWeight:700,color:GREEN}}>Schlüssel «{neuerKey.name}» erstellt — jetzt kopieren!</div>
              <div style={{fontFamily:FM,fontSize:13,color:NAVY,margin:'8px 0',wordBreak:'break-all',userSelect:'all'}}>{neuerKey.key}</div>
              <div style={{fontFamily:FB,fontSize:12,color:GRAY}}>Aus Sicherheitsgründen wird er nie wieder angezeigt; gespeichert ist nur seine Prüfsumme. Verwendung: <span style={{fontFamily:FM}}>Authorization: Bearer …</span></div>
            </div>
          )}
          <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center',marginBottom:14}}>
            <input className="kx-input" value={keyName} onChange={e=>setKeyName(e.target.value)} placeholder="Name, z. B. Power BI" style={{fontFamily:FB,fontSize:13.5,border:`1px solid ${LINE}`,borderRadius:9,padding:'9px 12px',minWidth:220}}/>
            <button disabled={keyBusy!==''} onClick={erstelleKey} style={{fontFamily:FB,fontSize:13.5,fontWeight:600,border:'none',background:GREEN,color:'#fff',borderRadius:9,padding:'10px 16px',cursor:'pointer'}}>{keyBusy==='erstellen'?'Erstelle …':'Schlüssel erstellen'}</button>
            {keyMsg && <span style={{fontFamily:FB,fontSize:12.5,color:GRAY}}>{keyMsg}</span>}
          </div>
          {keys.length>0 && (
            <div style={{overflowX:'auto'}}>
              <table style={{borderCollapse:'collapse',width:'100%',minWidth:520}}>
                <thead><tr>
                  {['Name','Schlüssel','Erstellt','Zuletzt benutzt','Status',''].map((h,i)=>(
                    <th key={i} style={{textAlign:i>=4?'right':'left',padding:'8px 10px',fontFamily:FM,fontSize:10.5,letterSpacing:.4,textTransform:'uppercase',color:GRAY,borderBottom:`1px solid ${LINE}`}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {keys.map(k=>(
                    <tr key={k.id}>
                      <td style={{padding:'9px 10px',fontSize:13,color:NAVY,fontWeight:600,borderBottom:`1px solid #F5F4EF`}}>{k.name}</td>
                      <td style={{padding:'9px 10px',fontFamily:FM,fontSize:12,color:GRAY,borderBottom:`1px solid #F5F4EF`}}>{k.prefix}…{k.last4}</td>
                      <td style={{padding:'9px 10px',fontSize:12.5,color:GRAY,borderBottom:`1px solid #F5F4EF`,whiteSpace:'nowrap'}}>{(k.created_at||'').slice(0,10)}</td>
                      <td style={{padding:'9px 10px',fontSize:12.5,color:GRAY,borderBottom:`1px solid #F5F4EF`,whiteSpace:'nowrap'}}>{k.last_used_at?(k.last_used_at||'').slice(0,10):'—'}</td>
                      <td style={{padding:'9px 10px',textAlign:'right',fontFamily:FM,fontSize:11.5,fontWeight:700,color:k.revoked_at?'#9b2c2c':GREEN,borderBottom:`1px solid #F5F4EF`}}>{k.revoked_at?'widerrufen':'aktiv'}</td>
                      <td style={{padding:'9px 10px',textAlign:'right',borderBottom:`1px solid #F5F4EF`}}>
                        {!k.revoked_at && <button disabled={keyBusy!==''} onClick={()=>widerrufeKey(k.id)} style={{fontFamily:FB,fontSize:12.5,fontWeight:600,border:`1px solid #9b2c2c`,background:'#fff',color:'#9b2c2c',borderRadius:8,padding:'6px 11px',cursor:'pointer'}}>{keyBusy===k.id?'…':'Widerrufen'}</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  </AppShell>)
}
