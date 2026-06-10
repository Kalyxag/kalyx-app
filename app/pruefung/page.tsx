// Ziel-Pfad im Repo: app/pruefung/page.tsx  (ERSETZT – mit Lernschleife)
//
// Prüfung ablegen UND Fragen verwalten. Lernschleife: falsche Fragen werden während
// des Durchgangs zufällig wieder eingestreut und nach der Auswertung in einer Extra-
// Runde wiederholt, bis sie sitzen. Gewertet wird nur der erste Versuch je Frage.
// Aufruf: /pruefung?kurs=<courseId>
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'
import CourseDisclaimerModal from '../components/CourseDisclaimerModal'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', BLUE_PALE='#EAF0FA', BLUE='#3A6DB5', LINE='#E4E0D8', GRAY='#6B7280', RED='#C0392B'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

type Question={id:string;tenant_id:string|null;position:number;topic:string|null;question:string;options:string[];correct_index:number;explanation:string|null;difficulty?:string|null}
type Course={id:string;tenant_id:string|null;title:string;language:string;level:string;sector:string|null;position:string|null;category:string|null;cert_prep:boolean;external_cert:string|null;pass_threshold:number;status:string}
const DIFF:Record<string,{l:string;c:string;b:string}>={leicht:{l:'leicht',c:GREEN,b:GREEN_PALE},mittel:{l:'mittel',c:BLUE,b:BLUE_PALE},schwer:{l:'schwer',c:GOLD,b:GOLD_PALE}}
const shuffle=<T,>(a:T[]):T[]=>{const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r}

export default function PruefungPage(){
  const router=useRouter()
  const [courseId,setCourseId]=useState('')
  const [tenantId,setTenantId]=useState(''); const [uid,setUid]=useState(''); const [email,setEmail]=useState(''); const [certNumber,setCertNumber]=useState('')
  const [course,setCourse]=useState<Course|null>(null)
  const [questions,setQuestions]=useState<Question[]>([])
  const [canEdit,setCanEdit]=useState(false)
  const [loading,setLoading]=useState(true)
  const [tab,setTab]=useState<'exam'|'manage'>('exam')
  const [pendingStart,setPendingStart]=useState(false)

  useEffect(()=>{let on=true;(async()=>{
    const cid=new URLSearchParams(window.location.search).get('kurs')||''
    if(!cid){router.replace('/bibliothek');return}
    const {data}=await supabase.auth.getSession();const session=data.session
    if(!session){router.replace('/anmelden');return}
    const {data:au}=await supabase.from('app_users').select('tenant_id').eq('id',session.user.id).maybeSingle()
    const tid=(au as any)?.tenant_id; if(!tid){router.replace('/anmelden');return}
    if(!on)return
    setCourseId(cid);setTenantId(tid);setUid(session.user.id);setEmail(session.user.email||'')
    const {data:c}=await supabase.from('courses').select('id,tenant_id,title,language,level,sector,position,category,cert_prep,external_cert,pass_threshold,status').eq('id',cid).maybeSingle()
    if(!c){router.replace('/bibliothek');return}
    setCourse(c as Course); setCanEdit(!!(c as Course).tenant_id && (c as Course).tenant_id===tid)
    await loadQuestions(cid)
    if(on) setLoading(false)
  })();return()=>{on=false}},[router])

  async function loadQuestions(cid:string){
    const {data}=await supabase.from('course_questions').select('id,tenant_id,position,topic,question,options,correct_index,explanation,difficulty').eq('course_id',cid).order('position')
    setQuestions((data as Question[])||[])
  }

  // ---------------- Prüfung mit Lernschleife ----------------
  const [phase,setPhase]=useState<'setup'|'running'|'result'|'loop'>('setup')
  const [mode,setMode]=useState<'mit_zeit'|'ohne_zeit'|'benutzerdefiniert'>('ohne_zeit')
  const [customCount,setCustomCount]=useState(20)
  const [customTimed,setCustomTimed]=useState(false)
  const [baseQ,setBaseQ]=useState<Question[]>([])
  const [queue,setQueue]=useState<Question[]>([])
  const [sel,setSel]=useState<number|null>(null)
  const [revealed,setRevealed]=useState(false)
  const firstResults=useRef<Record<string,boolean>>({})
  const lastRef=useRef<{first:boolean;correct:boolean}>({first:false,correct:false})
  const [timed,setTimed]=useState(false)
  const [timeLeft,setTimeLeft]=useState(0)
  const startedRef=useRef<number>(0)
  const [result,setResult]=useState<{correct:number;total:number;score:number;passed:boolean;byTopic:Record<string,{c:number;t:number}>}|null>(null)
  const [wrong,setWrong]=useState<Question[]>([])
  const [savedMsg,setSavedMsg]=useState('')
  // Lernschleife
  const [loopQueue,setLoopQueue]=useState<Question[]>([])
  const [loopSel,setLoopSel]=useState<number|null>(null)
  const [loopRevealed,setLoopRevealed]=useState(false)
  const [loopDone,setLoopDone]=useState(false)

  useEffect(()=>{
    if(phase!=='running'||!timed)return
    if(timeLeft<=0){finishExam();return}
    const t=setTimeout(()=>setTimeLeft(s=>s-1),1000)
    return ()=>clearTimeout(t)
  },[phase,timed,timeLeft])

  function startExam(){
    setPendingStart(true)
  }
  function doStartExam(){
    setPendingStart(false)
    let qs=shuffle(questions)
    let useTimed=false
    if(mode==='benutzerdefiniert'){qs=qs.slice(0,Math.min(customCount,qs.length));useTimed=customTimed}
    else if(mode==='mit_zeit'){useTimed=true}
    firstResults.current={}; lastRef.current={first:false,correct:false}
    setBaseQ(qs); setQueue(qs); setSel(null); setRevealed(false); setResult(null); setWrong([]); setSavedMsg(''); setCertNumber(''); setLoopDone(false)
    setTimed(useTimed); setTimeLeft(qs.length*60); startedRef.current=Date.now()
    setPhase('running')
  }
  function check(){
    if(sel===null)return
    const q=queue[0]; const correct=sel===q.correct_index
    const isFirst=firstResults.current[q.id]===undefined
    if(isFirst) firstResults.current[q.id]=correct
    lastRef.current={first:isFirst,correct}
    setRevealed(true)
  }
  function next(){
    const q=queue[0]; const rest=queue.slice(1)
    // Zufällige Wiedereinstreuung: nur bei erstem Versuch und falsch (mal sofort, mal später)
    if(lastRef.current.first && !lastRef.current.correct && Math.random()<0.4){
      const pos=Math.floor(Math.random()*(rest.length+1)); rest.splice(pos,0,q)
    }
    if(rest.length===0){finishExam();return}
    setQueue(rest); setSel(null); setRevealed(false)
  }
  async function finishExam(){
    const total=baseQ.length
    const correct=baseQ.filter(q=>firstResults.current[q.id]).length
    const score=total>0?Math.round((correct/total)*100):0
    const passed=score>=(course?.pass_threshold??70)
    const byTopic:Record<string,{c:number;t:number}>={}
    baseQ.forEach(q=>{const k=q.topic||'Allgemein';byTopic[k]=byTopic[k]||{c:0,t:0};byTopic[k].t++;if(firstResults.current[q.id])byTopic[k].c++})
    const wrongQ=baseQ.filter(q=>!firstResults.current[q.id])
    setResult({correct,total,score,passed,byTopic}); setWrong(wrongQ); setPhase('result')
    if(course&&tenantId){
      const dur=Math.round((Date.now()-startedRef.current)/1000)
      const answers=baseQ.map(q=>({question_id:q.id,correct:!!firstResults.current[q.id],topic:q.topic||'Allgemein'}))
      const {data:att,error}=await supabase.from('exam_attempts').insert({
        tenant_id:tenantId,course_id:course.id,user_id:uid,mode,total,correct,score,passed,
        answers,duration_sec:dur,started_at:new Date(startedRef.current).toISOString(),completed_at:new Date().toISOString(),
      }).select('id').single()
      setSavedMsg(error?('Versuch konnte nicht gespeichert werden: '+error.message):'Versuch gespeichert.')
      if(passed && !error){
        const {data:ex}=await supabase.from('certificates').select('cert_number').eq('course_id',course.id).eq('user_id',uid).eq('status','gueltig').maybeSingle()
        if((ex as any)?.cert_number){setCertNumber((ex as any).cert_number)}
        else{
          const num='KX-'+new Date().getFullYear()+'-'+Math.random().toString(36).slice(2,10).toUpperCase()
          const {error:cerr}=await supabase.from('certificates').insert({tenant_id:tenantId,course_id:course.id,user_id:uid,attempt_id:(att as any)?.id||null,cert_number:num,title:course.title,recipient_name:email||null,score,status:'gueltig'})
          if(!cerr){
            setCertNumber(num)
            // Slack/Teams-Benachrichtigung serverseitig ausloesen (fire-and-forget, stoert den Ablauf nie)
            try{
              const {data:sess}=await supabase.auth.getSession()
              const tok=sess.session?.access_token
              if(tok){
                fetch('/api/notify-event',{method:'POST',headers:{'content-type':'application/json'},
                  body:JSON.stringify({access_token:tok,course_id:course.id})}).catch(()=>{})
              }
            }catch{}
          }
        }
      }
    }
  }
  function resetExam(){setPhase('setup');setResult(null)}
  function startLoop(){ if(!wrong.length)return; setLoopQueue(shuffle(wrong)); setLoopSel(null); setLoopRevealed(false); setLoopDone(false); setPhase('loop') }
  function loopCheck(){ if(loopSel===null)return; setLoopRevealed(true) }
  function loopNext(){
    const q=loopQueue[0]; const correct=loopSel===q.correct_index; const rest=loopQueue.slice(1)
    if(!correct) rest.push(q) // bis sie sitzt
    if(rest.length===0){ setLoopDone(true); setPhase('result'); return }
    setLoopQueue(rest); setLoopSel(null); setLoopRevealed(false)
  }

  // ---------------- Fragen verwalten ----------------
  const [qText,setQText]=useState(''); const [opts,setOpts]=useState(['','','',''])
  const [correctIdx,setCorrectIdx]=useState(0); const [topic,setTopic]=useState(''); const [expl,setExpl]=useState(''); const [mDiff,setMDiff]=useState('mittel')
  const [mMsg,setMMsg]=useState(''); const [adding,setAdding]=useState(false)
  const [aiCount,setAiCount]=useState(20); const [aiGen,setAiGen]=useState(false)
  const [aiDraft,setAiDraft]=useState<{topic:string;difficulty:string;question:string;options:string[];correct_index:number;explanation:string}[]|null>(null)
  const [aiMsg,setAiMsg]=useState(''); const [aiSaving,setAiSaving]=useState(false)

  async function addQuestion(){
    if(!qText.trim()){setMMsg('Bitte eine Frage eingeben.');return}
    if(opts.filter(o=>o.trim()).length<2){setMMsg('Bitte mindestens zwei Antwortmöglichkeiten.');return}
    setAdding(true);setMMsg('')
    const base=questions.length
    const {error}=await supabase.from('course_questions').insert({course_id:courseId,tenant_id:tenantId,position:base+1,topic:topic.trim()||null,question:qText.trim(),options:opts.map(o=>o.trim()).filter(Boolean),correct_index:Math.min(correctIdx,opts.filter(o=>o.trim()).length-1),explanation:expl.trim()||null,difficulty:mDiff})
    setAdding(false)
    if(error){setMMsg('Speichern fehlgeschlagen: '+error.message);return}
    setQText('');setOpts(['','','','']);setCorrectIdx(0);setTopic('');setExpl('');setMDiff('mittel')
    await loadQuestions(courseId)
  }
  async function delQuestion(id:string){ await supabase.from('course_questions').delete().eq('id',id); await loadQuestions(courseId) }
  async function aiGenerate(){
    if(!course)return
    setAiGen(true);setAiMsg('');setAiDraft(null)
    try{
      const r=await fetch('/api/fragen-generieren',{method:'POST',headers:{'content-type':'application/json'},
        body:JSON.stringify({thema:course.title,anzahl:aiCount,sprache:course.language,niveau:course.level,branche:course.sector,position:course.position,fachgebiete:course.category?[course.category]:[],certPrep:course.cert_prep,externalCert:course.external_cert})})
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
    const rows=aiDraft.map((q,i)=>({course_id:courseId,tenant_id:tenantId,position:base+i+1,topic:q.topic||null,question:q.question,options:q.options,correct_index:q.correct_index,explanation:q.explanation||null,difficulty:q.difficulty||'mittel'}))
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
  const diffBadge=(d?:string|null)=>{const x=DIFF[d||'mittel']||DIFF.mittel;return <span style={{fontFamily:FM,fontSize:10,letterSpacing:'.06em',textTransform:'uppercase',padding:'2px 8px',borderRadius:20,background:x.b,color:x.c}}>{x.l}</span>}

  function QuestionCard({q,selected,onSelect,revealed}:{q:Question;selected:number|null;onSelect:(i:number)=>void;revealed:boolean}){
    return <>
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
        {q.topic && <span style={{fontFamily:FM,fontSize:10.5,color:GRAY}}>{q.topic}</span>}{diffBadge(q.difficulty)}
      </div>
      <h2 style={{fontFamily:FH,fontSize:23,fontWeight:600,color:NAVY,marginBottom:14,lineHeight:1.25}}>{q.question}</h2>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {q.options.map((o,i)=>{
          const isSel=selected===i; const isCorrect=i===q.correct_index
          let bg='#fff',bc=LINE,col=NAVY
          if(revealed){ if(isCorrect){bg=GREEN_PALE;bc=GREEN;col=GREEN} else if(isSel){bg='#FBEAEA';bc=RED;col=RED} }
          else if(isSel){bg=GREEN_PALE;bc=GREEN}
          return <button key={i} disabled={revealed} onClick={()=>onSelect(i)} style={{textAlign:'left',fontFamily:FB,fontSize:14.5,color:col,background:bg,border:`1.5px solid ${bc}`,borderRadius:10,padding:'12px 14px',cursor:revealed?'default':'pointer'}}>{o}</button>
        })}
      </div>
      {revealed && (
        <div style={{marginTop:14,padding:'12px 14px',background:CREAM,borderRadius:10,borderLeft:`4px solid ${selected===q.correct_index?GREEN:GOLD}`}}>
          <div style={{fontSize:13.5,fontWeight:600,color:selected===q.correct_index?GREEN:NAVY,marginBottom:2}}>{selected===q.correct_index?'Richtig':'Nicht ganz'}</div>
          {q.explanation && <div style={{fontSize:13.5,color:GRAY,lineHeight:1.5}}>{q.explanation}</div>}
        </div>
      )}
    </>
  }

  if(loading) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Lade Prüfung …</div></AppShell>
  if(!course) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Kurs nicht gefunden.</div></AppShell>

  const scored=Object.keys(firstResults.current).length
  const isRepeat=phase==='running'&&queue[0]&&firstResults.current[queue[0].id]!==undefined

  return(<>
    {pendingStart && course && uid && tenantId && (
      <CourseDisclaimerModal
        courseId={course.id}
        userId={uid}
        tenantId={tenantId}
        onAcknowledged={doStartExam}
      />
    )}
    <AppShell active="lernen">
    <a href="/bibliothek" className="kx-link" style={{fontFamily:FB,fontSize:13.5,color:GREEN,textDecoration:'none'}}>← Bibliothek</a>
    <div style={{...eyebrow,marginTop:8}}>Prüfung &amp; Übung</div>
    <h1 style={{fontFamily:FH,fontSize:30,fontWeight:600,color:NAVY,margin:'4px 0 4px'}}>{course.title}</h1>
    <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,marginBottom:14}}>
      {questions.length} Fragen · Bestehensgrenze {course.pass_threshold}%
      {course.cert_prep && course.external_cert ? ` · Vorbereitung auf ${course.external_cert} (Übung, nicht die offizielle Prüfung)` : ''}
    </p>

    {canEdit && (
      <div style={{display:'flex',gap:8,marginBottom:16}}>
        <button onClick={()=>setTab('exam')} style={{...btnGhost,...(tab==='exam'?{background:GREEN_PALE}:{})}}>Prüfung</button>
        <button onClick={()=>setTab('manage')} style={{...btnGhost,...(tab==='manage'?{background:GREEN_PALE}:{})}}>Fragen verwalten</button>
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
            <p style={{fontSize:12,color:GRAY,marginTop:10}}>Unbegrenzte Versuche. Nach jeder Antwort siehst du die Erklärung. Falsch beantwortete Fragen kommen zur Übung erneut.</p>
          </div>
        ) : phase==='running' ? (
          <div className="kx-card" style={card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <span style={{fontFamily:FM,fontSize:12,color:GRAY}}>Frage {Math.min(scored+ (revealed?0:1), baseQ.length)} / {baseQ.length}{isRepeat?'  ·  Wiederholung':''}</span>
              {timed && <span style={{fontFamily:FM,fontSize:13,color:timeLeft<30?RED:GOLD}}>⏱ {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>}
            </div>
            <div style={{height:6,borderRadius:99,background:'#EDEAE2',overflow:'hidden',marginBottom:16}}><div style={{width:`${(scored/baseQ.length)*100}%`,height:'100%',background:GREEN}}/></div>
            {isRepeat && <div style={{fontFamily:FM,fontSize:11,color:GOLD,marginBottom:8}}>Diese Frage kommt zur Übung noch einmal (zählt nicht erneut für die Wertung).</div>}
            <QuestionCard q={queue[0]} selected={sel} onSelect={setSel} revealed={revealed}/>
            <div style={{marginTop:16}}>
              {!revealed
                ? <button className="kx-btn" style={{...btn,opacity:sel===null?0.6:1}} onClick={check} disabled={sel===null}>Antwort prüfen</button>
                : <button className="kx-btn" style={btn} onClick={next}>{queue.length<=1 && !(lastRef.current.first&&!lastRef.current.correct)?'Auswertung ansehen':'Weiter'}</button>}
            </div>
          </div>
        ) : phase==='loop' ? (
          <div className="kx-card" style={card}>
            <div style={eyebrow}>Lernschleife</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'6px 0 12px'}}>
              <span style={{fontFamily:FB,fontSize:14,color:NAVY}}>Falsch beantwortete Fragen wiederholen</span>
              <span style={{fontFamily:FM,fontSize:12,color:GRAY}}>noch {loopQueue.length}</span>
            </div>
            <QuestionCard q={loopQueue[0]} selected={loopSel} onSelect={setLoopSel} revealed={loopRevealed}/>
            <div style={{marginTop:16}}>
              {!loopRevealed
                ? <button className="kx-btn" style={{...btn,opacity:loopSel===null?0.6:1}} onClick={loopCheck} disabled={loopSel===null}>Antwort prüfen</button>
                : <button className="kx-btn" style={btn} onClick={loopNext}>{(loopSel===loopQueue[0].correct_index && loopQueue.length<=1)?'Abschliessen':'Weiter'}</button>}
            </div>
            <p style={{fontSize:12,color:GRAY,marginTop:10}}>Eine Frage verlässt die Schleife erst, wenn du sie richtig beantwortet hast.</p>
          </div>
        ) : result ? (
          <div className="kx-card" style={card}>
            <div style={eyebrow}>Auswertung</div>
            <div style={{display:'flex',alignItems:'baseline',gap:14,margin:'8px 0 4px',flexWrap:'wrap'}}>
              <span style={{fontFamily:FH,fontSize:48,fontWeight:700,color:result.passed?GREEN:GOLD,lineHeight:1}}>{result.score}%</span>
              <span style={{fontFamily:FB,fontSize:15,fontWeight:600,color:result.passed?GREEN:GOLD}}>{result.passed?'Bestanden':'Noch nicht bestanden'}</span>
            </div>
            <p style={{fontSize:14,color:GRAY,marginBottom:16}}>{result.correct} von {result.total} richtig (erster Versuch) · Bestehensgrenze {course.pass_threshold}%</p>
            <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:GRAY,marginBottom:8}}>Nach Fachgebiet</div>
            {Object.entries(result.byTopic).map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${CREAM}`,fontSize:14}}>
                <span style={{color:NAVY}}>{k}</span><span style={{fontFamily:FM,color:v.c===v.t?GREEN:GOLD}}>{v.c}/{v.t}</span>
              </div>
            ))}
            {loopDone && <div style={{marginTop:14,padding:'10px 14px',background:GREEN_PALE,border:`1px solid ${GREEN}`,borderRadius:10,fontSize:13.5,color:GREEN,fontWeight:600}}>Alle wiederholten Fragen sitzen jetzt. Stark.</div>}
            {certNumber && (
              <div style={{marginTop:14,padding:'14px 16px',background:GREEN_PALE,border:`1px solid ${GREEN}`,borderRadius:12}}>
                <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:GREEN,marginBottom:4}}>Zertifikat ausgestellt</div>
                <div style={{fontSize:14,color:NAVY,marginBottom:8}}>KALYX-Abschlusszertifikat · Nr. <span style={{fontFamily:FM}}>{certNumber}</span></div>
                <a href={`/zertifikat?nr=${encodeURIComponent(certNumber)}`} target="_blank" rel="noreferrer" style={{fontFamily:FB,fontSize:13.5,fontWeight:600,color:'#fff',background:GREEN,textDecoration:'none',borderRadius:9,padding:'8px 14px',display:'inline-block'}}>Zertifikat ansehen</a>
              </div>
            )}
            {savedMsg && <p style={{fontSize:12.5,color:savedMsg.includes('nicht')?RED:GRAY,marginTop:12}}>{savedMsg}</p>}
            <div style={{marginTop:18,display:'flex',gap:10,flexWrap:'wrap'}}>
              {wrong.length>0 && <button className="kx-btn" style={btn} onClick={startLoop}>Falsch beantwortete üben ({wrong.length})</button>}
              <button className="kx-btn" style={btnGhost} onClick={resetExam}>Ganze Übung neu</button>
              <a href="/bibliothek" style={{...btnGhost,textDecoration:'none',display:'inline-block'}}>Zur Bibliothek</a>
            </div>
            <p style={{fontSize:12,color:GRAY,marginTop:14}}>Übung und Selbsteinschätzung. Das Bestehen hier ist keine offizielle Zertifizierung.</p>
          </div>
        ) : null}
    </>)}

    {/* ===================== FRAGEN VERWALTEN ===================== */}
    {tab==='manage' && canEdit && (<>
      <div className="kx-card" style={{...card,marginBottom:16}}>
        <div style={{background:GOLD_PALE,borderLeft:`4px solid ${GOLD}`,borderRadius:8,padding:'10px 12px',marginBottom:14}}>
          <span style={{fontSize:13,color:'#7A5C24'}}><b>KI-Fragen, bitte fachlich prüfen.</b> Anspruchsvolle Übungsfragen, nach Fachgebiet und Schwierigkeit. Vor dem Einsatz kontrollieren.</span>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div><label style={label}>Anzahl Fragen</label><input className="kx-input" style={{...input,width:120}} type="number" min={1} max={30} value={aiCount} onChange={e=>setAiCount(Math.min(parseInt(e.target.value,10)||20,30))}/></div>
          <button className="kx-btn" style={{...btn,opacity:aiGen?0.7:1}} onClick={aiGenerate} disabled={aiGen}>{aiGen?'Erzeuge …':'Fragen per KI erzeugen'}</button>
          <span style={{fontSize:12,color:GRAY}}>Branche &amp; Position des Kurses fließen automatisch ein.</span>
        </div>
        {aiMsg && <p style={{color:RED,fontSize:13,marginTop:10}}>{aiMsg}</p>}
        {aiDraft && (
          <div style={{marginTop:14}}>
            <div style={{fontFamily:FM,fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:GRAY,marginBottom:8}}>Vorschau ({aiDraft.length})</div>
            {aiDraft.map((q,i)=>(
              <div key={i} style={{padding:'10px 12px',background:CREAM,borderRadius:10,border:`1px solid ${LINE}`,marginBottom:8}}>
                <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>{diffBadge(q.difficulty)}{q.topic && <span style={{fontSize:11.5,color:GOLD,fontFamily:FM}}>{q.topic}</span>}</div>
                <div style={{fontSize:14,fontWeight:600,color:NAVY,marginBottom:4}}>{i+1}. {q.question}</div>
                {q.options.map((o,j)=><div key={j} style={{fontSize:13,color:j===q.correct_index?GREEN:GRAY}}>{j===q.correct_index?'✓ ':'• '}{o}</div>)}
                <button onClick={()=>setAiDraft(d=>d?d.filter((_,k)=>k!==i):d)} style={{marginTop:6,fontSize:12,color:RED,background:'none',border:'none',cursor:'pointer',padding:0}}>entfernen</button>
              </div>
            ))}
            {aiDraft.length>0 && <button className="kx-btn" style={{...btn,opacity:aiSaving?0.7:1}} onClick={aiSave} disabled={aiSaving}>{aiSaving?'Speichern …':`${aiDraft.length} Fragen übernehmen`}</button>}
          </div>
        )}
      </div>

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
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
          <div><label style={label}>Themengebiet</label><input className="kx-input" style={input} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="z. B. Grundprinzipien"/></div>
          <div><label style={label}>Schwierigkeit</label><select className="kx-input" style={input} value={mDiff} onChange={e=>setMDiff(e.target.value)}><option value="leicht">leicht</option><option value="mittel">mittel</option><option value="schwer">schwer</option></select></div>
          <div><label style={label}>Erklärung</label><input className="kx-input" style={input} value={expl} onChange={e=>setExpl(e.target.value)}/></div>
        </div>
        <p style={{fontSize:12,color:GRAY,marginBottom:10}}>Punkt vor der richtigen Antwort auswählen.</p>
        {mMsg && <p style={{color:RED,fontSize:13,marginBottom:10}}>{mMsg}</p>}
        <button className="kx-btn" style={{...btn,opacity:adding?0.7:1}} onClick={addQuestion} disabled={adding}>{adding?'Speichern …':'Frage hinzufügen'}</button>
      </div>

      <div className="kx-card" style={card}>
        <h2 style={{fontFamily:FH,fontSize:20,fontWeight:600,color:NAVY,marginBottom:12}}>Fragen in diesem Kurs ({questions.length})</h2>
        {questions.length===0 ? <p style={{color:GRAY,fontSize:14}}>Noch keine Fragen.</p> : questions.map((q,i)=>(
          <div key={q.id} style={{padding:'10px 0',borderBottom:`1px solid ${CREAM}`}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center'}}>
              <div style={{fontSize:14,fontWeight:600,color:NAVY}}>{i+1}. {q.question}</div>
              <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>{diffBadge(q.difficulty)}{q.tenant_id ? <button onClick={()=>delQuestion(q.id)} style={{fontSize:12,color:RED,background:'none',border:'none',cursor:'pointer'}}>löschen</button> : <span style={{fontSize:11,color:GRAY,fontFamily:FM}}>Katalog</span>}</div>
            </div>
            {q.options.map((o,j)=><div key={j} style={{fontSize:13,color:j===q.correct_index?GREEN:GRAY}}>{j===q.correct_index?'✓ ':'• '}{o}</div>)}
            {q.topic && <div style={{fontSize:11.5,color:GOLD,marginTop:3,fontFamily:FM}}>{q.topic}</div>}
          </div>
        ))}
      </div>
    </>)}
  </AppShell>
  </>)
}
