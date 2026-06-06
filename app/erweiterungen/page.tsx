// Ziel-Pfad im Repo: app/erweiterungen/page.tsx  (NEU)
//
// Kundenbackend "Erweiterungen": zeigt alle Add-ons mit Status (aktiv,
// angefragt, anfragbar), Admins koennen anfragen. Die Freigabe macht der
// KALYX-Support. Ist White-Label freigegeben, erscheint hier die Branding-
// Maske (Logo, Markenname, Akzentfarbe). Ist es nicht aktiv, ist die Maske
// gesperrt und verweist auf die Anfrage. Keine neuen Tabellen.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'
import { ADDON_KATALOG } from '@/lib/billing/preise'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280'
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
  const [brandMsg,setBrandMsg]=useState('')
  const [savingBrand,setSavingBrand]=useState(false)

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
    setLoading(false)
  })();return()=>{on=false}},[router])

  async function aktion(key:string,action:'anfragen'|'zuruecknehmen'){
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
      const {error}=await supabase.from('branding').upsert({tenant_id:tid,brand_name:brandName.trim()||null,logo_url:logoUrl.trim()||null,primary_color:accent||null},{onConflict:'tenant_id'})
      setBrandMsg(error?('Speichern nicht moeglich. Sind die Branding-Felder in der Datenbank angelegt? '+error.message):'Gespeichert. Beim naechsten Laden erscheint dein Branding in der Seitenleiste.')
    }catch(e:any){ setBrandMsg('Speichern nicht moeglich: '+(e?.message||'Fehler')) }
    setSavingBrand(false)
  }

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:22,border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const wlAktiv=addons.includes('white_label')

  if(loading) return <AppShell active="erweiterungen"><div style={{color:GRAY,fontFamily:FB}}>Lade Erweiterungen …</div></AppShell>

  return(<AppShell active="erweiterungen">
    <div style={eyebrow}>Erweiterungen</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 6px'}}>Erweiterungen und Add-ons</h1>
    <p style={{fontFamily:FB,fontSize:14.5,color:GRAY,lineHeight:1.6,marginBottom:22,maxWidth:680}}>Buche zusaetzliche Funktionen dazu. Du fragst eine Erweiterung an, KALYX gibt sie frei, danach ist sie sofort nutzbar. {isAdmin?'':'Anfragen koennen nur Administratoren stellen.'}</p>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:14,marginBottom:26}}>
      {ADDON_KATALOG.map(a=>{
        const aktiv=addons.includes(a.key)
        const offen=!aktiv&&angefragt.includes(a.key)
        const farbe=aktiv?GREEN:offen?GOLD:GRAY
        const badge=aktiv?'Aktiv':offen?'Angefragt':'Verfuegbar'
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
                ? <button disabled={busy===a.key} onClick={()=>aktion(a.key,'zuruecknehmen')} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GRAY,background:'#fff',border:`1px solid ${LINE}`,borderRadius:9,padding:'8px 12px',cursor:'pointer'}}>{busy===a.key?'…':'Anfrage zuruecknehmen'}</button>
                : <div style={{fontFamily:FB,fontSize:12.5,color:GOLD}}>Anfrage laeuft</div>
            ) : (
              isAdmin
                ? <button disabled={busy===a.key} onClick={()=>aktion(a.key,'anfragen')} style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:9,padding:'9px 12px',cursor:'pointer'}}>{busy===a.key?'…':'Anfragen'}</button>
                : <div style={{fontFamily:FB,fontSize:12.5,color:GRAY}}>Nur Admins koennen anfragen</div>
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
        <p style={{fontFamily:FB,fontSize:14,color:GRAY,lineHeight:1.6,margin:0}}>Diese Funktion gehoert zur Erweiterung White-Label und ist noch nicht freigeschaltet. {isAdmin?'Frage White-Label oben an, dann gibt KALYX sie frei und ihr koennt hier Logo, Markenname und Farbe setzen.':'Sobald ein Administrator White-Label anfragt und KALYX es freigibt, koennt ihr hier euer Branding setzen.'}</p>
      </div>
    ) : (
      <div style={{...card}}>
        <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,lineHeight:1.6,marginBottom:16}}>Setze Logo, Markennamen und Akzentfarbe. Sie erscheinen in der Seitenleiste der Plattform. Ist kein Logo gesetzt, wird der Markenname mit der Akzentfarbe gezeigt.</p>
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
            </div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14,marginTop:18,flexWrap:'wrap'}}>
          <button disabled={savingBrand} onClick={saveBranding} style={{fontFamily:FB,fontSize:14,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'11px 22px',cursor:'pointer'}}>{savingBrand?'Speichern …':'Branding speichern'}</button>
          {brandMsg && <span style={{fontFamily:FB,fontSize:12.5,color:brandMsg.startsWith('Gespeichert')?GREEN:'#9b2c2c',lineHeight:1.5}}>{brandMsg}</span>}
        </div>
      </div>
    )}
  </AppShell>)
}
