// Ziel-Pfad im Repo: app/components/AppShell.tsx
//
// Echte App-Shell: navy Seitenleiste + heller Hauptbereich.
// Verlinkt die ECHTEN Seiten und zeigt echte Mandanten-/Nutzerdaten.
// Verwendung in einer Seite:  <AppShell active="übersicht"> ...Inhalt... </AppShell>
//
// Stand Code-Hygiene-Welle:
//  - Farbkonstanten kommen aus lib/design/tokens.ts (eine Wahrheit)
//  - injectCI() entfernt — Stile sind in globals.css, Schriften in app/layout.tsx
//  - LanguageSwitcher in der Topbar
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import LanguageSwitcher from './LanguageSwitcher'
import { NAVY, GREEN, GOLD, CREAM, LINE, GRAY, FH, FB, FM } from '@/lib/design/tokens'

const I = {
  receipt:'M5 3h14v18l-3-2-2 2-2-2-2 2-3-2zM8 8h8M8 12h8M8 16h5',
  home:'M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5',
  book:'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM19 3v16',
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  badge:'M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 20l-4.9 2.6.9-5.5-4-3.9 5.5-.8z',
  users:'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  spark:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18',
  plus:'M12 5v14M5 12h14',
  chart:'M3 3v18h18M8 17v-5M13 17V8M18 17v-8',
  box:'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 7L12 12l8.73-5M12 22V12',
}
function Ico({d}:{d:string}){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>}

const ROLE:Record<string,string>={admin:'Administrator',manager:'Manager',learner:'Lernende/r'}

const MAIN_NAV=[
  {key:'übersicht',label:'Übersicht',href:'/arbeitsbereich',icon:I.home},
  {key:'lernen',label:'Lernen',href:'/bibliothek',icon:I.book},
  {key:'skills',label:'Skills',href:'/skills',icon:I.grid},
  {key:'nachweise',label:'Nachweise',href:'/nachweise',icon:I.badge},
  {key:'team',label:'Team',href:'/team',icon:I.users},
]
const ADMIN_NAV=[
  {key:'berichte',label:'Berichte',href:'/berichte',icon:I.chart},
  {key:'rechnungen',label:'Rechnungen',href:'/rechnungen',icon:I.receipt},
  {key:'erweiterungen',label:'Erweiterungen',href:'/erweiterungen',icon:I.box},
  {key:'ki',label:'KI-Kursersteller',href:'/kursersteller',icon:I.spark},
]

export default function AppShell({active,children}:{active:string;children:ReactNode}){
  const router=useRouter()
  const [company,setCompany]=useState('')
  const [email,setEmail]=useState('')
  const [role,setRole]=useState('')
  const [today,setToday]=useState('')
  const [brandName,setBrandName]=useState('')
  const [logoUrl,setLogoUrl]=useState('')
  const [accent,setAccent]=useState('')

  useEffect(()=>{
    setToday(new Date().toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'}))
    let on=true
    ;(async()=>{
      const {data}=await supabase.auth.getSession()
      const session=data.session
      if(!session){router.replace('/anmelden');return}
      const {data:au}=await supabase.from('app_users').select('tenant_id,access_level').eq('id',session.user.id).maybeSingle()
      const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
      const {data:cp}=await supabase.from('company_profiles').select('display_name').eq('tenant_id',tid).maybeSingle()
      const {data:br}=await supabase.from('branding').select('*').eq('tenant_id',tid).maybeSingle()
      if(!on)return
      setEmail(session.user.email||''); setRole((au as any)?.access_level||'')
      setCompany((cp as any)?.display_name||'')
      const b:any=br||{}
      setBrandName(b.brand_name||b.name||''); setLogoUrl(b.logo_url||b.logo||''); setAccent(b.primary_color||b.accent_color||b.color||'')
    })()
    return()=>{on=false}
  },[router])

  async function logout(){await supabase.auth.signOut();router.replace('/anmelden')}
  const initials=(company||email||'K').trim().slice(0,2).toUpperCase()

  const sideLabel:React.CSSProperties={fontFamily:FM,fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',padding:'0 12px',margin:'14px 0 6px'}
  const soonTag=<span style={{marginLeft:'auto',fontFamily:FM,fontSize:9,letterSpacing:'.08em',color:GOLD,border:`1px solid rgba(184,144,74,.5)`,borderRadius:20,padding:'1px 7px'}}>bald</span>

  return(<div className="kx-shell">
    <aside className="kx-aside">
      {/* Logo (White-Label: Mandanten-Branding, sonst KALYX) */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 8px 16px'}}>
        {logoUrl ? (
          <img src={logoUrl} alt={brandName||'Logo'} style={{maxWidth:150,maxHeight:36,objectFit:'contain'}}/>
        ) : (<>
          <div style={{width:30,height:30,borderRadius:9,background:accent||GREEN,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <span style={{fontFamily:FH,fontWeight:700,color:'#fff',fontSize:17}}>{(brandName||'KALYX').trim().charAt(0).toUpperCase()||'K'}</span>
          </div>
          <span style={{fontFamily:FB,fontWeight:700,fontSize:18,color:'#fff',letterSpacing:'.06em'}}>{brandName||'KALYX'}</span>
        </>)}
      </div>
      {/* Mandant */}
      <div className="kx-only-wide">
        <div style={sideLabel}>Mandant</div>
        <div style={{padding:'0 12px 8px',fontFamily:FB,fontSize:14.5,fontWeight:600,color:'rgba(255,255,255,.92)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{company||'-'}</div>
      </div>
      {/* Hauptnavigation */}
      <nav className="kx-nav" style={{display:'flex',flexDirection:'column',gap:2,marginTop:6}}>
        {MAIN_NAV.map((n:any)=> n.soon
          ? <div key={n.key} className="kx-soon" title="kommt bald"><Ico d={n.icon}/>{n.label}{soonTag}</div>
          : <a key={n.key} href={n.href} className={active===n.key?'kx-active':''}><Ico d={n.icon}/>{n.label}</a>
        )}
      </nav>
      <div className="kx-only-wide"><div style={sideLabel}>Admin</div></div>
      <nav className="kx-nav" style={{display:'flex',flexDirection:'column',gap:2}}>
        {ADMIN_NAV.map(n=> (n as any).href
          ? <a key={n.key} href={(n as any).href} className={active===n.key?'kx-active':''}><Ico d={n.icon}/>{n.label}</a>
          : <div key={n.key} className="kx-soon" title="kommt bald"><Ico d={n.icon}/>{n.label}{soonTag}</div>)}
      </nav>
      {/* Nutzer */}
      <div className="kx-only-wide" style={{marginTop:'auto',display:'flex',alignItems:'center',gap:11,padding:'12px 8px 2px',borderTop:'1px solid rgba(255,255,255,.08)'}}>
        <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(127,212,168,.18)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FM,fontSize:12,flexShrink:0}}>{initials}</div>
        <div style={{minWidth:0}}>
          <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{email||'-'}</div>
          <div style={{fontFamily:FM,fontSize:10.5,color:'rgba(255,255,255,.45)'}}>{ROLE[role]||'Nutzer'}</div>
        </div>
      </div>
    </aside>

    <div className="kx-main">
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 28px',borderBottom:`1px solid ${LINE}`,background:CREAM}}>
        <div style={{fontFamily:FM,fontSize:13,color:GRAY,letterSpacing:'.02em'}}>{company||'KALYX'}{today?`  ·  ${today}`:''}</div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <LanguageSwitcher />
          <button className="kx-link" onClick={logout} style={{fontFamily:FB,fontSize:13.5,color:NAVY,background:'transparent',border:`1px solid ${LINE}`,borderRadius:9,padding:'7px 14px',cursor:'pointer'}}>Abmelden</button>
        </div>
      </div>
      {/* Inhalt */}
      <main style={{flex:1,padding:'30px 28px 56px'}}>
        <div style={{maxWidth:1040,margin:'0 auto'}}>{children}</div>
      </main>
    </div>
  </div>)
}
