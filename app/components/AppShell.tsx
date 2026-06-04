// Ziel-Pfad im Repo: components/AppShell.tsx  (NEU)
//
// Echte App-Shell: navy Seitenleiste (wie das Demo) + heller Hauptbereich.
// Verlinkt die ECHTEN Seiten und zeigt echte Mandanten-/Nutzerdaten.
// Verwendung in einer Seite:  <AppShell active="uebersicht"> ...Inhalt... </AppShell>
'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A'
const GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

function injectCI(){
  if(typeof document==='undefined')return
  if(!document.getElementById('kalyx-fonts')){const l=document.createElement('link');l.id='kalyx-fonts';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap';document.head.appendChild(l)}
  if(!document.getElementById('kalyx-ui')){const s=document.createElement('style');s.id='kalyx-ui';s.textContent=`
    *{box-sizing:border-box}
    .kx-input{transition:border-color .15s ease,box-shadow .15s ease}
    .kx-input:focus{border-color:${GREEN};box-shadow:0 0 0 3px rgba(20,97,62,.12);outline:none}
    .kx-btn{transition:transform .12s ease,box-shadow .15s ease,opacity .12s ease}
    .kx-btn:hover{transform:translateY(-1px)}
    .kx-btn-primary:hover{box-shadow:0 10px 24px rgba(20,97,62,.28)}
    .kx-link{transition:opacity .12s ease}.kx-link:hover{opacity:.7}
    .kx-bar-fill{transition:width .6s cubic-bezier(.4,0,.2,1)}
    .kx-card{animation:kxfade .4s ease both}
    .kx-tile{transition:transform .12s ease,box-shadow .15s ease}
    .kx-tile:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(0,0,0,.10)}
    @keyframes kxfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .kx-nav a,.kx-nav div.kx-soon{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;font-size:14.5px;text-decoration:none;color:rgba(255,255,255,.62);transition:background .12s ease,color .12s ease}
    .kx-nav a:hover{background:rgba(255,255,255,.06);color:#fff}
    .kx-nav a.kx-active{background:rgba(127,212,168,.14);color:#fff}
    .kx-shell{display:flex;min-height:100vh;background:${CREAM}}
    .kx-aside{width:248px;flex-shrink:0;background:${NAVY};display:flex;flex-direction:column;position:sticky;top:0;height:100vh;padding:22px 16px}
    .kx-main{flex:1;min-width:0;display:flex;flex-direction:column}
    @media (max-width:860px){
      .kx-shell{flex-direction:column}
      .kx-aside{width:100%;height:auto;position:relative;padding:14px 14px}
      .kx-nav{display:flex;gap:6px;overflow-x:auto}
      .kx-nav a,.kx-nav div.kx-soon{white-space:nowrap;padding:8px 12px}
      .kx-aside .kx-only-wide{display:none}
    }
  `;document.head.appendChild(s)}
}

const I = {
  home:'M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5',
  book:'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM19 3v16',
  grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  badge:'M12 2l2.5 5 5.5.8-4 3.9.9 5.5L12 20l-4.9 2.6.9-5.5-4-3.9 5.5-.8z',
  users:'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8',
  spark:'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18',
  plus:'M12 5v14M5 12h14',
}
function Ico({d}:{d:string}){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>}

const ROLE:Record<string,string>={admin:'Administrator',manager:'Manager',learner:'Lernende/r'}

const MAIN_NAV=[
  {key:'uebersicht',label:'Übersicht',href:'/arbeitsbereich',icon:I.home},
  {key:'lernen',label:'Lernen',href:'/bibliothek',icon:I.book},
  {key:'skills',label:'Skills',href:'/skills',icon:I.grid},
  {key:'nachweise',label:'Nachweise',href:'/nachweise',icon:I.badge},
  {key:'team',label:'Team',href:'/team',icon:I.users},
]
const ADMIN_NAV=[
  {key:'ki',label:'KI-Kursersteller',href:'/kursersteller',icon:I.spark},
]

export default function AppShell({active,children}:{active:string;children:ReactNode}){
  const router=useRouter()
  const [company,setCompany]=useState('')
  const [email,setEmail]=useState('')
  const [role,setRole]=useState('')
  const [today,setToday]=useState('')

  useEffect(()=>{injectCI();setToday(new Date().toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'}));let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id,access_level').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const {data:cp}=await supabase.from('company_profiles').select('display_name').eq('tenant_id',tid).maybeSingle()
    if(!on)return
    setEmail(session.user.email||''); setRole((au as any)?.access_level||'')
    setCompany((cp as any)?.display_name||'')
  })();return()=>{on=false}},[router])

  async function logout(){await supabase.auth.signOut();router.replace('/anmelden')}
  const initials=(company||email||'K').trim().slice(0,2).toUpperCase()

  const sideLabel:React.CSSProperties={fontFamily:FM,fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(255,255,255,.4)',padding:'0 12px',margin:'14px 0 6px'}
  const soonTag=<span style={{marginLeft:'auto',fontFamily:FM,fontSize:9,letterSpacing:'.08em',color:GOLD,border:`1px solid rgba(184,144,74,.5)`,borderRadius:20,padding:'1px 7px'}}>bald</span>

  return(<div className="kx-shell">
    <aside className="kx-aside">
      {/* Logo */}
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 8px 16px'}}>
        <div style={{width:30,height:30,borderRadius:9,background:GREEN,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          <span style={{fontFamily:FH,fontWeight:700,color:'#fff',fontSize:17}}>K</span>
        </div>
        <span style={{fontFamily:FB,fontWeight:700,fontSize:18,color:'#fff',letterSpacing:'.06em'}}>KALYX</span>
      </div>
      {/* Mandant */}
      <div className="kx-only-wide">
        <div style={sideLabel}>Mandant</div>
        <div style={{padding:'0 12px 8px',fontFamily:FB,fontSize:14.5,fontWeight:600,color:'rgba(255,255,255,.92)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{company||'—'}</div>
      </div>
      {/* Hauptnavigation */}
      <nav className="kx-nav" style={{display:'flex',flexDirection:'column',gap:2,marginTop:6}}>
        {MAIN_NAV.map(n=> n.soon
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
          <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{email||'—'}</div>
          <div style={{fontFamily:FM,fontSize:10.5,color:'rgba(255,255,255,.45)'}}>{ROLE[role]||'Nutzer'}</div>
        </div>
      </div>
    </aside>

    <div className="kx-main">
      {/* Topbar */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 28px',borderBottom:`1px solid ${LINE}`,background:CREAM}}>
        <div style={{fontFamily:FM,fontSize:13,color:GRAY,letterSpacing:'.02em'}}>{company||'KALYX'}{today?`  ·  ${today}`:''}</div>
        <button className="kx-link" onClick={logout} style={{fontFamily:FB,fontSize:13.5,color:NAVY,background:'transparent',border:`1px solid ${LINE}`,borderRadius:9,padding:'7px 14px',cursor:'pointer'}}>Abmelden</button>
      </div>
      {/* Inhalt */}
      <main style={{flex:1,padding:'30px 28px 56px'}}>
        <div style={{maxWidth:1040,margin:'0 auto'}}>{children}</div>
      </main>
    </div>
  </div>)
}
