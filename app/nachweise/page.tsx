// Ziel-Pfad im Repo: app/nachweise/page.tsx  (NEU)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280', RED='#C0392B'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

type Cert={id:string;cert_number:string;title:string;recipient_name:string|null;score:number|null;status:string;issued_at:string}

export default function NachweisePage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [certs,setCerts]=useState<Cert[]>([])

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const {data:c}=await supabase.from('certificates').select('id,cert_number,title,recipient_name,score,status,issued_at').order('issued_at',{ascending:false})
    if(!on)return; setCerts((c as Cert[])||[]); setLoading(false)
  })();return()=>{on=false}},[router])

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'20px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const fmtDate=(s:string)=>{try{return new Date(s).toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'})}catch{return s}}

  return(<AppShell active="nachweise">
    <div style={eyebrow}>Nachweise</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 6px'}}>Zertifikate &amp; Nachweise</h1>
    <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,marginBottom:18}}>KALYX-Abschlusszertifikate werden automatisch ausgestellt, wenn eine Prüfung bestanden wird. Jedes trägt eine eindeutige, prüfbare Nummer.</p>

    {loading ? <div style={{color:GRAY,fontFamily:FB}}>Lade …</div>
      : certs.length===0
        ? <div className="kx-card" style={{...card,color:GRAY}}>Noch keine Nachweise. Lege über „Lernen" eine Prüfung ab und bestehe sie, dann erscheint hier dein Zertifikat.</div>
        : <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
            {certs.map(c=>(
              <div key={c.id} className="kx-card" style={{...card,display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:8}}>
                  <span style={{fontFamily:FM,fontSize:10.5,letterSpacing:'.06em',color:GREEN,background:GREEN_PALE,padding:'3px 9px',borderRadius:20}}>{c.status==='gueltig'?'GÜLTIG':'WIDERRUFEN'}</span>
                  {c.score!=null && <span style={{fontFamily:FM,fontSize:12,color:GRAY}}>{Math.round(c.score)}%</span>}
                </div>
                <h3 style={{fontFamily:FH,fontSize:21,fontWeight:600,color:NAVY,marginBottom:4,lineHeight:1.2}}>{c.title}</h3>
                <div style={{fontSize:13,color:GRAY,marginBottom:2}}>{c.recipient_name||''}</div>
                <div style={{fontSize:12.5,color:GRAY,fontFamily:FM,marginBottom:2}}>{c.cert_number}</div>
                <div style={{fontSize:12.5,color:GRAY,marginBottom:14}}>Ausgestellt am {fmtDate(c.issued_at)}</div>
                <a href={`/zertifikat?nr=${encodeURIComponent(c.cert_number)}`} target="_blank" rel="noreferrer" style={{marginTop:'auto',fontFamily:FB,fontSize:13.5,fontWeight:600,color:GREEN,textDecoration:'none',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'9px 14px',textAlign:'center'}}>Zertifikat ansehen &amp; drucken</a>
              </div>
            ))}
          </div>}

    <p style={{fontFamily:FB,fontSize:12.5,color:GRAY,textAlign:'center',marginTop:26}}>KALYX-Abschlusszertifikat über absolvierte Kurse und Prüfungen. Kein offizieller Branchenabschluss.</p>
  </AppShell>)
}
