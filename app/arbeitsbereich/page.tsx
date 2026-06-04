// Ziel-Pfad im Repo: app/arbeitsbereich/page.tsx  (ERSETZT)
//
// Echter Arbeitsbereich, jetzt in der gemeinsamen App-Shell (Seitenleiste).
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

const SECTORS:Record<string,string>={finance:'Finanzdienstleistung',pharma:'Pharma / Life Sciences',bildung:'Bildung / Verband',retail:'Handel / Retail',industrie:'Industrie / Produktion',sonstige:'Sonstige'}
const RECERT:Record<string,string>={jaehrlich:'Jährlich',halbjaehrlich:'Halbjährlich','alle 2 Jahre':'Alle 2 Jahre',keine:'Keine feste Vorgabe'}

type Prof={display_name?:string;legal_name?:string;sector?:string;country?:string;website?:string}
type Comp={frameworks?:string[];esignature_required?:boolean;recert_interval_default?:string;residency_confirmed?:boolean}
type Ob={step_profile?:boolean;step_departments?:boolean;step_compliance?:boolean}

export default function ArbeitsbereichPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [prof,setProf]=useState<Prof>({})
  const [comp,setComp]=useState<Comp>({})
  const [ob,setOb]=useState<Ob>({})
  const [deptCount,setDeptCount]=useState(0)
  const [roleCount,setRoleCount]=useState(0)
  const [teamCount,setTeamCount]=useState(0)
  const [courseCount,setCourseCount]=useState(0)
  const [deptNames,setDeptNames]=useState<string[]>([])

  useEffect(()=>{let active=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const [{data:p},{data:c},{data:o},{data:dRows},{count:rCount},{count:uCount},{count:courseC}]=await Promise.all([
      supabase.from('company_profiles').select('display_name,legal_name,sector,country,website').eq('tenant_id',tid).maybeSingle(),
      supabase.from('compliance_profiles').select('frameworks,esignature_required,recert_interval_default,residency_confirmed').eq('tenant_id',tid).maybeSingle(),
      supabase.from('onboarding_state').select('step_profile,step_departments,step_compliance').eq('tenant_id',tid).maybeSingle(),
      supabase.from('departments').select('name').eq('tenant_id',tid).order('created_at'),
      supabase.from('roles').select('*',{count:'exact',head:true}).eq('tenant_id',tid),
      supabase.from('app_users').select('*',{count:'exact',head:true}).eq('tenant_id',tid),
      supabase.from('courses').select('*',{count:'exact',head:true}),
    ])
    if(!active)return
    setProf((p as Prof)||{});setComp((c as Comp)||{});setOb((o as Ob)||{})
    const names=((dRows as {name:string}[])||[]).map(d=>d.name)
    setDeptNames(names);setDeptCount(names.length)
    setRoleCount(rCount||0);setTeamCount(uCount||0);setCourseCount(courseC||0)
    setLoading(false)
  })();return()=>{active=false}},[router])

  const activeDone=[ob.step_profile,ob.step_departments,ob.step_compliance].filter(Boolean).length
  const percent=Math.round((activeDone/3)*100)
  const frameworks=Array.isArray(comp.frameworks)?comp.frameworks:[]

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'22px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const tileTitle:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:10}
  const btn:React.CSSProperties={fontFamily:FB,fontSize:14.5,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'12px 22px',cursor:'pointer'}
  const editLink:React.CSSProperties={fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN,textDecoration:'none'}
  const chip:React.CSSProperties={fontFamily:FB,fontSize:12.5,fontWeight:600,padding:'5px 11px',borderRadius:8,border:`1.5px solid ${GREEN}`,color:GREEN,background:GREEN_PALE}
  const big:React.CSSProperties={fontFamily:FH,fontSize:34,fontWeight:700,color:NAVY,lineHeight:1}

  const checklist=[
    {label:'Firmenprofil',done:!!ob.step_profile,soon:false},
    {label:'Abteilungen & Rollen',done:!!ob.step_departments,soon:false},
    {label:'Compliance-Rahmen',done:!!ob.step_compliance,soon:false},
    {label:'Kurse zuweisen',done:false,soon:true},
    {label:'Branding',done:false,soon:true},
    {label:'Mitarbeitende einladen',done:false,soon:true},
  ]

  return(<AppShell active="uebersicht">
    {loading ? <div style={{color:GRAY,fontFamily:FB,padding:'8px 0'}}>Lade deinen Arbeitsbereich …</div> : (<>
      <div style={eyebrow}>Arbeitsbereich</div>
      <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 4px'}}>Willkommen zurück{prof.display_name?`, ${prof.display_name}`:''}.</h1>
      <p style={{fontFamily:FB,fontSize:14.5,color:GRAY,marginBottom:22}}>Das ist eure Kommandozentrale. Von hier richtet ihr alles ein und behaltet den Überblick.</p>

      {/* Einrichtungs-Fortschritt */}
      <div className="kx-card" style={{...card,marginBottom:18}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
          <div style={{flex:'1 1 280px'}}>
            <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:8}}>
              <span style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY}}>Grundeinrichtung</span>
              <span style={{fontFamily:FM,fontSize:13,color:percent===100?GREEN:GOLD}}>{percent}% · {activeDone}/3</span>
            </div>
            <div style={{height:9,borderRadius:99,background:'#EDEAE2',overflow:'hidden',marginBottom:14}}>
              <div className="kx-bar-fill" style={{width:`${percent}%`,height:'100%',borderRadius:99,background:`linear-gradient(90deg, ${GREEN}, ${GOLD})`}}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(190px, 1fr))',gap:8}}>
              {checklist.map(it=>(
                <div key={it.label} style={{display:'flex',alignItems:'center',gap:9,fontSize:13.5,color:it.soon?GRAY:NAVY}}>
                  <span style={{width:18,height:18,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:it.done?GREEN:it.soon?'#EDEAE2':'#fff',border:it.done?'none':`1.5px solid ${it.soon?'#D8D3C8':GOLD}`}}>
                    {it.done?<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>:null}
                  </span>
                  <span>{it.label}{it.soon?<span style={{color:GOLD,fontSize:11.5}}> · bald</span>:null}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{flexShrink:0}}>
            {percent<100
              ? <a href="/onboarding" className="kx-btn kx-btn-primary" style={{...btn,display:'inline-block',textDecoration:'none'}}>Einrichtung fortsetzen</a>
              : <span style={{...chip,padding:'9px 14px'}}>Grundeinrichtung abgeschlossen</span>}
          </div>
        </div>
      </div>

      {/* Kacheln */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:16}}>
        <div className="kx-card kx-tile" style={card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={tileTitle}>Firma</span><a href="/onboarding" className="kx-link" style={editLink}>bearbeiten</a></div>
          <div style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:4}}>{prof.display_name||'—'}</div>
          <div style={{fontSize:13.5,color:GRAY,lineHeight:1.7}}>
            {prof.legal_name?<div>{prof.legal_name}</div>:null}
            <div>{SECTORS[prof.sector||'sonstige']||'Sonstige'} · {prof.country||'CH'}</div>
            {prof.website?<div style={{color:GREEN}}>{prof.website}</div>:null}
          </div>
        </div>

        <div className="kx-card kx-tile" style={card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={tileTitle}>Organisation</span><a href="/onboarding" className="kx-link" style={editLink}>bearbeiten</a></div>
          <div style={{display:'flex',gap:22,marginBottom:10}}>
            <div><div style={big}>{deptCount}</div><div style={{fontSize:12.5,color:GRAY}}>Abteilungen</div></div>
            <div><div style={big}>{roleCount}</div><div style={{fontSize:12.5,color:GRAY}}>Rollen</div></div>
          </div>
          {deptNames.length>0 && <div style={{fontSize:13,color:GRAY}}>{deptNames.slice(0,4).join(' · ')}{deptNames.length>4?' …':''}</div>}
        </div>

        <div className="kx-card kx-tile" style={card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={tileTitle}>Compliance</span><a href="/onboarding" className="kx-link" style={editLink}>bearbeiten</a></div>
          {frameworks.length>0
            ? <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>{frameworks.map(f=><span key={f} style={chip}>{f}</span>)}</div>
            : <div style={{fontSize:13.5,color:GRAY,marginBottom:10}}>Noch keine Regelwerke gewählt.</div>}
          <div style={{fontSize:13,color:GRAY}}>Rezertifizierung: {RECERT[comp.recert_interval_default||'jaehrlich']||'—'}{comp.esignature_required?' · E-Signatur aktiv':''}</div>
        </div>

        <a href="/team" className="kx-card kx-tile" style={{...card,textDecoration:'none',display:'block'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={tileTitle}>Team</span><span style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN}}>Team öffnen →</span></div>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}><div style={big}>{teamCount}</div><div style={{fontSize:12.5,color:GRAY}}>Mitglied(er)</div></div>
          <div style={{fontSize:13,color:GOLD}}>Mitarbeitende einladen folgt als nächster Baustein.</div>
        </a>

        <a href="/bibliothek" className="kx-card kx-tile" style={{...card,textDecoration:'none',display:'block'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={tileTitle}>Kurse</span><span style={{fontFamily:FB,fontSize:13,fontWeight:600,color:GREEN}}>Bibliothek öffnen →</span></div>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:6}}><div style={big}>{courseCount}</div><div style={{fontSize:12.5,color:GRAY}}>Kurse verfügbar</div></div>
          <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Globalen Katalog durchsuchen oder eigene Kurse anlegen.</div>
        </a>

        <div className="kx-card" style={{...card,opacity:0.92}}>
          <span style={tileTitle}>Branding</span>
          <div style={{fontFamily:FH,fontSize:20,fontWeight:600,color:NAVY,marginBottom:4}}>In Vorbereitung</div>
          <div style={{fontSize:13,color:GRAY,lineHeight:1.6}}>Logo und Farben für eure White-Label-Plattform, kommt in einer späteren Runde.</div>
        </div>
      </div>

      <p style={{fontFamily:FB,fontSize:12.5,color:GRAY,textAlign:'center',marginTop:26}}>Pilotbetrieb · Daten in der EU gespeichert · Schweizer-souveränes Hosting ist das Ziel</p>
    </>)}
  </AppShell>)
}
