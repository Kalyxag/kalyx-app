// Ziel-Pfad im Repo: app/skills/page.tsx  (ERSETZT – Motivations-Hub, Stufe 1)
//
// Lebendige Skills-Seite aus echten Daten: Level + Fortschrittsring und Abzeichen,
// berechnet aus bestandenen Prüfungen (exam_attempts) und Zertifikaten (certificates).
// Keine neuen Tabellen. Ehrlich: KALYX-interne Anerkennung, kein offizieller Abschluss.
// Die Skills-Matrix (Soll vs. Ist) bleibt als Stufe 2 darunter angekündigt.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

const LEVELS=[{n:'Einsteiger',min:0},{n:'Praktiker',min:150},{n:'Fortgeschritten',min:400},{n:'Experte',min:800},{n:'Mentor',min:1500}]

type Attempt={course_id:string;passed:boolean;score:number;completed_at:string|null}
type Cert={course_id:string;issued_at:string|null}

export default function SkillsPage(){
  const router=useRouter()
  const [loading,setLoading]=useState(true)
  const [stats,setStats]=useState({passedCourses:0,certs:0,attempts:0,perfect:0,bestScore:0,xp:0})
  const [recent,setRecent]=useState<{title:string;score:number;date:string|null}[]>([])

  useEffect(()=>{let on=true;(async()=>{
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    const uid=session.user.id

    const {data:att}=await supabase.from('exam_attempts').select('course_id,passed,score,completed_at').eq('user_id',uid)
    const {data:certs}=await supabase.from('certificates').select('course_id,issued_at').eq('user_id',uid).eq('status','gueltig')
    const attempts=((att as Attempt[])||[])
    const certList=((certs as Cert[])||[])

    const passedCourseIds=Array.from(new Set(attempts.filter(a=>a.passed).map(a=>a.course_id)))
    const perfect=attempts.filter(a=>Number(a.score)===100).length
    const bestScore=attempts.reduce((m,a)=>Math.max(m,Number(a.score)||0),0)
    const xp=passedCourseIds.length*100 + certList.length*50 + attempts.length*10 + perfect*25

    // Zuletzt gemeisterte Kurse (Titel laden)
    let recentList:{title:string;score:number;date:string|null}[]=[]
    if(passedCourseIds.length){
      const {data:cs}=await supabase.from('courses').select('id,title').in('id',passedCourseIds.slice(0,20))
      const titleById:Record<string,string>={}; ((cs as any[])||[]).forEach(c=>titleById[c.id]=c.title)
      const bestByCourse:Record<string,{score:number;date:string|null}>={}
      attempts.filter(a=>a.passed).forEach(a=>{
        const cur=bestByCourse[a.course_id]
        if(!cur||Number(a.score)>cur.score) bestByCourse[a.course_id]={score:Number(a.score)||0,date:a.completed_at}
      })
      recentList=Object.entries(bestByCourse).map(([cid,v])=>({title:titleById[cid]||'Kurs',score:v.score,date:v.date}))
        .sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,5)
    }

    if(!on)return
    setStats({passedCourses:passedCourseIds.length,certs:certList.length,attempts:attempts.length,perfect,bestScore,xp})
    setRecent(recentList)
    setLoading(false)
  })();return()=>{on=false}},[router])

  // Level bestimmen
  let curIdx=0; for(let i=0;i<LEVELS.length;i++){if(stats.xp>=LEVELS[i].min)curIdx=i}
  const cur=LEVELS[curIdx]; const next=LEVELS[curIdx+1]||null
  const progress=next?Math.max(0,Math.min(1,(stats.xp-cur.min)/(next.min-cur.min))):1
  const toNext=next?next.min-stats.xp:0

  const badges=[
    {key:'first_pass',label:'Erste Prüfung bestanden',earned:stats.passedCourses>=1,hint:'Bestehe deine erste Übungsprüfung.'},
    {key:'first_cert',label:'Erstes Zertifikat',earned:stats.certs>=1,hint:'Erhalte dein erstes Zertifikat.'},
    {key:'perfect',label:'Fehlerfrei',earned:stats.perfect>=1,hint:'Bestehe eine Prüfung mit 100 Prozent.'},
    {key:'three',label:'Drei Kurse gemeistert',earned:stats.passedCourses>=3,hint:'Bestehe drei verschiedene Kurse.'},
    {key:'sticker',label:'Dranbleiber',earned:stats.attempts>=10,hint:'Absolviere zehn Prüfungsdurchläufe.'},
    {key:'collector',label:'Sammler',earned:stats.certs>=3,hint:'Sammle drei Zertifikate.'},
  ]
  const earnedCount=badges.filter(b=>b.earned).length

  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:24,border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}

  // Fortschrittsring
  const R=52, C=2*Math.PI*R, off=C*(1-progress)

  if(loading) return <AppShell active="skills"><div style={{color:GRAY,fontFamily:FB}}>Lade deinen Fortschritt …</div></AppShell>

  const fresh=stats.attempts===0&&stats.certs===0

  return(<AppShell active="skills">
    <div style={eyebrow}>Skills &amp; Fortschritt</div>
    <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 18px'}}>Dein Lernweg</h1>

    {/* LEVEL + RING */}
    <div className="kx-card" style={{...card,marginBottom:16}}>
      <div style={{display:'flex',gap:26,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{position:'relative',width:128,height:128,flexShrink:0}}>
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={R} fill="none" stroke="#EDEAE2" strokeWidth="11"/>
            <circle cx="64" cy="64" r={R} fill="none" stroke={GREEN} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 64 64)"/>
          </svg>
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontFamily:FM,fontSize:11,color:GRAY}}>Level</span>
            <span style={{fontFamily:FH,fontSize:30,fontWeight:700,color:GREEN,lineHeight:1}}>{curIdx+1}</span>
          </div>
        </div>
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontFamily:FH,fontSize:26,fontWeight:600,color:NAVY}}>{cur.n}</div>
          {next
            ? <p style={{fontFamily:FB,fontSize:14,color:GRAY,marginTop:4}}>Noch <b style={{color:NAVY}}>{toNext}</b> Punkte bis <b style={{color:NAVY}}>{next.n}</b>. Jeder bestandene Kurs bringt dich näher.</p>
            : <p style={{fontFamily:FB,fontSize:14,color:GRAY,marginTop:4}}>Höchste Stufe erreicht. Stark, dass du andere mitziehst.</p>}
          <div style={{marginTop:12,display:'flex',gap:18,flexWrap:'wrap'}}>
            <Stat n={stats.passedCourses} l="Kurse bestanden"/>
            <Stat n={stats.certs} l="Zertifikate"/>
            <Stat n={stats.attempts} l="Prüfungen absolviert"/>
            {stats.bestScore>0 && <Stat n={stats.bestScore+'%'} l="Bestnote"/>}
          </div>
        </div>
      </div>
      {fresh && (
        <div style={{marginTop:16,padding:'12px 14px',background:GREEN_PALE,borderRadius:10,fontSize:14,color:GREEN}}>
          Willkommen. Dein erster bestandener Kurs setzt deinen Fortschritt in Gang. <a href="/bibliothek" style={{color:GREEN,fontWeight:700}}>Zur Bibliothek →</a>
        </div>
      )}
    </div>

    {/* ABZEICHEN */}
    <div className="kx-card" style={{...card,marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY}}>Abzeichen</h2>
        <span style={{fontFamily:FM,fontSize:12,color:GRAY}}>{earnedCount} von {badges.length}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
        {badges.map(b=>(
          <div key={b.key} style={{display:'flex',gap:11,alignItems:'flex-start',padding:'13px 14px',borderRadius:12,border:`1px solid ${b.earned?GREEN:LINE}`,background:b.earned?GREEN_PALE:'#FAF9F6',opacity:b.earned?1:0.7}}>
            <div style={{width:34,height:34,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',background:b.earned?GREEN:'#E7E3DA',color:b.earned?'#fff':GRAY,fontSize:17}}>{b.earned?'★':'☆'}</div>
            <div>
              <div style={{fontSize:13.5,fontWeight:600,color:b.earned?GREEN:NAVY,lineHeight:1.25}}>{b.label}</div>
              <div style={{fontSize:12,color:GRAY,marginTop:2,lineHeight:1.4}}>{b.earned?'Erreicht':b.hint}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{fontSize:12,color:GRAY,marginTop:14}}>Abzeichen und Level sind KALYX-interne Anerkennung für echte Lernfortschritte, kein offizieller Branchenabschluss.</p>
    </div>

    {/* ZULETZT GEMEISTERT */}
    {recent.length>0 && (
      <div className="kx-card" style={{...card,marginBottom:16}}>
        <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:12}}>Zuletzt gemeistert</h2>
        {recent.map((r,i)=>(
          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:i<recent.length-1?`1px solid ${CREAM}`:'none'}}>
            <span style={{fontSize:14.5,color:NAVY}}>{r.title}</span>
            <span style={{fontFamily:FM,fontSize:13,color:r.score>=100?GREEN:GOLD}}>{r.score}%</span>
          </div>
        ))}
        <div style={{marginTop:14}}><a href="/bibliothek" style={{fontFamily:FB,fontSize:14,fontWeight:600,color:'#fff',background:GREEN,textDecoration:'none',borderRadius:9,padding:'9px 16px',display:'inline-block'}}>Nächsten Kurs wählen →</a></div>
      </div>
    )}

    {/* SKILLS-MATRIX (Stufe 2, angekündigt) */}
    <div className="kx-card" style={{...card,background:'#FBFAF7'}}>
      <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:6}}>Skills-Matrix</h2>
      <p style={{fontFamily:FB,fontSize:14.5,color:GRAY,lineHeight:1.6,marginBottom:6}}>Als nächster Schritt zeigt die Matrix pro Rolle, welche Kompetenzen verlangt sind (Soll) und welche durch Kurse und Prüfungen belegt sind (Ist), inklusive sichtbarer Lücken und einer Empfehlung für deinen nächsten Schritt.</p>
      <p style={{fontFamily:FM,fontSize:11.5,color:GOLD}}>In Vorbereitung · baut auf genau diesen echten Daten auf</p>
    </div>
  </AppShell>)
}

function Stat({n,l}:{n:number|string;l:string}){
  return <div><div style={{fontFamily:FH,fontSize:26,fontWeight:700,color:NAVY,lineHeight:1}}>{n}</div><div style={{fontFamily:FB,fontSize:12,color:GRAY}}>{l}</div></div>
}
