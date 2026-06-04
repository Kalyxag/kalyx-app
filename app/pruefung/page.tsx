// Ziel-Pfad im Repo: app/pruefung/page.tsx  (NEU)
//
// Prüfung ablegen UND Fragen verwalten (bei eigenen Kursen, inkl. KI).
// Aufruf:  /pruefung?kurs=<courseId>
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280', RED='#C0392B'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

type Question={id:string;tenant_id:string|null;position:number;topic:string|null;question:string;options:string[];correct_index:number;explanation:string|null}
type Course={id:string;tenant_id:string|null;title:string;language:string;level:string;cert_prep:boolean;external_cert:string|null;pass_threshold:number;status:string}
type Ans={question_id:string;chosen:number;correct:boolean;topic:string}

export default function PruefungPage(){
  const router=useRouter()
  const [courseId,setCourseId]=useState('')
  const [tenantId,setTenantId]=useState(''); const [uid,setUid]=useState(''); const [email,setEmail]=useState(''); const [certNumber,setCertNumber]=useState('')
  const [course,setCourse]=useState<Course|null>(null)
  const [questions,setQuestions]=useState<Question[]>([])
  const [canEdit,setCanEdit]=useState(false)
  const [loading,setLoading]=useState(true)
  const [tab,setTab]=useState<'exam'|'manage'>('exam')

  useEffect(()=>{let on=true;(async()=>{
    const cid=new URLSearchParams(window.location.search).get('kurs')||''
    if(!cid){router.replace('/bibliothek');return}
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    if(!on)return
    setCourseId(cid);setTenantId(tid);setUid(session.user.id);setEmail(session.user.email||'')
    const {data:c}=await supabase.from('courses').select('id,tenant_id,title,language,level,cert_prep,external_cert,pass_threshold,status').eq('id',cid).maybeSingle()
    if(!c){router.replace('/bibliothek');return}
    setCourse(c as Course)
    setCanEdit(!!(c as Course).tenant_id && (c as Course).tenant_id===tid)
    await loadQuestions(cid)
    if(on) setLoading(false)
  })();return()=>{on=false}},[router])

  async function loadQuestions(cid:string){
    const {data}=await supabase.from('course_questions').select('id,tenant_id,position,topic,question,options,correct_index,explanation').eq('course_id',cid).order('position')
    setQuestions((data as Question[])||[])
  }

  // ---------------- Prüfung ----------------
  const [phase,setPhase]=useState<'setup'|'running'|'result'>('setup')
  const [mode,setMode]=useState<'mit_zeit'|'ohne_zeit'|'benutzerdefiniert'>('ohne_zeit')
  const [customCount,setCustomCount]=useState(5)
  const [customTimed,setCustomTimed]=useState(false)
  const [exQ,setExQ]=useState<Question[]>([])
  const [idx,setIdx]=useState(0)
  const [sel,setSel]=useState<number|null>(null)
  const [revealed,setRevealed]=useState(false)
  const [answers,setAnswers]=useState<Ans[]>([])
  const [timed,setTimed]=useState(false)
  const [timeLeft,setTimeLeft]=useState(0)
  const startedRef=useRef<number>(0)
  const [result,setResult]=useState<{correct:number;total:number;score:number;passed:boolean;byTopic:Record<string,{c:number;t:number}>}|null>(null)
  const [savedMsg,setSavedMsg]=useState('')

  useEffect(()=>{
    if(phase!=='running'||!timed)return
    if(timeLeft<=0){finishExam();return}
    const t=setTimeout(()=>setTimeLeft(s=>s-1),1000)
    return ()=>clearTimeout(t)
  },[phase,timed,timeLeft])

  function startExam(){
    let qs=questions.slice()
    let useTimed=false
    if(mode==='benutzerdefiniert'){qs=qs.slice(0,Math.min(customCount,qs.length));useTimed=customTimed}
    else if(mode==='mit_zeit'){useTimed=true}
    setExQ(qs);setIdx(0);setSel(null);setRevealed(false);setAnswers([]);setResult(null);setSavedMsg('')
    setTimed(useTimed);setTimeLeft(qs.length*60);startedRef.current=Date.now()
    setPhase('running')
  }
  function check(){
    if(sel===null)return
    const q=exQ[idx]
    const correct=sel===q.correct_index
    setAnswers(a=>[...a,{question_id:q.id,chosen:sel,correct,topic:q.topic||'Allgemein'}])
    setRevealed(true)
  }
  function next(){
    if(idx+1>=exQ.length){finishExam();return}
    setIdx(i=>i+1);setSel(null);setRevealed(false)
  }
  async function finishExam(){
    // falls aktuelle Frage beantwortet, aber noch nicht in answers (z.B. Timer), zählt nur Erfasstes
    const all=answers
    const total=exQ.length
    const correct=all.filter(a=>a.correct).length
    const score=total>0?Math.round((correct/total)*100):0
    const passed=score>=(course?.pass_threshold??70)
    const byTopic:Record<string,{c:number;t:number}>={}
    all.forEach(a=>{const k=a.topic||'Allgemein';byTopic[k]=byTopic[k]||{c:0,t:0};byTopic[k].t++;if(a.correct)byTopic[k].c++})
    setResult({correct,total,score,passed,byTopic});setPhase('result');setCertNumber('')
    if(course&&tenantId){
      const dur=Math.round((Date.now()-startedRef.current)/1000)
      const {data:att,error}=await supabase.from('exam_attempts').insert({
        tenant_id:tenantId,course_id:course.id,user_id:uid,mode,total,correct,score,passed,
        answers:all,duration_sec:dur,started_at:new Date(startedRef.current).toISOString(),completed_at:new Date().toISOString(),
      }).select('id').single()
      setSavedMsg(error?('Versuch konnte nicht gespeichert werden: '+error.message):'Versuch gespeichert.')
      // Zertifikat ausstellen, wenn bestanden (nur eines pro Kurs & Person)
      if(passed && !error){
        const {data:existing}=await supabase.from('certificates').select('cert_number').eq('course_id',course.id).eq('user_id',uid).eq('status','gueltig').maybeSingle()
        if((existing as any)?.cert_number){
          setCertNumber((existing as any).cert_number)
        } else {
          const num='KX-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,10).toUpperCase()
          const {error:cerr}=await supabase.from('certificates').insert({
            tenant_id:tenantId,course_id:course.id,user_id:uid,attempt_id:(att as any)?.id||null,
            cert_number:num,title:course.title,recipient_name:email||null,score,status:'gueltig',
          })
          if(!cerr) setCertNumber(num)
        }
      }
    }
  }
  function resetExam(){setPhase('setup');setResult(null)}

  // ---------------- Fragen verwalten ----------------
  const [qText,setQText]=useState(''); const [opts,setOpts]=useState(['','','',''])
  const [correctIdx,setCorrectIdx]=useState(0); const [topic,setTopic]=useState(''); const [expl,setExpl]=useState('')
  const [mMsg,setMMsg]=useState(''); const [adding,setAdding]=useState(false)
  const [aiCount,setAiCount]=useState(5); const [aiGen,setAiGen]=useState(false)
  const [aiDraft,setAiDraft]=useState<{topic:string;question:string;options:string[];correct_index:number;explanation:string}[]|null>(null)
  const [aiMsg,setAiMsg]=useState(''); const [aiSaving,setAiSaving]=useState(false)

  async function addQuestion(){
    if(!qText.trim()){setMMsg('Bitte eine Frage eingeben.');return}
    if(opts.filter(o=>o.trim()).length<2){setMMsg('Bitte mindestens zwei Antwortmöglichkeiten.');return}
    setAdding(true);setMMsg('')
    const base=questions.length
    const {error}=await supabase.from('course_questions').insert({
      course_id:courseId,tenant_id:tenantId,position:base+1,topic:topic.trim()||null,
      question:qText.trim(),options:opts.map(o=>o.trim()).filter(Boolean),correct_index:Math.min(correctIdx,opts.filter(o=>o.trim()).length-1),explanation:expl.trim()||null,
    })
    setAdding(false)
    if(error){setMMsg('Speichern fehlgeschlagen: '+error.message);return}
    setQText('');setOpts(['','','','']);setCorrectIdx(0);setTopic('');setExpl('')
    await loadQuestions(courseId)
  }
  async function delQuestion(id:string){
    await supabase.from('course_questions').delete().eq('id',id)
    await loadQuestions(courseId)
  }
  async function aiGenerate(){
    if(!course)return
    setAiGen(true);setAiMsg('');setAiDraft(null)
    try{
      const r=await fetch('/api/fragen-generieren',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({thema:course.title,anzahl:aiCount,sprache:course.language,niveau:course.level,certPrep:course.cert_prep,externalCert:course.external_cert})})
      const d=await r.json()
      if(!r.ok){setAiMsg(d?.error||'Erzeugen fehlgeschlagen.');setAiGen(false);return}
      setAiDraft(Array.isArray(d.questions)?d.questions:[])
    }catch{setAiMsg('Netzwerkfehler.')}
    setAiGen(false)
  }
  async function aiSave(){
    if(!aiDraft||!aiDraft.length)return
    setAiSaving(true)
    const base=questions.length
    const rows=aiDraft.map((q,i)=>({course_id:courseId,tenant_id:tenantId,position:base+i+1,topic:q.topic||null,question:q.question,options:q.options,correct_index:q.correct_index,explanation:q.explanation||null}))
    const {error}=await supabase.from('course_questions').insert(rows)
    setAiSaving(false)
    if(error){setAiMsg('Speichern fehlgeschlagen: '+error.message);return}
    setAiDraft(null);await loadQuestions(courseId)
  }

  // ---------------- Styles ----------------
  const card:React.CSSProperties={background:'#fff',borderRadius:16,padding:'22px 22px',border:`1px solid ${LINE}`,boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)'}
  const eyebrow:React.CSSProperties={fontFamily:FM,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:GOLD}
  const input:React.CSSProperties={width:'100%',fontFamily:FB,fontSize:14.5,color:NAVY,background:CREAM,border:`1.5px solid ${LINE}`,borderRadius:10,padding:'11px 13px',outline:'none'}
  const label:React.CSSProperties={display:'block',fontSize:12.5,fontWeight:600,color:NAVY,marginBottom:5}
  const btn:React.CSSProperties={fontFamily:FB,fontSize:14.5,fontWeight:600,color:'#fff',background:GREEN,border:'none',borderRadius:10,padding:'12px 22px',cursor:'pointer'}
  const btnGhost:React.CSSProperties={fontFamily:FB,fontSize:14,fontWeight:600,color:GREEN,background:'transparent',border:`1.5px solid ${GREEN}`,borderRadius:10,padding:'10px 16px',cursor:'pointer'}

  if(loading) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Lade Prüfung …</div></AppShell>
  if(!course) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Kurs nicht gefunden.</div></AppShell>

  return(<AppShell active="lernen">
    <a href="/bibliothek" className="kx-link" style={{fontFamily:FB,fontSize:13.5,color:GREEN,textDecoration:'none'}}>← Bibliothek</a>
    <div style={{...eyebrow,marginTop:8}}>Prüfung &amp; Übung</div>
    <h1 style={{fontFamily:FH,fontSize:30,fontWeight:600,color:NAVY,margin:'4px 0 4px'}}>{course.title}</h1>
    <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,marginBottom:14}}>
      {questions.length} Fragen · Bestehensgrenze {course.pass_threshold}%
      {course.cert_prep && course.external_cert ? ` · Vorbereitung auf ${course.external_cert} (Übung, nicht die offizielle Prüfung)` : ''}
    </p>

    {/* Tabs */}
    {canEdit && (
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button onClick={()=>setTab('exam')} style={{...btnGhost,...(tab==='exam'?{background:GREEN_PALE}:{}),cursor:'pointer'}}>Prüfung</button>
        <button onClick={()=>setTab('manage')} style={{...btnGhost,...(tab==='manage'?{background:GREEN_PALE}:{}),cursor:'pointer'}}>Fragen verwalten</button>
      </div>
    )}

    {/* ===================== PRÜFUNG ===================== */}
    {tab==='exam' && (<>
      {questions.length===0
        ? <div className="kx-card" style={{...card,color:GRAY}}>Für diesen Kurs sind noch keine Fragen hinterlegt.{canEdit?' Wechsle auf „Fragen verwalten", um welche anzulegen oder per KI zu erzeugen.':''}</div>
        : phase==='setup' ? (
          <div className="kx-card" style={card}>
            <h2 style={{fontFamily:FH,fontSize:22,fontWeight:600,color:NAVY,marginBottom:12}}>Übungsmodus wählen</h2>
            {([['ohne_zeit','Ohne Zeit','In Ruhe üben, kein Timer.'],['mit_zeit','Mit Zeit','Mit Countdown, ca. 60 Sekunden pro Frage.'],['benutzerdefiniert','Benutzerdefiniert','Anzahl Fragen und Timer selbst wählen.']] as const).map(([v,t,d])=>(
              <label key={v} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 0',borderBottom:`1px solid ${CREAM}`,cursor:'pointer'}}>
                <input type="radio" name="mode" checked={mode===v} onChange={()=>setMode(v)} style={{marginTop:3,accentColor:GREEN}}/>
                <div><div style={{fontSize:14.5,fontWeight:600,color:NAVY}}>{t}</div><div style={{fontSize:13,color:GRAY}}>{d}</div></div>
              </label>
            ))}
            {mode==='benutzerdefiniert' && (
              <div style={{display:'flex',gap:16,alignItems:'center',marginTop:12,flexWrap:'wrap'}}>
                <div><label style={label}>Anzahl Fragen (max. {questions.length})</label><input className="kx-input" style={{...input,width:140}} type="number" min={1} max={questions.length} value={customCount} onChange={e=>setCustomCount(Math.min(parseInt(e.target.value,10)||1,questions.length))}/></div>
                <label style={{display:'flex',gap:8,alignItems:'center',fontSize:14,color:NAVY,marginTop:18}}><input type="checkbox" checked={customTimed} onChange={e=>setCustomTimed(e.target.checked)} style={{accentColor:GREEN}}/>Mit Timer</label>
              </div>
            )}
            <div style={{marginTop:16}}><button className="kx-btn" style={btn} onClick={startExam}>Übung starten</button></div>
            <p style={{fontSize:12,color:GRAY,marginTop:10}}>Unbegrenzte Versuche. Nach jeder Antwort siehst du die Erklärung.</p>
          </div>
        ) : phase==='running' ? (
          <div className="kx-card" style={card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <span style={{fontFamily:FM,fontSize:12,color:GRAY}}>Frage {idx+1} / {exQ.length}</span>
              {timed && <span style={{fontFamily:FM,fontSize:13,color:timeLeft<30?RED:GOLD}}>⏱ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>}
            </div>
            <div style={{height:6,borderRadius:99,background:'#EDEAE2',overflow:'hidden',marginBottom:16}}><div style={{width:`${((idx)/exQ.length)*100}%`,height:'100%',background:GREEN}}/></div>
            <h2 style={{fontFamily:FH,fontSize:23,fontWeight:600,color:NAVY,marginBottom:14}}>{exQ[idx].question}</h2>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {exQ[idx].options.map((o,i)=>{
                const isSel=sel===i; const isCorrect=i===exQ[idx].correct_index
                let bg='#fff',bc=LINE,col=NAVY
                if(revealed){ if(isCorrect){bg=GREEN_PALE;bc=GREEN;col=GREEN} else if(isSel){bg='#FBEAEA';bc=RED;col=RED} }
                else if(isSel){bg=GREEN_PALE;bc=GREEN}
                return <button key={i} disabled={revealed} onClick={()=>setSel(i)} style={{textAlign:'left',fontFamily:FB,fontSize:14.5,color:col,background:bg,border:`1.5px solid ${bc}`,borderRadius:10,padding:'12px 14px',cursor:revealed?'default':'pointer'}}>{o}</button>
              })}
            </div>
            {revealed && (
              <div style={{marginTop:14,padding:'12px 14px',background:CREAM,borderRadius:10,borderLeft:`4px solid ${sel===exQ[idx].correct_index?GREEN:GOLD}`}}>
                <div style={{fontSize:13.5,fontWeight:600,color:sel===exQ[idx].correct_index?GREEN:NAVY,marginBottom:2}}>{sel===exQ[idx].correct_index?'Richtig':'Nicht ganz'}</div>
                {exQ[idx].explanation && <div style={{fontSize:13.5,color:GRAY,lineHeight:1.5}}>{exQ[idx].explanation}</div>}
              </div>
            )}
            <div style={{marginTop:16}}>
              {!revealed
                ? <button className="kx-btn" style={{...btn,opacity:sel===null?0.6:1}} onClick={check} disabled={sel===null}>Antwort prüfen</button>
                : <button className="kx-btn" style={btn} onClick={next}>{idx+1>=exQ.length?'Auswertung ansehen':'Weiter'}</button>}
            </div>
          </div>
        ) : result ? (
          <div className="kx-card" style={card}>
            <div style={eyebrow}>Auswertung</div>
            <div style={{display:'flex',alignItems:'baseline',gap:14,margin:'8px 0 4px',flexWrap:'wrap'}}>
              <span style={{fontFamily:FH,fontSize:48,fontWeight:700,color:result.passed?GREEN:GOLD,lineHeight:1}}>{result.score}%</span>
              <span style={{fontFamily:FB,fontSize:15,fontWeight:600,color:result.passed?GREEN:GOLD}}>{result.passed?'Bestanden':'Noch nicht bestanden'}</span>
            </div>
            <p style={{fontSize:14,color:GRAY,marginBottom:16}}>{result.correct} von {result.total} richtig · Bestehensgrenze {course.pass_threshold}%</p>
            <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:8}}>Nach Themengebiet</div>
            {Object.entries(result.byTopic).map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${CREAM}`,fontSize:14}}>
                <span style={{color:NAVY}}>{k}</span><span style={{fontFamily:FM,color:v.c===v.t?GREEN:GOLD}}>{v.c}/{v.t}</span>
              </div>
            ))}
            {certNumber && (
              <div style={{marginTop:14,padding:'14px 16px',background:GREEN_PALE,border:`1px solid ${GREEN}`,borderRadius:12}}>
                <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:GREEN,marginBottom:4}}>Zertifikat ausgestellt</div>
                <div style={{fontSize:14,color:NAVY,marginBottom:8}}>KALYX-Abschlusszertifikat · Nr. <span style={{fontFamily:FM}}>{certNumber}</span></div>
                <a href={`/zertifikat?nr=${encodeURIComponent(certNumber)}`} target="_blank" rel="noreferrer" style={{fontFamily:FB,fontSize:13.5,fontWeight:600,color:'#fff',background:GREEN,textDecoration:'none',borderRadius:9,padding:'8px 14px',display:'inline-block'}}>Zertifikat ansehen</a>
              </div>
            )}
            {savedMsg && <p style={{fontSize:12.5,color:savedMsg.includes('nicht')?RED:GRAY,marginTop:12}}>{savedMsg}</p>}
            <div style={{marginTop:18,display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="kx-btn" style={btn} onClick={resetExam}>Nochmal üben</button>
              <a href="/bibliothek" style={{...btnGhost,textDecoration:'none',display:'inline-block'}}>Zur Bibliothek</a>
            </div>
            <p style={{fontSize:12,color:GRAY,marginTop:14}}>Übung und Selbsteinschätzung. Das Bestehen hier ist keine offizielle Zertifizierung.</p>
          </div>
        ) : null}
    </>)}

    {/* ===================== FRAGEN VERWALTEN ===================== */}
    {tab==='manage' && canEdit && (<>
      {/* KI */}
      <div className="kx-card" style={{...card,marginBottom:16}}>
        <div style={{background:GOLD_PALE,borderLeft:`4px solid ${GOLD}`,borderRadius:8,padding:'10px 12px',marginBottom:14}}>
          <span style={{fontSize:13,color:'#7A5C24'}}><b>KI-Fragen, bitte prüfen.</b> Die KI kann Fehler machen. Inhalte vor dem Einsatz kontrollieren.</span>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div><label style={label}>Anzahl Fragen</label><input className="kx-input" style={{...input,width:120}} type="number" min={1} max={12} value={aiCount} onChange={e=>setAiCount(Math.min(parseInt(e.target.value,10)||5,12))}/></div>
          <button className="kx-btn" style={{...btn,opacity:aiGen?0.7:1}} onClick={aiGenerate} disabled={aiGen}>{aiGen?'Erzeuge …':'Fragen per KI erzeugen'}</button>
        </div>
        {aiMsg && <p style={{color:RED,fontSize:13,marginTop:10}}>{aiMsg}</p>}
        {aiDraft && (
          <div style={{marginTop:14}}>
            <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:GRAY,marginBottom:8}}>Vorschau ({aiDraft.length})</div>
            {aiDraft.map((q,i)=>(
              <div key={i} style={{padding:'10px 12px',background:CREAM,borderRadius:10,border:`1px solid ${LINE}`,marginBottom:8}}>
                <div style={{fontSize:14,fontWeight:600,color:NAVY,marginBottom:4}}>{i+1}. {q.question}</div>
                {q.options.map((o,j)=><div key={j} style={{fontSize:13,color:j===q.correct_index?GREEN:GRAY}}>{j===q.correct_index?'✓ ':'• '}{o}</div>)}
                {q.topic && <div style={{fontSize:11.5,color:GOLD,marginTop:4,fontFamily:FM}}>{q.topic}</div>}
                <button onClick={()=>setAiDraft(d=>d?d.filter((_,k)=>k!==i):d)} style={{marginTop:6,fontSize:12,color:RED,background:'none',border:'none',cursor:'pointer',padding:0}}>entfernen</button>
              </div>
            ))}
            {aiDraft.length>0 && <button className="kx-btn" style={{...btn,opacity:aiSaving?0.7:1}} onClick={aiSave} disabled={aiSaving}>{aiSaving?'Speichern …':`${aiDraft.length} Fragen übernehmen`}</button>}
          </div>
        )}
      </div>

      {/* Manuell hinzufügen */}
      <div className="kx-card" style={{...card,marginBottom:16}}>
        <h2 style={{fontFamily:FH,fontSize:20,fontWeight:600,color:NAVY,marginBottom:12}}>Frage manuell hinzufügen</h2>
        <div style={{marginBottom:10}}><label style={label}>Frage</label><input className="kx-input" style={input} value={qText} onChange={e=>setQText(e.target.value)}/></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:8,marginBottom:10}}>
          {opts.map((o,i)=>(
            <div key={i} style={{display:'flex',gap:8,alignItems:'center'}}>
              <input type="radio" name="correct" checked={correctIdx===i} onChange={()=>setCorrectIdx(i)} style={{accentColor:GREEN}} title="richtige Antwort"/>
              <input className="kx-input" style={input} placeholder={`Antwort ${i+1}`} value={o} onChange={e=>setOpts(prev=>prev.map((p,k)=>k===i?e.target.value:p))}/>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          <div><label style={label}>Themengebiet</label><input className="kx-input" style={input} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="z. B. Grundprinzipien"/></div>
          <div><label style={label}>Erklärung</label><input className="kx-input" style={input} value={expl} onChange={e=>setExpl(e.target.value)}/></div>
        </div>
        <p style={{fontSize:12,color:GRAY,marginBottom:10}}>Punkt vor der richtigen Antwort auswählen.</p>
        {mMsg && <p style={{color:RED,fontSize:13,marginBottom:10}}>{mMsg}</p>}
        <button className="kx-btn" style={{...btn,opacity:adding?0.7:1}} onClick={addQuestion} disabled={adding}>{adding?'Speichern …':'Frage hinzufügen'}</button>
      </div>

      {/* Bestehende Fragen */}
      <div className="kx-card" style={card}>
        <h2 style={{fontFamily:FH,fontSize:20,fontWeight:600,color:NAVY,marginBottom:12}}>Fragen in diesem Kurs ({questions.length})</h2>
        {questions.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch keine Fragen.</p> : questions.map((q,i)=>(
          <div key={q.id} style={{padding:'10px 0',borderBottom:`1px solid ${CREAM}`}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:10}}>
              <div style={{fontSize:14,fontWeight:600,color:NAVY}}>{i+1}. {q.question}</div>
              {q.tenant_id ? <button onClick={()=>delQuestion(q.id)} style={{fontSize:12,color:RED,background:'none',border:'none',cursor:'pointer'}}>löschen</button> : <span style={{fontSize:11,color:GRAY,fontFamily:FM}}>Katalog</span>}
            </div>
            {q.options.map((o,j)=><div key={j} style={{fontSize:13,color:j===q.correct_index?GREEN:GRAY}}>{j===q.correct_index?'✓ ':'• '}{o}</div>)}
            {q.topic && <div style={{fontSize:11.5,color:GOLD,marginTop:3,fontFamily:FM}}>{q.topic}</div>}
          </div>
        ))}
      </div>
    </>)}
  </AppShell>)
}
