// Ziel-Pfad im Repo: app/team/page.tsx  (NEU)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"; const FB="'Albert Sans', system-ui, sans-serif"; const FM="'IBM Plex Mono', ui-monospace, monospace"

type Dept={id:string;name:string}; type Role={id:string;name:string;access_level:string;department_id:string|null}

export default function TeamPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [memberCount,setMemberCount]=useState(0)
  const [levels,setLevels]=useState<Record<string,number>>({})
  const [depts,setDepts]=useState<Dept[]>([])
  const [roles,setRoles]=useState<Role[]>([])

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const [{data:users},{data:d},{data:r}]=await Promise.all([
      supabase.from('app_users').select('access_level').eq('tenant_id',tid),
      supabase.from('departments').select('id,name').eq('tenant_id',tid).order('created_at'),
      supabase.from('roles').select('id,name,access_level,department_id').eq('tenant_id',tid).order('created_at'),
    ])
    if(!on)return
    const us=(users as {access_level:string}[])||[]
    const lv:Record<string,number>={}; us.forEach(u=>{lv[u.access_level]=(lv[u.access_level]||0)+1})
    setMemberCount(us.length); setLevels(lv); setDepts((d as Dept[])||[]); setRoles((r as Role[])||[])
    setLoading(false)
  })();return()=>{on=false}},[router])

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'22px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const tileTitle:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:10}
  const big:React.CSSProperties={fontFamily:FH,fontSize:34,fontWeight:700,color:NAVY,lineHeight:1}
  const chip:React.CSSProperties={fontFamily:FB,fontSize:12.5,fontWeight:600,padding:'5px 11px',borderRadius:8,border:`1.5px solid ${GREEN}`,color:GREEN,background:GREEN_PALE}
  const LV:Record<string,string>={admin:'Administrator',manager:'Manager',learner:'Lernende'}

  return(<AppShell active="team">
    <div style={eyebrow}>Team</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 18px'}}>Organisation &amp; Team</h1>
    {loading ? <div style={{color:GRAY,fontFamily:FB}}>Lade …</div> : (<>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginBottom:16}}>
        <div className="kx-card" style={card}>
          <span style={tileTitle}>Mitglieder</span>
          <div style={big}>{memberCount}</div>
          <div style={{fontSize:13,color:GRAY,marginTop:8}}>{Object.entries(levels).map(([k,v])=>`${LV[k]||k}: ${v}`).join(' · ')||'—'}</div>
        </div>
        <div className="kx-card" style={card}>
          <span style={tileTitle}>Abteilungen</span>
          <div style={big}>{depts.length}</div>
          <div style={{fontSize:13,color:GRAY,marginTop:8}}>{depts.map(d=>d.name).slice(0,5).join(' · ')||'—'}</div>
        </div>
        <div className="kx-card" style={card}>
          <span style={tileTitle}>Rollen</span>
          <div style={big}>{roles.length}</div>
          <div style={{fontSize:13,color:GRAY,marginTop:8}}>{roles.map(r=>r.name).slice(0,5).join(' · ')||'—'}</div>
        </div>
      </div>

      <div className="kx-card" style={card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
          <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,margin:0}}>Rollen &amp; Zuordnung</h2>
          <a href="/onboarding" style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN,textDecoration:'none'}}>Struktur bearbeiten</a>
        </div>
        {roles.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch keine Rollen angelegt.</p> : roles.map(r=>{
          const dn=depts.find(d=>d.id===r.department_id)?.name
          return <div key={r.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 0',borderBottom:`1px solid #F0EEE8`}}>
            <div><span style={{fontSize:14.5,fontWeight:600,color:NAVY}}>{r.name}</span>{dn?<span style={{fontSize:13,color:GRAY}}> · {dn}</span>:null}</div>
            <span style={chip}>{LV[r.access_level]||r.access_level}</span>
          </div>
        })}
      </div>

      <div className="kx-card" style={{...card,marginTop:16,background:'#FBF8F1',borderColor:'#EBD9B8'}}>
        <span style={tileTitle}>Mitarbeitende einladen</span>
        <div style={{fontFamily:FH,fontSize:20,fontWeight:600,color:NAVY,marginBottom:4}}>Als nächster Baustein</div>
        <div style={{fontSize:13.5,color:GRAY,lineHeight:1.6}}>Einladungen per E-Mail brauchen einen zuverlässigen Mailversand. Den richten wir als Nächstes ein, dann können Mitarbeitende eingeladen werden und erscheinen hier mit Rolle und Lernfortschritt.</div>
      </div>
    </>)}
  </AppShell>)
}
