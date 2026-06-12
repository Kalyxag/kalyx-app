// Ziel-Pfad im Repo: app/willkommen/page.tsx  (NEU)
//
// Landeseite des Einladungslinks. Supabase setzt aus dem Link eine Sitzung.
// Die eingeladene Person vergibt ihr Passwort, stimmt dem Datenschutz zu und
// gelangt danach in die Plattform. Schlaegt die Sitzung fehl (Link abgelaufen),
// gibt es einen klaren Hinweis.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', LINE='#E4E0D8', GRAY='#6B7280', RED='#9b2c2c'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"

export default function WillkommenPage(){
  const router=useRouter()
  const [phase,setPhase]=useState<'prüfe'|'formular'|'kein_link'>('prüfe')
  const [email,setEmail]=useState('')
  const [pw,setPw]=useState(''); const [pw2,setPw2]=useState('')
  const [consent,setConsent]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  useEffect(()=>{
    let done=false
    const prüfe=(session:any)=>{
      if(done) return
      if(session?.user){ done=true; setEmail(session.user.email||''); setPhase('formular') }
    }
    supabase.auth.getSession().then(({data})=>prüfe(data.session))
    const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>prüfe(session))
    // Wenn nach kurzer Zeit keine Sitzung aus dem Link kam: Hinweis zeigen.
    const t=setTimeout(()=>{ if(!done) setPhase('kein_link') },2500)
    return ()=>{ sub.subscription.unsubscribe(); clearTimeout(t) }
  },[])

  async function aktivieren(){
    setError('')
    if(pw.length<8){ setError('Bitte ein Passwort mit mindestens 8 Zeichen wählen.'); return }
    if(pw!==pw2){ setError('Die beiden Passwörter stimmen nicht überein.'); return }
    if(!consent){ setError('Bitte bestätige die Datenschutzhinweise, um fortzufahren.'); return }
    setBusy(true)
    const { error:uerr }=await supabase.auth.updateUser({ password: pw })
    if(uerr){ setError('Das Passwort konnte nicht gesetzt werden: '+uerr.message); setBusy(false); return }
    try{
      const { data }=await supabase.auth.getSession()
      const uid=data.session?.user?.id
      if(uid) await supabase.from('app_users').update({ consent_at: new Date().toISOString() }).eq('id', uid)
    }catch{}
    router.replace('/')
  }

  const wrap:React.CSSProperties={minHeight:'100vh',background:CREAM,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px',fontFamily:FB}
  const card:React.CSSProperties={width:'100%',maxWidth:440,background:'#fff',borderRadius:18,border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 18px 48px rgba(0,0,0,.08)',padding:'34px 32px'}
  const inp:React.CSSProperties={width:'100%',fontFamily:FB,fontSize:15,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:11,padding:'12px 14px',boxSizing:'border-box'}
  const lbl:React.CSSProperties={display:'block',fontFamily:FB,fontSize:13.5,fontWeight:600,color:NAVY,margin:'0 0 6px'}

  return(<div style={wrap}><div style={card}>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
      <div style={{width:34,height:34,borderRadius:10,background:GREEN,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:FH,fontWeight:700,color:'#fff',fontSize:19}}>K</span>
      </div>
      <span style={{fontFamily:FB,fontWeight:700,fontSize:20,color:NAVY,letterSpacing:'.06em'}}>KALYX</span>
    </div>

    {phase==='prüfe' && <p style={{color:GRAY,fontSize:14.5}}>Einen Moment, dein Zugang wird geprüft …</p>}

    {phase==='kein_link' && (<>
      <h1 style={{fontFamily:FH,fontSize:26,fontWeight:600,color:NAVY,margin:'0 0 8px'}}>Link nicht mehr gültig</h1>
      <p style={{color:GRAY,fontSize:14.5,lineHeight:1.6,marginBottom:18}}>Dieser Einladungslink ist abgelaufen oder wurde bereits verwendet. Bitte deine Administratorin oder deinen Administrator um eine neue Einladung. Hast du bereits ein Passwort gesetzt, kannst du dich direkt anmelden.</p>
      <a href="/anmelden" style={{display:'inline-block',fontFamily:FB,fontSize:14.5,fontWeight:600,color:'#fff',background:GREEN,borderRadius:11,padding:'12px 22px',textDecoration:'none'}}>Zur Anmeldung</a>
    </>)}

    {phase==='formular' && (<>
      <h1 style={{fontFamily:FH,fontSize:27,fontWeight:600,color:NAVY,margin:'0 0 6px'}}>Willkommen bei KALYX</h1>
      <p style={{color:GRAY,fontSize:14.5,lineHeight:1.6,marginBottom:20}}>Lege ein Passwort für dein Konto fest{email?<> ({email})</>:null}, dann kann es losgehen.</p>

      <label style={lbl}>Passwort</label>
      <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mindestens 8 Zeichen" style={inp} autoComplete="new-password"/>
      <label style={{...lbl,marginTop:14}}>Passwort wiederholen</label>
      <input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} placeholder="Zur Bestätigung erneut eingeben" style={inp} autoComplete="new-password"/>

      <label style={{display:'flex',alignItems:'flex-start',gap:9,margin:'16px 0 4px',cursor:'pointer'}}>
        <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} style={{marginTop:3,width:16,height:16,accentColor:GREEN,cursor:'pointer'}}/>
        <span style={{fontSize:13,color:GRAY,lineHeight:1.55}}>Ich habe die <a href="/datenschutz" target="_blank" style={{color:GREEN}}>Datenschutzhinweise</a> gelesen und bin mit der Verarbeitung meiner Daten zu Schulungszwecken einverstanden.</span>
      </label>

      {error && <div style={{fontSize:13,color:RED,lineHeight:1.5,margin:'10px 0 0'}}>{error}</div>}

      <button disabled={busy} onClick={aktivieren} style={{width:'100%',fontFamily:FB,fontSize:15,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:11,padding:'13px',cursor:'pointer',marginTop:18,opacity:busy?.6:1}}>{busy?'Konto wird aktiviert …':'Konto aktivieren'}</button>
    </>)}
  </div></div>)
}
