// Ziel-Pfad im Repo: app/components/AppShell.tsx
//
// Echte App-Shell: navy Seitenleiste + heller Hauptbereich.
// Verlinkt die ECHTEN Seiten und zeigt echte Mandanten-/Nutzerdaten.
// Verwendung in einer Seite:  <AppShell active="übersicht"> ...Inhalt... </AppShell>
//
// Mobile-Welle:
//  - Auf < 860px: kompakter Top-Header mit Burger-Button + Logo + Abmelden
//  - Klick auf Burger öffnet ein Slide-In-Drawer von links mit voller Navigation
//  - Backdrop-Click, Escape-Taste oder Nav-Klick schliesst den Drawer
//  - Body-Scroll wird gesperrt solange das Drawer offen ist
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
  burger:'M3 6h18M3 12h18M3 18h18',
  close:'M6 6l12 12M18 6L6 18',
  logout:'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
}
function Ico({d,size=18}:{d:string;size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>}

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
  const [mobileOpen,setMobileOpen]=useState(false)

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

  // Body-Scroll sperren, wenn das mobile Drawer offen ist
  useEffect(()=>{
    if(typeof document==='undefined') return
    if(mobileOpen){ document.body.style.overflow='hidden' } else { document.body.style.overflow='' }
    return ()=>{ document.body.style.overflow='' }
  },[mobileOpen])

  // Escape-Taste schliesst das Drawer
  useEffect(()=>{
    if(!mobileOpen) return
    const onKey=(e:KeyboardEvent)=>{ if(e.key==='Escape') setMobileOpen(false) }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  },[mobileOpen])

  async function logout(){await supabase.auth.signOut();router.replace('/anmelden')}
  const initials=(company||email||'K').trim().slice(0,2).toUpperCase()

  const sideLabel:React.CSSProperties={fontFamily:FM,fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',padding:'0 12px',margin:'14px 0 6px'}
  const soonTag=<span style={{marginLeft:'auto',fontFamily:FM,fontSize:9,letterSpacing:'.08em',color:GOLD,border:`1px solid rgba(184,144,74,.5)`,borderRadius:20,padding:'1px 7px'}}>bald</span>

  // Brand-Block für Header & Drawer wiederverwendet
  const BrandBlock = (
    logoUrl ? (
      <img src={logoUrl} alt={brandName||'Logo'} style={{maxWidth:140,maxHeight:34,objectFit:'contain'}}/>
    ) : (<>
      <div style={{width:30,height:30,borderRadius:9,background:accent||GREEN,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
        <span style={{fontFamily:FH,fontWeight:700,color:'#fff',fontSize:17}}>{(brandName||'KALYX').trim().charAt(0).toUpperCase()||'K'}</span>
      </div>
      <span style={{fontFamily:FB,fontWeight:700,fontSize:17,color:'#fff',letterSpacing:'.06em'}}>{brandName||'KALYX'}</span>
    </>)
  )

  // Navigation: einmal definiert, in Desktop-Sidebar UND Mobile-Drawer verwendet
  // onLinkClick schliesst das Drawer beim Klick auf einen Nav-Eintrag (Mobile)
  const NavBlocks = ({onLinkClick}:{onLinkClick?:()=>void}) => (<>
    <div className="kx-only-wide">
      <div style={sideLabel}>Mandant</div>
      <div style={{padding:'0 12px 8px',fontFamily:FB,fontSize:14.5,fontWeight:600,color:'rgba(255,255,255,.92)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{company||'–'}</div>
    </div>
    <nav className="kx-nav" style={{display:'flex',flexDirection:'column',gap:2,marginTop:6}}>
      {MAIN_NAV.map((n:any)=> n.soon
        ? <div key={n.key} className="kx-soon" title="kommt bald"><Ico d={n.icon}/>{n.label}{soonTag}</div>
        : <a key={n.key} href={n.href} onClick={onLinkClick} className={active===n.key?'kx-active':''}><Ico d={n.icon}/>{n.label}</a>
      )}
    </nav>
    <div><div style={sideLabel}>Admin</div></div>
    <nav className="kx-nav" style={{display:'flex',flexDirection:'column',gap:2}}>
      {ADMIN_NAV.map(n=> (n as any).href
        ? <a key={n.key} href={(n as any).href} onClick={onLinkClick} className={active===n.key?'kx-active':''}><Ico d={n.icon}/>{n.label}</a>
        : <div key={n.key} className="kx-soon" title="kommt bald"><Ico d={n.icon}/>{n.label}{soonTag}</div>)}
    </nav>
  </>)

  // Nutzer-Block (im Drawer auch ohne kx-only-wide, im Desktop mit)
  const UserBlock = ({hideOnNarrow=true}:{hideOnNarrow?:boolean}) => (
    <div className={hideOnNarrow?'kx-only-wide':''} style={{marginTop:'auto',display:'flex',alignItems:'center',gap:11,padding:'12px 8px 2px',borderTop:'1px solid rgba(255,255,255,.08)'}}>
      <div style={{width:34,height:34,borderRadius:'50%',background:'rgba(127,212,168,.18)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FM,fontSize:12,flexShrink:0}}>{initials}</div>
      <div style={{minWidth:0,flex:1}}>
        <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{email||'–'}</div>
        <div style={{fontFamily:FM,fontSize:10.5,color:'rgba(255,255,255,.45)'}}>{ROLE[role]||'Nutzer'}</div>
      </div>
    </div>
  )

  return(<div className="kx-shell">
    {/* ============ DESKTOP-SIDEBAR (versteckt auf Mobile) ============ */}
    <aside className="kx-aside kx-aside-desktop">
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 8px 16px'}}>{BrandBlock}</div>
      <NavBlocks />
      <UserBlock />
    </aside>

    {/* ============ MOBILE-HEADER (sichtbar nur auf Mobile) ============ */}
    <header className="kx-mobile-header" aria-hidden={false}>
      <button
        className="kx-burger"
        aria-label="Menü öffnen"
        aria-expanded={mobileOpen}
        onClick={()=>setMobileOpen(true)}
      ><Ico d={I.burger} size={22}/></button>
      <div style={{display:'flex',alignItems:'center',gap:9,minWidth:0,flex:1}}>{BrandBlock}</div>
      <button
        className="kx-iconbtn"
        aria-label="Abmelden"
        onClick={logout}
      ><Ico d={I.logout} size={19}/></button>
    </header>

    {/* ============ MOBILE-DRAWER ============ */}
    {mobileOpen && (
      <>
        <div className="kx-backdrop" onClick={()=>setMobileOpen(false)} aria-hidden="true"/>
        <aside className="kx-aside kx-aside-drawer" role="dialog" aria-modal="true" aria-label="Hauptnavigation">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 8px 16px',gap:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0,flex:1}}>{BrandBlock}</div>
            <button
              className="kx-iconbtn"
              aria-label="Menü schliessen"
              onClick={()=>setMobileOpen(false)}
              style={{color:'#fff'}}
            ><Ico d={I.close} size={22}/></button>
          </div>
          <NavBlocks onLinkClick={()=>setMobileOpen(false)}/>
          <UserBlock hideOnNarrow={false}/>
        </aside>
      </>
    )}

    {/* ============ HAUPTBEREICH ============ */}
    <div className="kx-main">
      <div className="kx-topbar">
        <div style={{fontFamily:FM,fontSize:13,color:GRAY,letterSpacing:'.02em',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{company||'KALYX'}{today?`  ·  ${today}`:''}</div>
        <div style={{display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
          <LanguageSwitcher />
          <button className="kx-link kx-logout-desktop" onClick={logout} style={{fontFamily:FB,fontSize:13.5,color:NAVY,background:'transparent',border:`1px solid ${LINE}`,borderRadius:9,padding:'7px 14px',cursor:'pointer'}}>Abmelden</button>
        </div>
      </div>
      <main className="kx-content">
        <div style={{maxWidth:1040,margin:'0 auto'}}>{children}</div>
      </main>
    </div>
  </div>)
}
